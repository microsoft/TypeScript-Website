import React, { useEffect } from "react"
import { Layout } from "../../components/layout"
import { withPrefix } from "gatsby"
import { twoslasher } from "ts-twoslasher"
import { createDefaultMapFromCDN } from "typescript-vfs"

import { renderToHTML } from "gatsby-remark-shiki/src/renderer"

import "./dev.scss"
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
  // console.log(s.subtr(3));
}
fn(42);
`
          const isOK = main && ts && sandboxEnv
          if (isOK) {
            document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
          }

          const sandbox = await sandboxEnv.createTypeScriptSandbox({ text: initialCode, compilerOptions: {}, domID: "monaco-editor-embed", useJavaScript: false }, main, ts)
          sandbox.editor.focus()

          // @ts-ignore
          window.sandbox = sandbox

          const mapWithLibFiles = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2015 }, '3.7.3', true, ts, sandbox.lzstring as any)

          const runTwoslash = () => {
            const newContent = sandbox.getText()
            mapWithLibFiles.set("index.ts", newContent)

            try {
              const newResults = twoslasher(newContent, "tsx", ts, sandbox.lzstring as any, mapWithLibFiles)
              const codeAsFakeShikiTokens = newResults.code.split("\n").map(line => [{ content: line }])
              const html = renderToHTML(codeAsFakeShikiTokens, {}, newResults)

              const results = document.getElementById("twoslash-results")!

              document.getElementById("twoslash-failure")!.style.display = "none"
              document.getElementBy
              Id("twoslash-results")!.innerHTML = html

              // Remove all the kids
              while (results.firstChild) {
                results.removeChild(results.firstChild)
              }

              const p = document.createElement("p")
              p.innerText = newResults.extension
              p.className = "extension"

              const code = document.createElement("div")
              code.innerHTML = html

              const a = document.createElement("a")
              a.innerText = "Playground"
              a.href = newResults.playgroundURL

              results.appendChild(p)
              results.appendChild(code)
              results.appendChild(a)

            } catch (error) {
              console.log(error)
              document.getElementById("twoslash-results")!.style.display = "block"
              document.getElementById("twoslash-failure")!.style.display = "none"
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

            document.querySelectorAll("#example-buttons .disabled").forEach(button => {
              button.classList.remove("disabled")
            })

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
        <div id="dev">
          <DevNav />
          <div className="ms-depth-4 content" style={{ backgroundColor: "white", padding: "2rem", margin: "2rem", marginTop: "1rem" }}>
            <div style={{ width: "calc(100% - 600px)" }}>
              <h1 style={{ marginTop: "0" }}>TypeScript Twoslash</h1>
            </div>
            <div style={{ width: "600px" }}>
            </div>
          </div>

          <div className="ms-depth-4 content" style={{ backgroundColor: "white", padding: "2rem", margin: "2rem", marginTop: "1rem" }}>
            <div style={{ width: "600px", }}>
              <h3 style={{ marginTop: "0" }}>Markup</h3>
              <div id="loader">
                <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                <p id="loading-message">Downloading Sandbox...</p>
              </div>
              <div style={{ height: "300px" }} id="monaco-editor-embed" />
              <div id="example-buttons">
                {codeSamples.map(code => {
                  const setExample = (e) => {
                    console.log("---", e.target)
                    if (e.target.classList.contains("disabled")) return

                    // document.getElementById("exampleBlurb")!.innerText = code.blurb
                    // @ts-ignore
                    window.sandbox.setText(code.code)
                  }
                  return <div className="button disabled" onClick={setExample}>{code.name}</div>
                }
                )}
              </div>
            </div>

            <div style={{ width: "calc(100% - 600px)", paddingLeft: "20px", borderLeft: "1px solid gray" }}>
              <h3 style={{ marginTop: "0" }}>Results</h3>
              <div id="twoslash-results">
              </div>
              <div id="twoslash-failure"></div>
            </div>
          </div>


          <div className="ms-depth-4" style={{ backgroundColor: "white", padding: "2rem", margin: "2rem" }}>
            <h2>Usage</h2>
            <p>A sandbox uses the same tools as monaco-editor, meaning this library is shipped as an AMD bundle which you can use the <a href="https://github.com/microsoft/vscode-loader/">VSCode Loader</a> to <code>require</code>.</p>
            <p>Because we need it for the TypeScript website, you can use our hosted copy <a href="https://typescriptlang.org/v2/js/vs.loader.js">here.</a> (<em>note</em>, we will eventually deprecate the /v2/ in all routes)</p>

            <h3>Get Started</h3>
            <p>Create a new file: <code>index.html</code> and paste this code into that file.</p>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Index

const codeSamples = [
  {
    name: "Show Errors",
    blurb: "Something",
    code: `// @target: ES2015
// @errors: 7006

function fn(s) {
  console.log(s.subtr(3))
}

fn(42)`
  }, {
    name: "Set Compiler Flags",
    blurb: "Get the DTS for the user's editor",
    code: `// @noImplicitAny: false
// @target: ES2015

// This will not throw because of the noImplicitAny
function fn(s) {
  console.log(s.subtr(3))
}

fn(42);`
  }, {
    name: "Trims code",
    blurb: "Make a request for an LSP response",
    code: `interface IdLabel { id: number, /* some fields */ }
interface NameLabel { name: string, /* other fields */ }
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "unimplemented"
}

let a = createLabel("typescript");`
  },
  {
    name: "Show the DTS",
    blurb: "Change compiler flags using a few different APIs",
    code: `// @declaration: true
// @showEmit
// @showEmittedFile: index.d.ts

/**
 * Gets the length of a string
 * @param value a string
 */
export function getStringLength(value: string) {
  return value
}
`
  },
  {
    name: "Highlights",
    blurb: "Highlight some code in the editor",
    code: `function greet(person: string, date: Date) {
  console.log(\`Hello \${person}, today is \${date.toDateString()}!\`);
}

greet("Maddison", new Date());
//                ^^^^^^^^^^
`
  }
]
