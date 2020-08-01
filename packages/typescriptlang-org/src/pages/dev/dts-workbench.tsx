import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Layout } from "../../components/layout"
import { withPrefix, graphql } from "gatsby"
import { DTSWorkbenchQuery } from "../../__generated__/gatsby-types"
import { debounce } from 'ts-debounce';

import "../../templates/play.scss"

import { useIntl } from "react-intl";
import { createInternational } from "../../lib/createInternational"
import { headCopy } from "../../copy/en/head-seo"
import { playCopy } from "../../copy/en/playground"

import { Intl } from "../../components/Intl"

import { workbenchAboutPlugin } from "../../components/workbench/dts/about"

type Props = {
  data: DTSWorkbenchQuery
}

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
    getLoaderScript.onload = () => {
      const params = new URLSearchParams(location.search)
      // nothing || Nightly -> next || original ts param
      const supportedVersion = !params.get("ts") ? undefined : params.get("ts") === "Nightly" ? "next" : params.get("ts")
      const tsVersion = supportedVersion || "next"

      // @ts-ignore
      const re: any = global.require
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
            workbenchAboutPlugin
          ]
        }

        const playgroundEnv = playground.setupPlayground(sandboxEnv, main, playgroundConfig, i as any, React)
        const utils = playgroundEnv.createUtils(sandbox, React)

        const debouncedTwoslash = debounce(() => {
          // if (dtsMap) runTwoslash()
        }, 1000)

        sandboxEnv.editor.onDidChangeModelContent(debouncedTwoslash)

        playgroundEnv.setDidUpdateTab((newPlugin) => {

        })

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
    <Layout title="Bug Workbench" description="Create reproductions of issues with TypeScript" lang="en" allSitePage={props.data.allSitePage}>
      {/** This is the top nav, which is outside of the editor  */}
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name hide-small"><span>.D.TS Workbench</span></li>
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

export const query = graphql`
  query DTSWorkbench {
    ...AllSitePage
  }
`
