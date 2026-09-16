import React from "react"
import { withPrefix } from "gatsby"
import { Helmet } from "react-helmet"

import "./7-1.scss"

const TypeScript71Playground = () => (
  <>
    <Helmet>
      <title>TypeScript 7.1 Playground</title>
      <meta
        name="description"
        content="Try the native TypeScript 7.1 compiler in a Monaco playground."
      />
    </Helmet>
    <main className="ts7-playground-page">
      <iframe
        src={withPrefix("/ts7-playground/index.html")}
        title="TypeScript 7.1 Playground"
      />
    </main>
  </>
)

export default TypeScript71Playground
