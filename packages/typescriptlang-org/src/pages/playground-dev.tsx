import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"
import { Helmet } from "react-helmet"

const Index = (props: any) => {
  useEffect(() => {
    const searchScript = document.createElement('script');
    searchScript.src = withPrefix("/js/vs.loader.js");
    searchScript.async = true;
    searchScript.onload = () => {
      // @ts-ignore
      const re = global.require

      re.config({
        paths: {
          vs: `https://tswebinfra.blob.core.windows.net/monaco-editor/0-19-0/min/vs`,
          sandbox: '/js/sandbox'
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(["vs/editor/editor.main", "sandbox/index"], async (main: typeof import("monaco-editor"), sandbox: typeof import("../../static/js/sandbox")) => {

        const playground = await sandbox.setupPlayground({ text: "OK", compilerOptions: {}, typeScriptVersion: "3.5.1", domID: "monaco-editor-embed", useJavaScript: false }, main)
        playground.focus()

      });
    }

    document.body.appendChild(searchScript);
  })

  return (
    <>
      <Helmet>

      </Helmet>

      <Layout>
        <div className="ms-depth-4" style={{ backgroundColor: "white", maxWidth: 960, margin: "1rem auto", padding: "2rem" }}>
          <h1 style={{ textAlign: "center" }}>Loading</h1>
          <div style={{ height: "800px" }} id="monaco-editor-embed" />
        </div>
      </Layout>
    </>
  )

}




export default Index
