import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"

import "./play.scss"

const Index = (props: any) => {
  useEffect(() => {
    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      // @ts-ignore
      const re = global.require

      re.config({
        paths: {
          vs: "https://tswebinfra.blob.core.windows.net/cdn/3.7.3/monaco/min/vs",
          "typescript-sandbox": '/js/sandbox',
          "typescript-playground": '/js/playground'
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index", "typescript-playground/index"], async (main: typeof import("monaco-editor"), ts: typeof import("typescript"), sandbox: typeof import("typescript-sandbox"), playground: typeof import("typescript-playground")) => {
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

        playground.setupPlayground(sandboxEnv)
        sandboxEnv.editor.focus()
      });
    }

    document.body.appendChild(getLoaderScript);
  })

  return (
    <>
      <Layout>
        {/** This is the top nav, which is outside of the editor  */}
        <nav className="navbar-sub">
          <ul className="nav">
            <li className="name"><span>Playground</span></li>

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Examples <span className="caret"></span></a>
              <ul className="dropdown-menu examples" id="examples" >
                <li><a href="#">Loading Examples...</a></li>
              </ul>
            </li>

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Config <span className="caret"></span></a>
              <ul className="dropdown-menu" >
                <div className="info" id="config"></div>
              </ul>
            </li>

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">What's new <span className="caret"></span></a>
              <ul className="dropdown-menu examples" id="whatisnew">
                <li><a href="#">Loading What is New...</a></li>
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

        <div className="ms-depth-4" style={{ backgroundColor: "white", marginLeft: "-60px", marginRight: "-60px", margin: "1rem auto", padding: "2rem", paddingTop: "0" }}>
          <h1 id="loader" style={{ textAlign: "center" }}>Loading</h1>
          <div id="playground-container">
            <div id="editor-container">
              <div id="editor-toolbar" className="navbar-sub">
                <ul >
                  <li className="dropdown"><a>Version...</a></li>
                  <li><a>Run</a></li>
                  <li><a>Format</a></li>
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Export <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><a id="export-create-gh-issue" href="#" >Report GitHub issue on TypeScript</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a id="export-copy-issue-markdown" href="#" >Copy as Markdown Issue</a></li>
                      <li><a id="export-copy-markdown" href="#" >Copy as Markdown Link</a></li>
                      <li><a id="export-copy-markdown" href="#" >Copy as Markdown Link with Preview</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a id="export-copy-markdown" href="#" >Open in TypeScript AST Viewer</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a id="export-open-code-sandbox" href="#">Open in CodeSandbox</a></li>
                      <li><a id="export-open-stackblitz" href="#" >Open in StackBlitz</a></li>
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
