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

This library currently ships as an AMD module. This is the same format that vscode/monaco use, and so you can use
the same runtime loader patterns for importing into your web page. It is not a goal to provide ESM builds so people
can run JS packagers over the project. If someone can make that work and have tests which validate it doesn't break,
we'll accept it.

## Installation

```html
<html>
  <div id="loader">Loading...</div>
  <div id="monaco-editor-embed" />
  <script>
    // First set up the VSCode loader in a script tag
    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = "https://typescriptlang.org/v2/js/vs.loader.js";
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {

      // Now the loader is ready, tell require where it can get the version of monaco, and the sandbox
      // This version uses the latest version of the sandbox, which is used on the TypeScript website

      // For the monaco version you can use MaxCDN or the TypeSCript web infra CDN
      // You can see the available releases for TypeScript here:
      // https://tswebinfra.blob.core.windows.net/indexes/releases.json
      //
      require.config({
        paths: {
          vs: "https://tswebinfra.blob.core.windows.net/cdn/3.7.3/monaco/min/vs",
          sandbox: 'https://typescriptlang.org/v2/js/sandbox'
        },
        // This is something you need for monaco to work
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      // Grab a copy of monaco, TypeScript and the sandbox
      require(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "sandbox/index"], async (main, _tsWorker, sandbox) => {
        const initialCode = `import {markdown} from "danger"\n\nmarkdown("OK")`

        const isOK = main && window.ts && sandbox
        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        } else {
          console.error("Could not get all the dependencies of sandbox set up!")
          console.error("main", !!main, "ts", !!window.ts, "sandbox", !!sandbox)
          return
        }

        // Create a sandbox and embed it into the the div #monaco-editor-embed
        const playground = await sandbox.createTypeScriptSandbox({ text: initialCode, compilerOptions: {}, domID: "monaco-editor-embed", useJavaScript: false }, main, window.ts)
        playground.editor.focus()
      });
    }

    document.body.appendChild(getLoaderScript);
  </script>
</html>
```
