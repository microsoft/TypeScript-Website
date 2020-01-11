import React, { useEffect } from "react"
import { Layout } from "../../components/layout"
import { withPrefix } from "gatsby"
import { twoslasher } from "ts-twoslasher"
import { createDefaultMapFromCDN } from "typescript-vfs"

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
        // This triggers making "ts" available in the global scope
        re(["vs/language/typescript/lib/typescriptServices"], async (ts) => {
          const initialCode = `// @noImplicitAny: false
// @errors: 7006
function fn(s) {
  // No error when noImplicitAny: false
  // try remove it in the editor
  console.log(s.subtr(3));
}
fn(42);
`
          const isOK = main && ts && sandboxEnv
          if (isOK) {
            document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
          }

          const sandbox = await sandboxEnv.createTypeScriptSandbox({ text: initialCode, compilerOptions: {}, domID: "monaco-editor-embed", useJavaScript: false }, main, ts)
          sandbox.editor.focus()

          const mapWithLibFiles = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2015 }, '3.7.3', true, ts, sandbox.lzstring as any)

          const runTwoslash = () => {
            const newContent = sandbox.getText()
            mapWithLibFiles.set("index.ts", newContent)

            try {
              const newResults = twoslasher(newContent, "tsx", ts, sandbox.lzstring as any, mapWithLibFiles)
              document.getElementById("twoslash-results")!.textContent = JSON.stringify(newResults)

            } catch (error) {
              console.log(error)
              document.getElementById("twoslash-results")!.textContent = error
            }
          }

          let debouncingTimerLock = false
          sandbox.editor.onDidChangeModelContent((e) => {
            if (debouncingTimerLock) return
            debouncingTimerLock = true

            runTwoslash()
            setTimeout(() => {
              debouncingTimerLock = false

            }, 300)
          })
          runTwoslash()

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
      })
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
            <pre><code id="twoslash-results" style={{ whiteSpace: "pre-wrap" }}></code>
            </pre>
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
