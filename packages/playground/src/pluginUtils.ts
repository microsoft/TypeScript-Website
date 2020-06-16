import type { Sandbox } from "typescript-sandbox"
import type React from "react"
import { createDesignSystem } from "./ds/createDesignSystem"

/** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
export const createUtils = (sb: any, react: typeof React) => {
  const sandbox: Sandbox = sb

  const requireURL = (path: string) => {
    // https://unpkg.com/browse/typescript-playground-presentation-mode@0.0.1/dist/x.js => unpkg/browse/typescript-playground-presentation-mode@0.0.1/dist/x
    const isDev = document.location.host.includes("localhost")
    const prefix = isDev ? "local/" : "unpkg/typescript-playground-presentation-mode/dist/"
    return prefix + path
  }

  const el = (str: string, elementType: string, container: Element) => {
    const el = document.createElement(elementType)
    el.innerHTML = str
    container.appendChild(el)
    return el
  }

  const flashHTMLElement = (element: HTMLElement) => {
    element.classList.add("briefly-highlight")
    setTimeout(() => element.classList.remove("briefly-highlight"), 1000)
  }

  return {
    /** Use this to make a few dumb element generation funcs */
    el,
    /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
    requireURL,
    /** The Gatsby copy of React */
    react,
    /**
     * The playground plugin design system. Calling any of the functions will append the
     * element to the container you pass into the first param, and return the HTMLElement
     */
    createDesignSystem: createDesignSystem(sandbox),
    /** Flashes a HTML Element */
    flashHTMLElement,
  }
}

export type PluginUtils = ReturnType<typeof createUtils>
