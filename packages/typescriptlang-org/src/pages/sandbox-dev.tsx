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
          sandbox: '/js/sandbox'
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "sandbox/index"], async (main: typeof import("monaco-editor"), ts: typeof import("typescript"), sandbox: typeof import("typescript-sandbox")) => {
        const initialCode = `import {markdown} from "danger"

markdown("OK")`
        const isOK = main && ts && sandbox
        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        }

        const playground = await sandbox.createTypeScriptSandbox({ text: initialCode, compilerOptions: {}, domID: "monaco-editor-embed", useJavaScript: false }, main, ts)
        playground.editor.focus()
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
