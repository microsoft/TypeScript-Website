import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"

const Index = (props: any) => {
  useEffect(() => {
    const searchScript = document.createElement('script');

    searchScript.src = withPrefix("/js/vs.loader.js");
    searchScript.async = true;
    searchScript.onload = () => {
      // @ts-ignore
      const re = global.require

      // @ts-ignore
      re.config({
        paths: {
          vs: `https://tswebinfra.blob.core.windows.net/monaco-editor/0-19-0/min/vs`,
        },
        // ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      // @ts-ignore
      re(["vs/editor/editor.main"], (a) => {
        console.log("hiii", a)
      });
    }

    document.body.appendChild(searchScript);
  })

  return (
    <Layout>
      <div className="ms-depth-4" style={{ backgroundColor: "white", maxWidth: 960, margin: "1rem auto", padding: "2rem" }}>
        <h1>:wave:</h1>
      </div>
    </Layout>
  )

}




export default Index
