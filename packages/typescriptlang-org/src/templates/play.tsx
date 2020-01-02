import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"

import "./play.scss"
import { RenderExamples } from "../components/ShowExamples"

// This gets set by the playground
declare const playground: ReturnType<typeof import("typescript-playground").setupPlayground>

type Props = {
  pageContext: {
    lang: string
    examplesTOC: typeof import("../../static/js/examples/en.json")
  }
}

const Index = (props: Props) => {
  useEffect(() => {
    if ("playgroundLoaded" in window) return
    window["playgroundLoaded"] = true

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
          "typescript-sandbox": '/js/sandbox',
          "typescript-playground": '/js/playground'
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index", "typescript-playground/index"], async (main: typeof import("monaco-editor"), tsWorker: any, sandbox: typeof import("typescript-sandbox"), playground: typeof import("typescript-playground")) => {
        // Importing "vs/language/typescript/tsWorker" will set ts as a global
        const ts = (global as any).ts
        const initialCode = `import {markdown} from "danger"

markdown("OK")`
        const isOK = main && ts && sandbox && playground
        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        } else {
          console.error("Errr")
          console.error("main", !!main, "ts", !!ts, "sandbox", !!sandbox, "playground", !!playground)
        }

        const sandboxEnv = await sandbox.createTypeScriptSandbox({
          text: initialCode,
          compilerOptions: {},
          domID: "monaco-editor-embed",
          useJavaScript: false,
          logger: {
            error: console.error,
            log: console.log
          }
        }, main, ts)

        const playgroundConfig = {
          lang: props.pageContext.lang,
          prefix: withPrefix("/")
        }

        playground.setupPlayground(sandboxEnv, main, playgroundConfig)
        sandboxEnv.editor.focus()
        document.getElementById("playground-container")!.style.display = "flex"
      });
    }

    document.body.appendChild(getLoaderScript);
  })

  return (
    <>
      <Layout disableBetaNotification>
        {/** This is the top nav, which is outside of the editor  */}
        <nav className="navbar-sub">
          <ul className="nav">
            <li className="name"><span>Playground</span></li>

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Examples <span className="caret"></span></a>
              <ul className="examples-dropdown" id="examples" >
                <RenderExamples defaultSection="JavaScript" sections={["JavaScript", "TypeScript"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
              </ul>
            </li>

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Config <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <div className="info" id="config"></div>
              </ul>
            </li>

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">What's new <span className="caret"></span></a>
              <ul className="examples-dropdown" id="whatisnew">
                <RenderExamples defaultSection="3.7" sections={["3.7", "Playground"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
              </ul>
            </li>
          </ul>

          <ul className="nav navbar-nav navbar-right hidden-xs">
            <li><a href="#">About</a></li>
            <li><a href="https://github.com/microsoft/typescript-website">GitHub</a></li>

            {/**
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

        <div className="ms-depth-4" style={{ backgroundColor: "white", margin: "1rem auto", padding: "2rem", paddingTop: "0", marginTop: "0" }}>
          <h1 id="loader" style={{ textAlign: "center", height: "800px" }}>Loading</h1>
          <div id="playground-container" style={{ display: "none" }}>
            <div id="editor-container">
              <div id="editor-toolbar" className="navbar-sub" >
                <ul>
                  <li id="versions" className="dropdown">
                    <a href="#">Version... <span className="caret" /></a>
                    <ul className="dropdown-menu"></ul>
                  </li>
                  <li><a href="#">Run</a></li>
                  <li><a href="#">Format</a></li>

                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Export <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><a id="export-create-gh-issue" href="#" onClick={() => playground.exporter.reportIssue()} >Report GitHub issue on TypeScript</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a id="export-copy-issue-markdown" href="#" onClick={() => playground.exporter.copyAsMarkdownIssue()} >Copy as Markdown Issue</a></li>
                      <li><a id="export-copy-markdown" href="#" onClick={() => playground.exporter.copyForChat()} >Copy as Markdown Link</a></li>
                      <li><a id="export-copy-markdown" href="#" onClick={() => playground.exporter.copyForChatWithPreview()} >Copy as Markdown Link with Preview</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a id="export-copy-markdown" href="#" onClick={() => playground.exporter.openInTSAST()} >Open in TypeScript AST Viewer</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a id="export-open-code-sandbox" href="#" onClick={() => playground.exporter.openProjectInCodeSandbox()}>Open in CodeSandbox</a></li>
                      <li><a id="export-open-stackblitz" href="#" onClick={() => playground.exporter.openProjectInStackBlitz()}>Open in StackBlitz</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
              { /** This is the div which monaco is added into  **/}
              <div id="monaco-editor-embed" />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}


export default Index
