# TypeScript Sandbox

The TypeScript Sandbox is the editor part of the TypeScript Playground. It's effectively an opinionated fork of
monaco-typescript with extra extension points so that projects like the TypeScript Playground can exist.

This project is useful to you if:

- You want to present users of your library with a JS editor which has a typed API (in JS or TS)
- You want to work with monaco at a higher abstraction level

## Goals

- Support multiple versions of TypeScript (via supporting older builds of monaco-typescript)
- Easy to use when trying to replace code inline on a website
- Support extension points required to build Playground
- High level APIs for things like Automatic Type Acquisition or DTS additions

## Builds

This library is published to the CDN as an AMD module. This is the same format that vscode/monaco use, and so you can use
the same runtime loader patterns for importing into your web page. This package is also available as an ESM and CJS module on NPM.

## Installation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <div id="loader">Loading...</div>
  <div id="monaco-editor-embed" style="height: 800px;" />
  <script>
    // First set up the VSCode loader in a script tag
    const getLoaderScript = document.createElement("script")
    getLoaderScript.src = "https://www.typescriptlang.org/js/vs.loader.js"
    getLoaderScript.async = true
    getLoaderScript.onload = () => {
      // Now the loader is ready, tell require where it can get the version of monaco, and the sandbox
      // This version uses the latest version of the sandbox, which is used on the TypeScript website

      // For the monaco version you can use unpkg or the TypeScript web infra CDN
      // You can see the available releases for TypeScript here:
      // https://typescript.azureedge.net/indexes/releases.json
      //
      require.config({
        paths: {
          vs: "https://typescript.azureedge.net/cdn/4.0.5/monaco/min/vs",
          // vs: 'https://unpkg.com/@typescript-deploys/monaco-editor@4.0.5/min/vs',
          sandbox: "https://www.typescriptlang.org/js/sandbox",
        },
        // This is something you need for monaco to work
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      })

      // Grab a copy of monaco, TypeScript and the sandbox
      require(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "sandbox/index"], (
        main,
        _tsWorker,
        sandboxFactory
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
}
`

        const isOK = main && window.ts && sandboxFactory
        if (isOK) {
          document.getElementById("loader").parentNode.removeChild(document.getElementById("loader"))
        } else {
          console.error("Could not get all the dependencies of sandbox set up!")
          console.error("main", !!main, "ts", !!window.ts, "sandbox", !!sandbox)
          return
        }

        // Create a sandbox and embed it into the the div #monaco-editor-embed
        const sandboxConfig = {
          text: initialCode,
          compilerOptions: {},
          domID: "monaco-editor-embed",
        }

        const sandbox = sandboxFactory.createTypeScriptSandbox(sandboxConfig, main, window.ts)
        sandbox.editor.focus()
      })
    }

    document.body.appendChild(getLoaderScript)
  </script>
</html>
```
