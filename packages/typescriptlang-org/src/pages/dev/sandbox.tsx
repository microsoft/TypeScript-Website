import React, { useEffect } from "react"
import { Layout } from "../../components/layout"
import { withPrefix, graphql } from "gatsby"

import "./dev.scss"
import { Intl } from "../../components/Intl"
import { DevNav } from "../../components/devNav"
import { isTouchDevice } from "../../lib/isTouchDevice"
import { SuppressWhenTouch } from "../../components/SuppressWhenTouch"

type Props = {}

const Index: React.FC<Props> = props => {
  useEffect(() => {
    // Don't even bother getting monaco
    if (isTouchDevice()) {
      return
    }

    const getLoaderScript = document.createElement("script")
    getLoaderScript.src = withPrefix("/js/vs.loader.js")
    getLoaderScript.async = true
    getLoaderScript.onload = () => {
      // @ts-ignore
      const re: any = global.require

      re.config({
        paths: {
          vs: "https://typescript.azureedge.net/cdn/4.0.5/monaco/min/vs",
          sandbox: withPrefix("/js/sandbox"),
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
            document
              .getElementById("loader")!
              .parentNode?.removeChild(document.getElementById("loader")!)
          }

          document.getElementById("monaco-editor-embed")!.style.display =
            "block"

          const sandbox = sandboxEnv.createTypeScriptSandbox(
            {
              text: initialCode,
              compilerOptions: {},
              domID: "monaco-editor-embed",
              filetype: "ts",
            },
            main,
            ts
          )
          sandbox.editor.focus()

          setTimeout(() => {
            document.querySelectorAll(".html-code").forEach(codeElement => {
              sandbox.monaco.editor
                .colorize(codeElement.textContent || "", "html", { tabSize: 2 })
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
        }
      )
    }

    document.body.appendChild(getLoaderScript)
  }, [])

  return (
    <>
      <Layout
        title="Developers - Sandbox"
        description="The TypeScript sandbox powers the TypeScript Playground. Learn how you can make your experiences like the playground using the sandbox."
        lang="en"
      >
        <div id="dev">
          <DevNav active="sandbox" />
          <div className="raised content main-content-block">
            <div className="split-fivehundred">
              <h1 style={{ marginTop: "20px" }}>TypeScript Sandbox</h1>
              <p>
                A DOM library for interacting with TypeScript and JavaScript
                code, which powers the heart of the{" "}
                <a href={withPrefix("/play/")}>TypeScript playground</a>
              </p>
              <p>You can use the TypeScript sandbox for:</p>
              <ul>
                <li>
                  Building IDE-like experiences for people to explore your
                  library's API
                </li>
                <li>
                  Building interactive web tools which use TypeScript, with a
                  lot of the Playgrounds developer experience for free
                </li>
              </ul>
              <p>
                For example, the sandbox to the side has grabbed the Types for{" "}
                <a href="https://danger.systems/js/">DangerJS</a> with no
                modifications for this code sample. This is because the
                Playground's Automatic Type Acquisition is enabled by default.
                It will also look for the same parameters for code, and
                selection indexes inside the URL.
              </p>
              <p>
                Try clicking{" "}
                <a href="?q=1#code/PTAEBUAsFMGdtAYwPYFtXQHYBdagO7QBOCiJAhttACagCWmo2MEAngA7QDKZd72oAAoAbcqwDmRZAFdM1AFAhQ5OUxiNmCAKoAlADKhI5WJALGkydnRqhkAN2JNkahJmj5QuvfMVgodPAwVPBVWUHYpACtoRAFpWAZxNk4eIj4BWBVqACNkAA84JBVfUGhjOmEw+FUUagRyKVlabGcyxFNkTSJQHxRMWAEYYWFnAF5QACIACWhh5wB1ZCJhagn5PthkYWgAOhHxAAohkYBKIA">
                  this URL
                </a>{" "}
                to see that in action.{" "}
              </p>
              <p>
                This library builds on top of the{" "}
                <a href="https://microsoft.github.io/monaco-editor/index.html">
                  Monaco Editor
                </a>
                , providing a higher level API but offering access to all the
                lower-level APIs via a single <code>sandbox</code> object.
              </p>
              <p>
                You can find the code for the TypeScript Sandbox inside the{" "}
                <a href="https://github.com/microsoft/TypeScript-Website/tree/v2/packages/sandbox#@typescript/sandbox">
                  microsoft/TypeScript-Website
                </a>{" "}
                mono-repo.
              </p>
            </div>

            <SuppressWhenTouch hideOnTouch>
              <div
                className="fivehundred"
                style={{ borderLeft: "1px solid gray" }}
              >
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
                  style={{ height: "400px", display: "none" }}
                  id="monaco-editor-embed"
                />
              </div>
            </SuppressWhenTouch>
          </div>

          <div className="raised main-content-block">
            <h2>Usage</h2>
            <p>
              A sandbox uses the same tools as monaco-editor, meaning this
              library is shipped as an AMD bundle which you can use the{" "}
              <a href="https://github.com/microsoft/vscode-loader/">
                VSCode Loader
              </a>{" "}
              to <code>require</code>.
            </p>
            <p>
              Because we need it for the TypeScript website, you can use our
              hosted copy{" "}
              <a
                href="https://typescriptlang.org/js/vs.loader.js"
                title="Link to the JS for the visual studio require loader"
              >
                here.
              </a>
            </p>

            <h3>Get Started</h3>
            <p>
              Create a new file: <code>index.html</code> and paste this code
              into that file.
            </p>
            <pre>
              <code className="html-code">
                {`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <div id="loader">Loading...</div>
  <div id="monaco-editor-embed" style="height: 800px;" />
  <script>
    // First set up the VSCode loader in a script tag
    const getLoaderScript = document.createElement('script')
    getLoaderScript.src = 'https://www.typescriptlang.org/js/vs.loader.js'
    getLoaderScript.async = true
    getLoaderScript.onload = () => {
      // Now the loader is ready, tell require where it can get the version of monaco, and the sandbox
      // This version uses the latest version of the sandbox, which is used on the TypeScript website

      // For the monaco version you can use unpkg or the TypeSCript web infra CDN
      // You can see the available releases for TypeScript here:
      // https://typescript.azureedge.net/indexes/releases.json
      //
      require.config({
        paths: {
          vs: 'https://typescript.azureedge.net/cdn/4.0.5/monaco/min/vs',
          // vs: 'https://unpkg.com/@typescript-deploys/monaco-editor@4.0.5/min/vs',
          sandbox: 'https://www.typescriptlang.org/js/sandbox',
        },
        // This is something you need for monaco to work
        ignoreDuplicateModules: ['vs/editor/editor.main'],
      })

      // Grab a copy of monaco, TypeScript and the sandbox
      require(['vs/editor/editor.main', 'vs/language/typescript/tsWorker', 'sandbox/index'], (
        main,
        _tsWorker,
        sandboxFactory
      ) => {
        const initialCode = \`import {markdown, danger} from "danger"

export default async function () {
    // Check for new @types in devDependencies
    const packageJSONDiff = await danger.git.JSONDiffForFile("package.json")
    const newDeps = packageJSONDiff.devDependencies.added
    const newTypesDeps = newDeps?.filter(d => d.includes("@types")) ?? []
    if (newTypesDeps.length){
        markdown("Added new types packages " + newTypesDeps.join(", "))
    }
}
\`

        const isOK = main && window.ts && sandboxFactory
        if (isOK) {
          document.getElementById('loader').parentNode.removeChild(document.getElementById('loader'))
        } else {
          console.error('Could not get all the dependencies of sandbox set up!')
          console.error('main', !!main, 'ts', !!window.ts, 'sandbox', !!sandbox)
          return
        }

        // Create a sandbox and embed it into the div #monaco-editor-embed
        const sandboxConfig = {
          text: initialCode,
          compilerOptions: {},
          domID: 'monaco-editor-embed',
        }

        const sandbox = sandboxFactory.createTypeScriptSandbox(sandboxConfig, main, window.ts)
        sandbox.editor.focus()
      })
    }

    document.body.appendChild(getLoaderScript)
  </script>
</html>`}
              </code>
            </pre>
            <p>
              Opening the file <code>index.html</code> in a web browser will
              load up the same sandbox up at the top of the page.
            </p>
            <h3>Some examples of the API</h3>
            {codeSamples.map(code => (
              <div className="split-code" key={code.blurb}>
                <p>{code.blurb}</p>
                <pre>
                  <code className="ts-code">{code.code.trim()}</code>
                </pre>
              </div>
            ))}
            <p>
              The API is mainly a light shim over the{" "}
              <a href="https://microsoft.github.io/monaco-editor/api/index.html">
                monaco-editor API
              </a>{" "}
              with the{" "}
              <a href="https://github.com/microsoft/monaco-typescript">
                monaco-typescript API
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

const codeSamples = [
  {
    blurb: "Converting the user's TypeScript into JavaScript",
    code: `const sandbox = createTypeScriptSandbox(sandboxConfig, main, ts)

// Async because it needs to go  
const js = await sandbox.getRunnableJS()
console.log(js)`,
  },
  {
    blurb: "Get the DTS for the user's editor",
    code: `const sandbox = createTypeScriptSandbox(sandboxConfig, main, ts)

const dts = await sandbox.getDTSForCode()
console.log(dts)`,
  },
  {
    blurb: "Make a request for an LSP response",
    code: `const sandbox = createTypeScriptSandbox(sandboxConfig, main, ts)

// A worker here is a web-worker, set up by monaco-typescript
// which does the computation in the background 
const worker = await sandbox.getWorkerProcess()
const definitions =  await client.getDefinitionAtPosition(model.uri.toString(), 6)
  `,
  },
  {
    blurb: "Change compiler flags using a few different APIs",
    code: `const sandbox = createTypeScriptSandbox(sandboxConfig, main, ts)

// Hook in to all changes to the compiler
sandbox.setDidUpdateCompilerSettings((newOptions) => {
  console.log("Compiler settings changed: ", newOptions)
})

// Update via key value
sandbox.updateCompilerSetting("allowJs", true)
// Update via an object
sandbox.updateCompilerSettings({ jsx: 0 })
// Replace the compiler settings
sandbox.setCompilerSettings({})
`,
  },
  {
    blurb: "Highlight some code in the editor",
    code: `const sandbox = createTypeScriptSandbox(sandboxConfig, main, ts)

const start = {
  lineNumber: 0,
  column: 0
}

const end = {
  lineNumber: 0,
  column: 4
}

const decorations = sandbox.editor.deltaDecorations([], [
  {
    range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
    options: { inlineClassName: 'error-highlight' },
  },
])
`,
  },
  {
    blurb: "Create your own playground.",
    code: `const sandbox = createTypeScriptSandbox(sandboxConfig, main, ts)

// Use a script to make a JSON file like:
// { 
//   "file:///node_modules/types/keyboard/index.d.ts": "export const enterKey: string"
// }
//
// Where the keys are the paths, and the values are the source-code. The sandbox
// will use the node resolution lookup strategy by default.

const dtsFiles = {} 

Object.keys(dtsFiles).forEach(path => {
  sandbox.languageServiceDefaults.addExtraLib(dts[path], path);
});
`,
  },
]
