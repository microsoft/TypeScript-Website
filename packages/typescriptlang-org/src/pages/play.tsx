import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"

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

        console.log(playground)

        const playgroundEnv = await sandbox.createTypeScriptSandbox({ text: initialCode, compilerOptions: {}, domID: "monaco-editor-embed", useJavaScript: false }, main, ts)
        playgroundEnv.editor.focus()
      });
    }

    document.body.appendChild(getLoaderScript);
  })

  return (
    <>
      <Layout>
        <div className="ms-depth-4" style={{ backgroundColor: "white", marginLeft: "-60px", marginRight: "-60px", margin: "1rem auto", padding: "2rem" }}>
          <h1 id="loader" style={{ textAlign: "center" }}>Loading</h1>
          <div style={{ height: "800px" }} id="monaco-editor-embed" />
        </div>
      </Layout>
    </>
  )

}




export default Index
