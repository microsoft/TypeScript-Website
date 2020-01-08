import React, { useEffect } from "react"
import { Layout } from "../../components/layout"
import { withPrefix } from "gatsby"
import { twoslasher } from "ts-twoslasher"

import "./sandbox.scss"
import { DevNav } from "../../components/dev-nav"


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
          sandbox: '/js/sandbox'
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "sandbox/index"], async (main: typeof import("monaco-editor"), ts: typeof import("typescript"), sandboxEnv: typeof import("typescript-sandbox")) => {
        const initialCode = `import {markdown, danger} from "danger"

export default async function () {
    // Check for new @types in devDependencies
    const packageJSONDiff = await danger.git.JSONDiffForFile("package.json")
    const newDeps = packageJSONDiff.devDependencies.added
    const newTypesDeps = newDeps?.filter(d => d.includes("@types")) ?? []
    if (newTypesDeps.length){
        markdown("Added new types packages " + newTypesDeps.join(", "))
    }
}`
        const isOK = main && ts && sandboxEnv
        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        }

        const sandbox = await sandboxEnv.createTypeScriptSandbox({ text: initialCode, compilerOptions: {}, domID: "monaco-editor-embed", useJavaScript: false }, main, ts)
        sandbox.editor.focus()
        sandbox.editor.onDidChangeModelContent((e) => {
          const newContent = sandbox.getText()
          const host = {
            fileExists: false,
            readFileSync: () => ""
          }
          const newResults = twoslasher(newContent, "tsx", sandbox.ts, sandbox.lzstring, host)
          console.log(newResults)
        })

        setTimeout(() => {
          document.querySelectorAll(".html-code").forEach(codeElement => {
            sandbox.monaco.editor.colorize(codeElement.textContent || "", "html", { tabSize: 2 }).then(newHTML => {
              codeElement.innerHTML = newHTML
            })
          })

          document.querySelectorAll(".ts-code").forEach(codeElement => {
            sandbox.monaco.editor.colorize(codeElement.textContent || "", "typescript", { tabSize: 2 }).then(newHTML => {
              codeElement.innerHTML = newHTML
            })
          })
        }, 300)
      });
    }

    document.body.appendChild(getLoaderScript);
  })

  return (
    <>
      <Layout>
        <DevNav />
        <div className="ms-depth-4 content" style={{ backgroundColor: "white", padding: "2rem", margin: "2rem", marginTop: "1rem" }}>
          <div style={{ width: "calc(100% - 600px)" }}>
            <h1 style={{ marginTop: "0" }}>TypeScript Twoslash</h1>
          </div>
          <div style={{ width: "600px", marginLeft: "20px", borderLeft: "1px solid gray" }}>
            <div id="loader">
              <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <p id="loading-message">Downloading Sandbox...</p>
            </div>
            <div style={{ height: "400px" }} id="monaco-editor-embed" />
          </div>
        </div>

        <div className="ms-depth-4" style={{ backgroundColor: "white", padding: "2rem", margin: "2rem" }}>
          <h2>Usage</h2>
          <p>A sandbox uses the same tools as monaco-editor, meaning this library is shipped as an AMD bundle which you can use the <a href="https://github.com/microsoft/vscode-loader/">VSCode Loader</a> to <code>require</code>.</p>
          <p>Because we need it for the TypeScript website, you can use our hosted copy <a href="https://typescriptlang.org/v2/js/vs.loader.js">here.</a> (<em>note</em>, we will eventually deprecate the /v2/ in all routes)</p>

          <h3>Get Started</h3>
          <p>Create a new file: <code>index.html</code> and paste this code into that file.</p>
        </div>
      </Layout>
    </>
  )

}




export default Index
