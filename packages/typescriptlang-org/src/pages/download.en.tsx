import React from "react"
import { Layout } from "../components/layout"

const Index = () =>
  <Layout title="How to set up TypeScript" description="" >
    <div className="raised" style={{ maxWidth: 960, margin: "1rem auto", padding: "2rem" }}>
      <h1>Download TypeScript</h1>
      <p>TypeScript is available in two ways depending on how you intend to use it: built as an npm module, and a nuget package.</p>
    </div>

    <div className="raised" style={{ maxWidth: 960, margin: "1rem auto", padding: "2rem", display: "flex" }}>
      <div style={{ borderRight: "1px grey solid", padding: "1rem" }}>
        <h2>via NPM</h2>
        <p>TypeScript is available in three ways depending on how you intend to use it: built as an npm momdule, and a nuget package.</p>
      </div>

      <div style={{ padding: "1rem" }}>
        <h2>via Nuget</h2>
        <p>TypeScript is available in three ways depending on how you intend to use it: built as an npm momdule, and a nuget package.</p>
      </div>
    </div>

  </Layout>

export default Index
