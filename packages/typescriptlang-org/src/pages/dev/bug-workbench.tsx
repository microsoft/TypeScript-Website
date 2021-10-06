import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Layout } from "../../components/layout"
import { withPrefix, graphql } from "gatsby"
import { debounce } from 'ts-debounce';

import "../../templates/play.scss"

import { useIntl } from "react-intl";
import { createInternational } from "../../lib/createInternational"
import { headCopy } from "../../copy/en/head-seo"
import { playCopy } from "../../copy/en/playground"

import { Intl } from "../../components/Intl"

import { workbenchHelpPlugin as workbenchAboutPlugin } from "../../components/workbench/plugins/about"
import { workbenchDebugPlugin } from "../../components/workbench/plugins/debug"
import { workbenchAssertionsPlugin } from "../../components/workbench/plugins/assertions"
import { workbenchMarkdownPlugin } from "../../components/workbench/plugins/markdown"
import { workbenchReferencePlugin } from "../../components/workbench/plugins/docs"
import { createDefaultMapFromCDN } from "@typescript/vfs"
import { twoslasher, TwoSlashReturn } from "@typescript/twoslash"
import { getPlaygroundUrls } from "../../lib/playgroundURLs";
import Helmet from "react-helmet";

type TwoSlashReturns = import("@typescript/twoslash").TwoSlashReturn

type Props = {}

