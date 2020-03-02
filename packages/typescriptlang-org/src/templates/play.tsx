import React, { useEffect } from "react"
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

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      const params = new URLSearchParams(location.search)
      const tsVersion = params.get("ts") || playgroundReleases.versions.pop()

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
          text: i("play_default_code_sample"),
          compilerOptions: {},
          domID: "monaco-editor-embed",
          useJavaScript: !!params.get("useJavaScript"),
          acquireTypes: !localStorage.getItem("disable-ata"),
          logger: {
            error: console.error,
            log: console.log
          },
        }, main, ts)

        const playgroundConfig = {
          lang: props.pageContext.lang,
          prefix: withPrefix("/")
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
      });
    }

    document.body.appendChild(getLoaderScript);
  })


  return (
    <Layout disableBetaNotification title={i("head_playground_title")} description={i("head_playground_description")} lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
      {/** This is the top nav, which is outside of the editor  */}
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name"><span>Playground</span></li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{i("play_subnav_config")} <span className="caret"></span></a>
            <ul className="examples-dropdown">
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
            <a href="#" id="whatisnew-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{i("play_subnav_examples")} <span className="caret"></span></a>
            <ul className="examples-dropdown" id="examples" >
              <button className="examples-close">{i("play_subnav_examples_close")}</button>
              <RenderExamples defaultSection="JavaScript" sections={["JavaScript", "TypeScript"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" id="examples-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{i("play_subnav_whatsnew")} <span className="caret"></span></a>
            <ul className="examples-dropdown" id="whatisnew">
              <button className="examples-close">{i("play_subnav_examples_close")}</button>
              <RenderExamples defaultSection="3.8" sections={["3.8", "3.7", "Playground"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>
        </ul>

        <ul className="nav navbar-nav navbar-right hidden-xs">

          {/**
            <li><a href="#">About</a></li>
            <li><a href="https://github.com/microsoft/typescript-website">GitHub</a></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Theme <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a id="theme-light" href="#" >Light</a></li>
                <li><a id="theme-dark" href="#" >Dark</a></li>
                <li><a id="theme-dark-hc" href="#" >Dark (High Contrast)</a></li>
              </ul>
            </li>
             */}

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
                <li id="versions" className="dropdown">
                  <a href="#">{i("play_downloading_version")}... <span className="caret" /></a>
                  <ul className="dropdown-menu versions"></ul>
                </li>
                <li><a id="run-button" href="#">{i("play_toolbar_run")}</a></li>

                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{i("play_toolbar_export")} <span className="caret"></span></a>
                  <ul className="dropdown-menu">
                    <li><a href="#" onClick={() => playground.exporter.reportIssue()} >{i("play_export_report_issue")}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.copyAsMarkdownIssue()} >{i("play_export_copy_md")}</a></li>
                    <li><a href="#" onClick={() => playground.exporter.copyForChat()} >{i("play_export_copy_link")}</a></li>
                    < li > <a href="#" onClick={() => playground.exporter.copyForChatWithPreview()} >{i("play_export_copy_link_preview")}</a></li>
                    < li role="separator" className="divider" ></li>
                    <li><a href="#" onClick={() => playground.exporter.openInTSAST()} >{i("play_export_tsast")}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInCodeSandbox()}>{i("play_export_sandbox")}</a></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInStackBlitz()}>{i("play_export_stackblitz")}</a></li>
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
