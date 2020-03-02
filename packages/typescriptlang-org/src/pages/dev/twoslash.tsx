import React, { useEffect } from "react"
import { Layout } from "../../components/layout"
import { withPrefix, graphql } from "gatsby"
import { twoslasher } from "ts-twoslasher"
import { createDefaultMapFromCDN } from "typescript-vfs"
import { renderToHTML } from "gatsby-remark-shiki/src/renderer"

import "./dev.scss"
import { Intl } from "../../components/Intl"
import { DevNav } from "../../components/dev-nav"
import { isTouchDevice } from "../../lib/isTouchDevice"
import { SuppressWhenTouch } from "../../components/SuppressWhenTouch"
import { TwoSlashQuery } from "../../__generated__/gatsby-types"

/** Note: to run all the web infra in debug, run:
  localStorage.debug = '*'

  to remove logging: localStorage.debug = undefined
 */

type Props = {
  data: TwoSlashQuery
}

const Index: React.FC<Props> = (props) => {
  useEffect(() => {
    // No monaco for touch
    if (isTouchDevice()) { return }

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      // @ts-ignore
      const re = global.require

      re.config({
        paths: {
          vs: "https://typescript.azureedge.net/cdn/3.7.3/monaco/min/vs",
          sandbox: withPrefix('/js/sandbox')
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "sandbox/index"], async (main: typeof import("monaco-editor"), ts: typeof import("typescript"), sandboxEnv: typeof import("typescript-sandbox")) => {
        // This triggers making "ts" available in the global scope
        re(["vs/language/typescript/lib/typescriptServices"], async (ts) => {
          const isOK = main && ts && sandboxEnv
          if (isOK) {
            document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
          }
          document.getElementById("monaco-editor-embed")!.style.display = "block"
          const sandbox = await sandboxEnv.createTypeScriptSandbox({ text: codeSamples[0].code, compilerOptions: {}, domID: "monaco-editor-embed", supportTwoslashCompilerOptions: true }, main, ts)
          sandbox.editor.focus()

          // @ts-ignore
          window.sandbox = sandbox

          const mapWithLibFiles = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2016 }, '3.7.3', true, ts, sandbox.lzstring as any)

          const runTwoslash = () => {
            const newContent = sandbox.getText()
            mapWithLibFiles.set("index.ts", newContent)

            try {
              const newResults = twoslasher(newContent, "tsx", ts, sandbox.lzstring as any, mapWithLibFiles)
              const codeAsFakeShikiTokens = newResults.code.split("\n").map(line => [{ content: line }])
              const html = renderToHTML(codeAsFakeShikiTokens, {}, newResults)

              const results = document.getElementById("twoslash-results")!

              document.getElementById("twoslash-failure")!.style.display = "none"
              document.getElementById("twoslash-results")!.innerHTML = html

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
              const err = error as Error
              const failure = document.getElementById("twoslash-failure")

              if (!failure) return;
              failure.style.display = "block"

              while (failure.firstChild) {
                failure.removeChild(failure.firstChild)
              }

              const content = document.createElement("div")
              content.className = "err-content"

              const header = document.createElement("h3")
              header.textContent = "Exception Raised"

              const text = document.createElement("p")
              const opener = err.name.startsWith("Error") ? err.name.split("Error")[1] : err.name
              text.textContent = opener + err.message.split("## Code")[0]

              content.appendChild(header)
              content.appendChild(text)
              failure.appendChild(content)

              console.log(error)
            }
          }

          let debouncingTimerLock = false
          sandbox.editor.onDidChangeModelContent((e) => {
            if (debouncingTimerLock) return
            debouncingTimerLock = true

            runTwoslash()
            setTimeout(() => {
              debouncingTimerLock = false
              runTwoslash()
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
      <Layout title="Developers - Twoslash Code Samples" description="Learn about the TypeScript code sample library twoslash. Used for transpiling, providing hover to identifiers and compiler-driven error states." lang="en" allSitePage={props.data.allSitePage}>
        <div id="dev">
          <DevNav active="twoslash" />
          <div className="raised content main-content-block">
            <div className="split-fifty">
              <div>
                <h1 style={{ marginTop: "20px" }}>TypeScript Twoslash</h1>
                <p>A markup format for TypeScript code, ideal for creating self-contained code samples which let the TypeScript compiler do the extra leg-work.</p>
                <p>If you know TypeScript, you basically know twoslash.</p>
                <p>Twoslash adds the ability to declare tsconfig options inline, split a sample into multiple files and a few other useful commands. You can see the full API <a href="https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher">inside the README</a></p>
              </div>
              <div>
                <h1 style={{ marginTop: "0" }}>&nbsp;</h1>
                <p>The Twoslash markup language helps with:</p>
                <ul>
                  <li>Enforcing accurate errors from a TypeScript code sample, and leaving the messaging to the compiler</li>
                  <li>Splitting a code sample to hide distracting code</li>
                  <li>Declaratively highlighting symbols in your code sample</li>
                  <li>Replacing code with the results of transpilation to different files, or ancillary files like .d.ts or .map files</li>
                  <li>Handle multi-file imports in a single code sample</li>
                  <li>Creating a playground link for the code</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="raised content main-content-block">

            <div className="sixhundred">
              <SuppressWhenTouch>
                <h3 style={{ marginTop: "0" }}>Markup</h3>
                <p id="exampleBlurb">{codeSamples[0].blurb}</p>
                <div id="loader">
                  <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  <p id="loading-message">Downloading Sandbox...</p>
                </div>
                <div style={{ height: "300px", display: "none" }} id="monaco-editor-embed" />
                <div id="example-buttons">
                  {codeSamples.map(code => {
                    const setExample = (e) => {
                      if (e.target.classList.contains("disabled")) return

                      document.getElementById("exampleBlurb")!.innerText = code.blurb
                      // @ts-ignore
                      window.sandbox.setText(code.code)
                    }
                    return <div className="button disabled" onClick={setExample}>{code.name}</div>
                  }
                  )}
                </div>
              </SuppressWhenTouch>
            </div>

            <div className="sixhundred" style={{ paddingLeft: "20px", borderLeft: "1px solid gray", position: "relative" }}>
              <SuppressWhenTouch>
                <h3 style={{ marginTop: "0" }}>Results</h3>

                <div id="twoslash-results" />
                <div id="twoslash-failure" />
              </SuppressWhenTouch>
            </div>
          </div>

          <div className="raised main-content-block">
            <h2>Usage</h2>
            <p>Twoslash will be available on npm soon, for now it's only being used in the TypeScript website.</p>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default (props: Props) => <Intl><Index {...props} /></Intl>

// prettier-ignore
const codeSamples = [
  {
    name: "Highlights runtime types",
    blurb: "See how TS Twoslash will grab the highlight information for identifiers in your code",
    code: `// @errors: 2532
declare const quantumString: string | undefined;

// Right now this string is in two states, hover below to see
quantumString
  
if (quantumString) {
  // However, in here we now have a different type
  // you can verify by hovering below
  quantumString.length;
}
    `
  },
  {
    name: "Show Errors",
    blurb: "Twoslash will help highlight compiler error messages",
    code: `// @errors: 7006
function fn(s) {
  console.log(s.subtr(3))
}

fn(42)`
  }, {
    name: "Set Compiler Flags",
    blurb: "You can define compiler flags inline in a code sample which are removed from the output",
    code: `// @noImplicitAny: false
// This will not throw because of the noImplicitAny
function fn(s) {
  console.log(s.subtr(3))
}

fn(42);`
  }, {
    name: "Trims code",
    blurb: "You can write code to help it compile in the sample which is hidden in the output",
    code: `interface IdLabel {id: number, /* some fields */ }
interface NameLabel {name: string, /* other fields */ }
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript");`
  },
  {
    name: "Show the JS",
    blurb: "Use @showEmit to show the JS files",
    code: `// @showEmit
export function getStringLength(value: string) {
  return value
}
`},
  {
    name: "Show the DTS",
    blurb: "Use @showEmittedFile to set the d.ts file to be the result code",
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
`},
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

export const query = graphql`
  query TwoSlash {
    ...AllSitePage
  }
`
