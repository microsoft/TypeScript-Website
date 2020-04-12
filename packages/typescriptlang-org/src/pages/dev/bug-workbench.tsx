import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Layout } from "../../components/layout"
import { withPrefix, graphql } from "gatsby"
import { BugWorkbenchQuery } from "../../__generated__/gatsby-types"

import "../../templates/play.scss"
import { RenderExamples } from "../../components/ShowExamples"

import { useIntl } from "react-intl";
import { createInternational } from "../../lib/createInternational"
import { headCopy } from "../../copy/en/head-seo"
import { playCopy } from "../../copy/en/playground"

import { Intl } from "../../components/Intl"

import { workbenchHelpPlugin } from "../../components/workbench/plugins/help"
import { workbenchResultsPlugin } from "../../components/workbench/plugins/results"
import { workbenchEmitPlugin } from "../../components/workbench/plugins/emits"
import { workbenchAssertionsPlugin } from "../../components/workbench/plugins/assertions"
import { createDefaultMapFromCDN } from "@typescript/vfs"
import { twoslasher } from "@typescript/twoslash"

type Props = {
  data: BugWorkbenchQuery
}


const Play: React.FC<Props> = (props) => {
  const i = createInternational<typeof headCopy & typeof playCopy>(useIntl())
  let dtsMap: Map<string, string> = new Map()

  useEffect(() => {
    if ("playgroundLoaded" in window) return
    window["playgroundLoaded"] = true

    // @ts-ignore - so the config options can use localized descriptions
    window.optionsSummary = props.pageContext.optionsSummary
    // @ts-ignore - for React-based plugins
    window.react = React
    // @ts-ignore - for React-based plugins
    window.reactDOM = ReactDOM
    // @ts-ignore - so that plugins etc can use local functions
    window.i = i

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      const params = new URLSearchParams(location.search)
      // nothing || Nightly -> next || original ts param
      const supportedVersion = !params.get("ts") ? undefined : params.get("ts") === "Nightly" ? "next" : params.get("ts")
      const tsVersion = supportedVersion || "next"

      // @ts-ignore
      const re = global.require
      re.config({
        paths: {
          vs: `https://typescript.azureedge.net/cdn/${tsVersion}/monaco/min/vs`,
          "typescript-sandbox": withPrefix('/js/sandbox'),
          "typescript-playground": withPrefix('/js/playground'),
          "unpkg": "https://unpkg.com/",
          "local": "http://localhost:5000"
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index", "typescript-playground/index"], async (main: typeof import("monaco-editor"), tsWorker: any, sandbox: typeof import("typescript-sandbox"), playground: typeof import("typescript-playground")) => {
        // Importing "vs/language/typescript/tsWorker" will set ts as a global
        const ts = (global as any).ts
        const isOK = main && ts && sandbox && playground
        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        } else {
          console.error("Errr")
          console.error("main", !!main, "ts", !!ts, "sandbox", !!sandbox, "playground", !!playground)
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
          useJavaScript: !!params.get("useJavaScript"),
          acquireTypes: !localStorage.getItem("disable-ata")
        }, main, ts)

        const playgroundConfig = {
          lang: "en",
          prefix: withPrefix("/"),
          supportCustomPlugins: false,
          plugins: [
            workbenchAssertionsPlugin,
            workbenchResultsPlugin,
            workbenchEmitPlugin,
            workbenchHelpPlugin,
          ]
        }

        const playgroundEnv = playground.setupPlayground(sandboxEnv, main, playgroundConfig, i as any, React)

        const updateDTSEnv = (opts) => {
          createDefaultMapFromCDN(opts, tsVersion, true, ts, sandboxEnv.lzstring as any).then((defaultMap) => {
            dtsMap = defaultMap
            runTwoslash()
          })
        }

        // When the compiler notices a twoslash compiler flag change, this will get triggered and reset the DTS map 
        sandboxEnv.setDidUpdateCompilerSettings(updateDTSEnv)
        updateDTSEnv(sandboxEnv.getCompilerOptions())

        let debouncingTimer = false
        sandboxEnv.editor.onDidChangeModelContent(_event => {
          // This needs to be last in the function
          if (debouncingTimer) return
          debouncingTimer = true
          setTimeout(() => {
            debouncingTimer = false
            if (dtsMap) runTwoslash()
          }, 500)
        })

        const runTwoslash = () => {
          const code = sandboxEnv.getText()

          try {
            const twoslash = twoslasher(code, sandboxEnv.filepath.split(".")[1], ts, sandboxEnv.lzstring as any, dtsMap)
            // playgroundEnv.plugins.forEach()
            console.log("twoslash:")
            console.log(twoslash)
            playgroundEnv.plugins.forEach(p => {
              if ("getResults" in p) {
                p.getResults(sandboxEnv, twoslash)
              }
            })
          } catch (error) {
            const err = error as Error
            console.log(err)
          }
        }

        // Dark mode faff
        const darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
        if (darkModeEnabled.matches) {
          sandboxEnv.monaco.editor.setTheme("sandbox-dark");
        }

        // On the chance you change your dark mode settings 
        darkModeEnabled.addListener((e) => {
          const darkModeOn = e.matches;
          const newTheme = darkModeOn ? "sandbox-dark" : "sandbox-light"
          sandboxEnv.monaco.editor.setTheme(newTheme);
        });

        sandboxEnv.editor.focus()
        sandboxEnv.editor.layout()
      });
    }

    document.body.appendChild(getLoaderScript);
  }, [])


  return (
    <Layout title={i("head_playground_title")} description={i("head_playground_description")} lang="en" allSitePage={props.data.allSitePage}>
      {/** This is the top nav, which is outside of the editor  */}
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name hide-small"><span>Bug Workbench</span></li>
        </ul>

        <ul className="nav navbar-nav navbar-right hidden-xs"></ul>
      </nav>

      <div className="raised" style={{ paddingTop: "0", marginTop: "0", marginBottom: "3rem", paddingBottom: "1.5rem" }}>
        <div id="loader">
          <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <p id="loading-message">{i("play_downloading_typescript")}</p>
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

export const query = graphql`
  query BugWorkbench {
    ...AllSitePage
  }
`