const Play: React.FC<Props> = (props) => {
  const i = createInternational<typeof headCopy & typeof playCopy>(useIntl())
  let dtsMap: Map<string, string> = new Map()

  useEffect(() => {
    if ("playgroundLoaded" in window) return
    window["playgroundLoaded"] = true

    // @ts-ignore - for React-based plugins
    window.react = React
    // @ts-ignore - for React-based plugins
    window.reactDOM = ReactDOM
    // @ts-ignore - so that plugins etc can use local functions
    window.i = i

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = async () => {
      const params = new URLSearchParams(location.search)

      let tsVersionParam = params.get("ts")
      // handle the nightly lookup 
      if (!tsVersionParam || tsVersionParam && tsVersionParam === "Nightly" || tsVersionParam === "next") {
        // Avoids the CDN to doubly skip caching
        const nightlyLookup = await fetch("https://tswebinfra.blob.core.windows.net/indexes/next.json", { cache: "no-cache" })
        const nightlyJSON = await nightlyLookup.json()
        tsVersionParam = nightlyJSON.version
      }
      // Allow prod/staging builds to set a custom commit prefix to bust caches
      const {sandboxRoot, playgroundRoot, playgroundWorker} = getPlaygroundUrls()
            
      // @ts-ignore
      const re: any = global.require
      re.config({
        paths: {
          vs: `https://typescript.azureedge.net/cdn/${tsVersionParam}/monaco/min/vs`,
          "typescript-sandbox": sandboxRoot,
          "typescript-playground": playgroundRoot,
          "unpkg": "https://unpkg.com/",
          "local": "http://localhost:5000"
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index"], async (main: typeof import("monaco-editor"), tsWorker: any, sandbox: typeof import("@typescript/sandbox")) => {
        // Importing "vs/language/typescript/tsWorker" will set ts as a global
        const ts = (global as any).ts
        const isOK = main && ts && sandbox
        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        } else {
          console.error("Errr")
          console.error("main", !!main, "ts", !!ts, "sandbox", !!sandbox)
        }

        // Set the height of monaco to be either your window height or 600px - whichever is smallest
        const container = document.getElementById("playground-container")!
        container.style.display = "flex"
        const height = Math.max(window.innerHeight, 600)
        container.style.height = `${height - Math.round(container.getClientRects()[0].top) - 18}px`

        // Create the sandbox
        const sandboxEnv = await sandbox.createTypeScriptSandbox({
          text: localStorage.getItem('sandbox-history') || i("play_default_code_sample"),
          compilerOptions: {},
          domID: "monaco-editor-embed",
          filetype: "ts",
          acquireTypes: !localStorage.getItem("disable-ata"),
          supportTwoslashCompilerOptions: true,
          monacoSettings: {
            fontFamily: "var(--code-font)",
            fontLigatures: true
          },
          customTypeScriptWorkerPath: document.location.origin + playgroundWorker

        }, main, ts)

        const playgroundConfig = {
          lang: "en",
          prefix: withPrefix("/"),
          supportCustomPlugins: false,
          plugins: [
            workbenchAboutPlugin,
            workbenchReferencePlugin,
            workbenchAssertionsPlugin,
            workbenchMarkdownPlugin,
            workbenchDebugPlugin
          ]
        }

        const playgroundEnv = window.setupPlayground(sandboxEnv, main, playgroundConfig, i as any, React)

        const utils = playgroundEnv.createUtils(sandbox, React)

        const updateDTSEnv = (opts) => {
          createDefaultMapFromCDN(opts, tsVersionParam!, true, ts, sandboxEnv.lzstring as any).then((defaultMap) => {
            dtsMap = defaultMap
            runTwoslash()
          })

        }

        // When the compiler notices a twoslash compiler flag change, this will get triggered and reset the DTS map
        sandboxEnv.setDidUpdateCompilerSettings(updateDTSEnv)
        updateDTSEnv(sandboxEnv.getCompilerOptions())

        const debouncedTwoslash = debounce(() => {
          if (dtsMap) runTwoslash()

          const isTSErrorsEnabled = !sandboxEnv.languageServiceDefaults.getDiagnosticsOptions().noSemanticValidation
          const shouldBeEnabled = !sandboxEnv.getText().includes("// @filename")
          if (isTSErrorsEnabled !== shouldBeEnabled) {
            // Turn off the suggestions for multi-file reports
            sandboxEnv.languageServiceDefaults.setDiagnosticsOptions({ noSemanticValidation: !shouldBeEnabled })
          }
        }, 1000)

        sandboxEnv.editor.onDidChangeModelContent(debouncedTwoslash)

        let currentTwoslashResults: Error | TwoSlashReturn | undefined = undefined
        let currentDTSMap: Map<string, string> | undefined = undefined

        let isError = (e: any) => e && e.stack && e.message;

        playgroundEnv.setDidUpdateTab((newPlugin) => {
          if (!isError(currentTwoslashResults) && "getResults" in newPlugin) {
            // @ts-ignore
            newPlugin.getResults(sandboxEnv, currentTwoslashResults, currentDTSMap, sandboxEnv.getText().includes("// @showEmit"))
          } else if ("noResults" in newPlugin) {
            // @ts-ignore
            newPlugin.noResults(currentTwoslashResults, currentTwoslashResults)
          }
        })

        const runTwoslash = () => {
          const code = sandboxEnv.getText()
          if (!code) return

          try {
            currentDTSMap = new Map(dtsMap)
            const twoslashConfig = { noStaticSemanticInfo: true, emit: true, noErrorValidation: true } as const
            const ext = sandboxEnv.filepath.split(".")[1]
            const twoslash: TwoSlashReturns = twoslasher(code, ext, {
              defaultOptions: twoslashConfig,
              tsModule: ts,
              lzstringModule: sandboxEnv.lzstring as any,
              fsMap: currentDTSMap
            })
            currentTwoslashResults = twoslash

            const currentPlugin = playgroundEnv.getCurrentPlugin()
            if ("getResults" in currentPlugin) {
              // @ts-ignore
              currentPlugin.getResults(sandboxEnv, twoslash, currentDTSMap, code.includes("// @showEmit"))
            }

            const assertionCount = twoslash.queries.length + (code.includes("// @showEmit") ? 1 : 0) + twoslash.errors.length
            utils.setNotifications("assertions", assertionCount)

          } catch (error) {
            const err = error as Error
            console.log(err)
            currentTwoslashResults = err
            const currentPlugin = playgroundEnv.getCurrentPlugin()
            if ("noResults" in currentPlugin) {
              // @ts-ignore
              currentPlugin.noResults(sandboxEnv, err)
            }
            utils.setNotifications("assertions", 1)
          }
        }

        // Dark mode faff
        const darkModeEnabled = document.documentElement.classList.contains("dark-theme")
        if (darkModeEnabled) {
          sandboxEnv.monaco.editor.setTheme("sandbox-dark");
        }

        sandboxEnv.editor.focus()
        sandboxEnv.editor.layout()
      });
    }

    document.body.appendChild(getLoaderScript);
  }, [])


  return (
    <Layout title="Bug Workbench" description="Create reproductions of issues with TypeScript" lang="en">
      {/** This is the top nav, which is outside of the editor  */}
      <Helmet>
        <script src="/js/playground/2/index.js"/>
      </Helmet>
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name hide-small"><span>Bug Workbench</span></li>
        </ul>

        <ul className="nav navbar-nav navbar-right hidden-xs"></ul>
      </nav>

      <div className="raised" style={{ paddingTop: "0", marginTop: "0", marginBottom: "3rem", paddingBottom: "1.5rem" }}>
        <div id="loader">
          <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <p id="loading-message" role="status">{i("play_downloading_typescript")}</p>
        </div>
        <div id="playground-container" style={{ display: "none" }}>
          <div id="editor-container">
            <div id="editor-toolbar" className="navbar-sub" >

              <ul>
                <li id="versions" className="dropdown">
                  <a href="#">{i("play_downloading_version")}... <span className="caret" /></a>
                  <ul className="dropdown-menu versions"></ul>
                </li>
                { /* <li><a id="run-button" href="#">{i("play_toolbar_run")}</a></li> */}

              </ul>
              <ul className="right">
                <li><a id="sidebar-toggle" aria-label="Hide Sidebar" href="#">&#x21E5;</a></li>
              </ul>
            </div>
            { /** This is the div which monaco is added into  **/}
            <div id="monaco-editor-embed" />
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default (props: Props) => <Intl locale="en"><Play {...props} /></Intl>
