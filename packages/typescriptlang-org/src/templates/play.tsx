import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"

import "./play.scss"
import { RenderExamples } from "../components/ShowExamples"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { headCopy } from "../copy/en/head-seo"
import { withIntl, Intl } from "../components/Intl"


// This gets set by the playground
declare const playground: ReturnType<typeof import("typescript-playground").setupPlayground>

type Props = {
  pageContext: {
    lang: string
    examplesTOC: typeof import("../../static/js/examples/en.json")
    optionsSummary: any // this is just passed through to the playground JS library at this point
  }
}

const defaultText =
  `// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A place to learn TypeScript in a place where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript

const anExampleVariable = "Hello World"
console.log(anExampleVariable)

// To learn more about the language, click above in "Examples" or "What's New".
// Otherwise, get started by removing these comments and the world is your playground.
`

const Play = (props: Props) => {
  const i = createInternational<typeof headCopy>(useIntl())


  useEffect(() => {
    if ("playgroundLoaded" in window) return
    window["playgroundLoaded"] = true

    // @ts-ignore
    window.optionsSummary = props.pageContext.optionsSummary

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      const params = new URLSearchParams(location.search)
      const tsVersion = params.get("ts") || "3.7.3"

      // @ts-ignore
      const re = global.require
      re.config({
        paths: {
          vs: `https://tswebinfra.blob.core.windows.net/cdn/${tsVersion}/monaco/min/vs`,
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

        const sandboxEnv = await sandbox.createTypeScriptSandbox({
          text: defaultText,
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

        playground.setupPlayground(sandboxEnv, main, playgroundConfig)
        sandboxEnv.editor.focus()

        const darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
        if (darkModeEnabled.matches) {
          sandboxEnv.monaco.editor.setTheme("sandbox-dark");
        }

        darkModeEnabled.addListener((e) => {
          const darkModeOn = e.matches;
          const newTheme = darkModeOn ? "sandbox-dark" : "sandbox-light"
          sandboxEnv.monaco.editor.setTheme(newTheme);
        });


        const container = document.getElementById("playground-container")!
        container.style.display = "flex"
        container.style.height = `${window.innerHeight - Math.round(container.getClientRects()[0].top) - 18}px`
      });
    }

    document.body.appendChild(getLoaderScript);
  })


  return (
    <Layout disableBetaNotification locale={props.pageContext.lang} title={i("head_playground_title")} description={i("head_playground_description")}>
      {/** This is the top nav, which is outside of the editor  */}
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name"><span>Playground</span></li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Config <span className="caret"></span></a>
            <ul className="examples-dropdown">
              <h3>Config</h3>
              <div className="info" id="config-container">
                <button className="examples-close">Close</button>

                <div id="compiler-dropdowns">
                  <label className="select">
                    <span className="select-label">Lang</span>
                    <select id="language-selector">
                      <option>TypeScript</option>
                      <option>JavaScript</option>
                    </select>
                    <span className="compiler-flag-blurb">Which language should be used in the editor</span>
                  </label>
                </div>

              </div>
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Examples <span className="caret"></span></a>
            <ul className="examples-dropdown" id="examples" >
              <button className="examples-close">Close</button>
              <RenderExamples defaultSection="JavaScript" sections={["JavaScript", "TypeScript"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">What's New <span className="caret"></span></a>
            <ul className="examples-dropdown" id="whatisnew">
              <button className="examples-close">Close</button>
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
          <p id="loading-message">Downloading TypeScript...</p>
        </div>
        <div id="playground-container" style={{ display: "none" }}>
          <div id="editor-container">
            <div id="editor-toolbar" className="navbar-sub" >

              <ul>
                <li id="versions" className="dropdown">
                  <a href="#">Version... <span className="caret" /></a>
                  <ul className="dropdown-menu versions"></ul>
                </li>
                <li><a id="run-button" href="#">Run</a></li>

                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Export <span className="caret"></span></a>
                  <ul className="dropdown-menu">
                    <li><a href="#" onClick={() => playground.exporter.reportIssue()} >Report GitHub issue on TypeScript</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.copyAsMarkdownIssue()} >Copy as Markdown Issue</a></li>
                    <li><a href="#" onClick={() => playground.exporter.copyForChat()} >Copy as Markdown Link</a></li>
                    <li><a href="#" onClick={() => playground.exporter.copyForChatWithPreview()} >Copy as Markdown Link with Preview</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.openInTSAST()} >Open in TypeScript AST Viewer</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInCodeSandbox()}>Open in CodeSandbox</a></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInStackBlitz()}>Open in StackBlitz</a></li>
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


export default (props: Props) => <Intl><Play {...props} /></Intl>
