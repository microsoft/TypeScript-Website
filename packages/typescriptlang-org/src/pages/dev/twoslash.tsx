import React, { useEffect } from "react"
import { Layout } from "../../components/layout"
import { withPrefix } from "gatsby"
import { twoslasher } from "@typescript/twoslash"
import { createDefaultMapFromCDN } from "@typescript/vfs"
import { renderers } from "shiki-twoslash"
import { debounce } from "ts-debounce"

import "./dev.scss"
import { Intl } from "../../components/Intl"
import { DevNav } from "../../components/devNav"
import { isTouchDevice } from "../../lib/isTouchDevice"
import { SuppressWhenTouch } from "../../components/SuppressWhenTouch"
import { getPlaygroundUrls } from "../../lib/playgroundURLs"

/** Note: to run all the web infra in debug, run:
  localStorage.debug = '*'

  to remove logging: localStorage.debug = undefined
 */

type Props = {}

const Index: React.FC<Props> = props => {
  useEffect(() => {
    // No monaco for touch
    if (isTouchDevice()) {
      return
    }

    const getLoaderScript = document.createElement("script")
    getLoaderScript.src = withPrefix("/js/vs.loader.js")
    getLoaderScript.async = true
    getLoaderScript.onload = () => {
      // Allow prod/staging builds to set a custom commit prefix to bust caches
      const {sandboxRoot} = getPlaygroundUrls()
      
      // @ts-ignore
      const re: any = global.require

      re.config({
        paths: {
          vs: "https://typescript.azureedge.net/cdn/4.0.5/monaco/min/vs",
          sandbox: sandboxRoot,
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      })

      re(
        [
          "vs/editor/editor.main",
          "vs/language/typescript/tsWorker",
          "sandbox/index",
        ],
        async (
          main: typeof import("monaco-editor"),
          ts: typeof import("typescript"),
          sandboxEnv: typeof import("@typescript/sandbox")
        ) => {
          // This triggers making "ts" available in the global scope
          re(["vs/language/typescript/lib/typescriptServices"], async _ts => {
            const ts = (global as any).ts
            const isOK = main && ts && sandboxEnv

            if (isOK) {
              document
                .getElementById("loader")!
                .parentNode?.removeChild(document.getElementById("loader")!)
            } else {
              console.error(
                "Error: main",
                !!main,
                "ts",
                !!ts,
                "sandbox",
                !!sandboxEnv
              )
            }

            document.getElementById("monaco-editor-embed")!.style.display =
              "block"
            const sandbox = await sandboxEnv.createTypeScriptSandbox(
              {
                text: codeSamples[0].code,
                compilerOptions: {},
                domID: "monaco-editor-embed",
                supportTwoslashCompilerOptions: true,
              },
              main,
              ts
            )
            sandbox.editor.focus()

            // @ts-ignore
            window.sandbox = sandbox

            const mapWithLibFiles = await createDefaultMapFromCDN(
              { target: 3 },
              "3.7.3",
              true,
              ts,
              sandbox.lzstring as any
            )

            const runTwoslash = () => {
              const newContent = sandbox.getText()
              mapWithLibFiles.set("index.ts", newContent)

              try {
                const newResults = twoslasher(newContent, "tsx", {
                  tsModule: ts,
                  lzstringModule: sandbox.lzstring as any,
                  fsMap: mapWithLibFiles,
                })
                const codeAsFakeShikiTokens = newResults.code
                  .split("\n")
                  .map(line => [{ content: line }])
                const html = renderers.twoslashRenderer(
                  codeAsFakeShikiTokens,
                  {},
                  // This is a hack because @typescript/twoslash gets released separately from remark-shiki-twoslash
                  newResults as any,
                  {}
                )

                const results = document.getElementById("twoslash-results")!

                document.getElementById("twoslash-failure")!.style.display =
                  "none"
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

                if (!failure) return
                failure.style.display = "block"

                while (failure.firstChild) {
                  failure.removeChild(failure.firstChild)
                }

                const content = document.createElement("div")
                content.className = "err-content"

                const header = document.createElement("h3")
                header.textContent = "Exception Raised"

                const text = document.createElement("p")
                const opener = err.name.startsWith("Error")
                  ? err.name.split("Error")[1]
                  : err.name
                text.textContent = opener + err.message.split("## Code")[0]

                content.appendChild(header)
                content.appendChild(text)
                failure.appendChild(content)

                console.log(error)
              }
            }

            const debouncedTwoslash = debounce(runTwoslash, 500)
            sandbox.editor.onDidChangeModelContent(debouncedTwoslash)
            runTwoslash()

            setTimeout(() => {
              document
                .querySelectorAll("#example-buttons .disabled")
                .forEach(button => {
                  button.classList.remove("disabled")
                })

              document.querySelectorAll(".html-code").forEach(codeElement => {
                sandbox.monaco.editor
                  .colorize(codeElement.textContent || "", "html", {
                    tabSize: 2,
                  })
                  .then(newHTML => {
                    codeElement.innerHTML = newHTML
                  })
              })

              document.querySelectorAll(".ts-code").forEach(codeElement => {
                sandbox.monaco.editor
                  .colorize(codeElement.textContent || "", "typescript", {
                    tabSize: 2,
                  })
                  .then(newHTML => {
                    codeElement.innerHTML = newHTML
                  })
              })
            }, 300)
          })
        }
      )
    }

    document.body.appendChild(getLoaderScript)
  }, [])

  return (
    <>
      <Layout
        title="Developers - Twoslash Code Samples"
        description="Learn about the TypeScript code sample library twoslash. Used for transpiling, providing hover to identifiers and compiler-driven error states."
        lang="en"
      >
        <div id="dev">
          <DevNav active="twoslash" />
          <div className="raised content main-content-block">
            <div className="split-fifty">
              <div>
                <h1 style={{ marginTop: "20px" }}>TypeScript Twoslash</h1>
                <p>
                  A markup format for TypeScript code, ideal for creating
                  self-contained code samples which let the TypeScript compiler
                  do the extra leg-work.
                </p>
                <p>If you know TypeScript, you basically know twoslash.</p>
                <p>
                  Twoslash adds the ability to declare tsconfig options inline,
                  split a sample into multiple files and a few other useful
                  commands. You can see the full API{" "}
                  <a href="https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher">
                    inside the README
                  </a>
                </p>
              </div>
              <div style={{ paddingTop: "4.5rem" }}>
                <p>The Twoslash markup language helps with:</p>
                <ul>
                  <li>
                    Enforcing accurate errors from a TypeScript code sample, and
                    leaving the messaging to the compiler
                  </li>
                  <li>Splitting a code sample to hide distracting code</li>
                  <li>
                    Declaratively highlighting symbols in your code sample
                  </li>
                  <li>
                    Replacing code with the results of transpilation to
                    different files, or ancillary files like .d.ts or .map files
                  </li>
                  <li>Handle multi-file imports in a single code sample</li>
                  <li>Creating a playground link for the code</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="raised content main-content-block"
            style={{ maxWidth: "90%" }}
          >
            <div className="fivehundred" style={{ flex: 1 }}>
              <SuppressWhenTouch>
                <h3 style={{ marginTop: "0" }}>Markup</h3>
                <p id="exampleBlurb">{codeSamples[0].blurb}</p>
                <div id="loader">
                  <div className="lds-grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p id="loading-message" role="status">
                    Downloading Sandbox...
                  </p>
                </div>
                <div
                  style={{ height: "300px", display: "none" }}
                  id="monaco-editor-embed"
                />
                <div id="example-buttons">
                  {codeSamples.map(code => {
                    
                    const setExample = e => {
                      if (e.target.classList.contains("disabled")) return

                      document.getElementById("exampleBlurb")!.innerText =
                        code.blurb
                      // @ts-ignore
                      window.sandbox.setText(code.code)
                    }
                    return (
                      <div className="button disabled" key={code.name} onClick={setExample}>
                        {code.name}
                      </div>
                    )
                  })}
                </div>
              </SuppressWhenTouch>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                borderLeft: "1px solid gray",
                position: "relative",
                flex: 1,
                overflow: "auto",
              }}
            >
              <SuppressWhenTouch>
                <h3 style={{ marginTop: "0" }}>Results</h3>

                <div id="twoslash-results" />
                <div id="twoslash-failure" />
              </SuppressWhenTouch>
            </div>
          </div>

          <div className="raised main-content-block">
            <h2>Usage</h2>
            <p>
              Twoslash's usage guide is available on the npm README at{" "}
              <a href="https://www.npmjs.com/package/@typescript/twoslash">
                <code>@typescript/twoslash</code>
              </a>
              .
            </p>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default (props: Props) => (
  <Intl locale="en">
    <Index {...props} />
  </Intl>
)

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
