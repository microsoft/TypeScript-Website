import { Stylesheet, InjectionMode } from "@uifabric/merge-styles"
import { renderStatic } from "@uifabric/merge-styles/lib/server"
import { renderToString } from "react-dom/server"
import React from "react"

/** @type { import("gatsby").GatsbySSR["replaceRenderer"] } */
export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents, setPostBodyComponents }) => {
  const { html, css } = renderStatic(() => {
    return renderToString(bodyComponent)
  })

  const replaceInlineScripts = html.replace(/<inlinescript/, "<script").replace(/<\/inlinescript/, "</script")

  replaceBodyHTMLString(replaceInlineScripts)
  setHeadComponents([<style dangerouslySetInnerHTML={{ __html: css }} />])

  // setPostBodyComponents()
}

