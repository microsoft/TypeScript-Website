import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Layout } from "../components/layout"
import { withPrefix, graphql } from "gatsby"
import { PlayQuery } from "../__generated__/gatsby-types"

import "./play.scss"
import { RenderExamples } from "../components/ShowExamples"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { headCopy } from "../copy/en/head-seo"
import { playCopy } from "../copy/en/playground"

import { Intl } from "../components/Intl"

import playgroundReleases from "../../../sandbox/src/releases.json"

// This gets set by the playground
declare const playground: ReturnType<typeof import("typescript-playground").setupPlayground>

type Props = {
  data: PlayQuery
  pageContext: {
    lang: string
    examplesTOC: typeof import("../../static/js/examples/en.json")
    optionsSummary: any // this is just passed through to the playground JS library at this point
  }
}

const Play: React.FC<Props> = (props) => {
  const i = createInternational<typeof headCopy & typeof playCopy>(useIntl())

  useEffect(() => {
    if ("playgroundLoaded" in window) return
    window["playgroundLoaded"] = true

    // @ts-ignore - so the config options can use localized descriptions
    window.optionsSummary = props.pageContext.optionsSummary
    // @ts-ignore - for React-based plugins
    window.react = React
    // @ts-ignore - for React-based plugins
    window.reactDOM = ReactDOM
    // @ts-ignore - so that plugins etc can use i8n
    window.i = i

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      const params = new URLSearchParams(location.search)
      // nothing || Nightly -> next || original ts param which should be a release of monaco
      const supportedVersion = !params.get("ts") ? undefined : params.get("ts") === "Nightly" ? "next" : params.get("ts")
      const tsVersion = supportedVersion || playgroundReleases.versions.sort().pop()

      // Because we can reach to localhost ports from the site, it's possible for the locally built compiler to 
      // be hosted and to power the editor with a bit of elbow grease.
      const useLocalCompiler = tsVersion === "dev"
      const urlForMonaco = useLocalCompiler ? "http://localhost:5615/dev/vs" : `https://typescript.azureedge.net/cdn/${tsVersion}/monaco/dev/vs`

      // @ts-ignore
      const re: any = global.require
      re.config({
        paths: {
          vs: urlForMonaco,
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
          lang: props.pageContext.lang,
          prefix: withPrefix("/"),
          supportCustomPlugins: true
        }

        playground.setupPlayground(sandboxEnv, main, playgroundConfig, i as any, React)

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
    <Layout title={i("head_playground_title")} description={i("head_playground_description")} lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
      {/** This is the top nav, which is outside of the editor  */}
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name hide-small"><span>Playground</span></li>

          <li className="dropdown">
            <a id="compiler-options-button" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="compiler-options-dropdown">{i("play_subnav_config")} <span className="caret"></span></a>
            <ul id="compiler-options-dropdown" className="examples-dropdown" aria-labelledby="compiler-options-button">
              <h3>{i("play_subnav_config")}</h3>
              <div className="info" id="config-container">
                <button className="examples-close">{i("play_subnav_examples_close")}</button>

                <div id="compiler-dropdowns">
                  <label className="select">
                    <span className="select-label">Lang</span>
                    <select id="language-selector">
                      <option>TypeScript</option>
                      <option>JavaScript</option>
                    </select>
                    <span className="compiler-flag-blurb">{i("play_config_language_blurb")}</span>
                  </label>
                </div>

              </div>
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" id="examples-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="examples">{i("play_subnav_examples")} <span className="caret"></span></a>
            <ul className="examples-dropdown" id="examples" aria-labelledby="examples-button">
              <button className="examples-close" aria-label="Close dropdown" role="button">{i("play_subnav_examples_close")}</button>
              <RenderExamples defaultSection="JavaScript" sections={["JavaScript", "TypeScript"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" id="whatisnew-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="whatisnew">{i("play_subnav_whatsnew")} <span className="caret"></span></a>
            <ul className="examples-dropdown" id="whatisnew" aria-labelledby="whatisnew-button">
              <button role="button" aria-label="Close dropdown" className="examples-close">{i("play_subnav_examples_close")}</button>
              <RenderExamples defaultSection="3.8" sections={["3.8", "3.7", "Playground"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>
        </ul>

        <ul className="nav navbar-nav navbar-right hidden-xs">
          <li><a href="#" id="playground-settings" role="button">Settings</a></li>
        </ul>
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
                <li id="versions" className="dropdown" >
                  <a href="#" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="versions-dropdown" id='versions-button'>{i("play_downloading_version")}... <span className="caret" /></a>
                  <ul className="dropdown-menu versions" id="versions-dropdown" aria-labelledby="versions-button"></ul>
                </li>
                <li><a id="run-button" href="#" role="button">{i("play_toolbar_run")}</a></li>

                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" aria-controls="export-dropdown-menu">{i("play_toolbar_export")} <span className="caret"></span></a>
                  <ul className="dropdown-menu" id='export-dropdown-menu' aria-labelledby="whatisnew-button">
                    <li><a href="#" onClick={() => playground.exporter.reportIssue()} aria-label={i("play_export_report_issue")} >{i("play_export_report_issue")}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.copyAsMarkdownIssue()} aria-label={i("play_export_copy_md")} >{i("play_export_copy_md")}</a></li>
                    <li><a href="#" onClick={() => playground.exporter.copyForChat()} aria-label={i("play_export_copy_link")}  >{i("play_export_copy_link")}</a></li>
                    < li > <a href="#" onClick={() => playground.exporter.copyForChatWithPreview()} aria-label={i("play_export_copy_link_preview")}  >{i("play_export_copy_link_preview")}</a></li>
                    < li role="separator" className="divider" ></li>
                    <li><a href="#" onClick={() => playground.exporter.openInTSAST()} aria-label={i("play_export_tsast")}  >{i("play_export_tsast")}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInCodeSandbox()} aria-label={i("play_export_sandbox")} >{i("play_export_sandbox")}</a></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInStackBlitz()} aria-label={i("play_export_stackblitz")} >{i("play_export_stackblitz")}</a></li>
                  </ul>
                </li>
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


export default (props: Props) => <Intl locale={props.pageContext.lang}><Play {...props} /></Intl>

export const query = graphql`
  query Play {
    ...AllSitePage
  }
`
