import type { Sandbox } from "typescript-sandbox"
import { Node, DiagnosticRelatedInformation } from "typescript"
import type React from "react"

/** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
export const createUtils = (sb: any, react: typeof React) => {
  const sandbox: Sandbox = sb
  const ts = sandbox.ts

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

  // The Playground Plugin design system
  const createDesignSystem = (container: Element) => {
    const clear = () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
    let decorations: string[] = []
    let decorationLock = false

    return {
      /** Clear the sidebar */
      clear,
      /** Present code in a pre > code  */
      code: (code: string) => {
        const createCodePre = document.createElement("pre")
        const codeElement = document.createElement("code")

        codeElement.innerHTML = code

        createCodePre.appendChild(codeElement)
        container.appendChild(createCodePre)

        return codeElement
      },
      /** Ideally only use this once, and maybe even prefer using subtitles everywhere */
      title: (title: string) => el(title, "h3", container),
      /** Used to denote sections, give info etc */
      subtitle: (subtitle: string) => el(subtitle, "h4", container),
      p: (subtitle: string) => el(subtitle, "p", container),
      /** When you can't do something, or have nothing to show */
      showEmptyScreen: (message: string) => {
        clear()

        const noErrorsMessage = document.createElement("div")
        noErrorsMessage.id = "empty-message-container"

        const messageDiv = document.createElement("div")
        messageDiv.textContent = message
        messageDiv.classList.add("empty-plugin-message")
        noErrorsMessage.appendChild(messageDiv)

        container.appendChild(noErrorsMessage)
        return noErrorsMessage
      },
      /**
       * Shows a list of hoverable, and selectable items (errors, highlights etc) which have code representation.
       * The type is quite small, so it should be very feasible for you to massage other data to fit into this function
       */
      listDiags: (
        sandbox: Sandbox,
        model: import("monaco-editor").editor.ITextModel,
        diags: DiagnosticRelatedInformation[]
      ) => {
        const errorUL = document.createElement("ul")
        errorUL.className = "compiler-diagnostics"

        container.appendChild(errorUL)

        diags.forEach(diag => {
          const li = document.createElement("li")
          li.classList.add("diagnostic")
          switch (diag.category) {
            case 0:
              li.classList.add("warning")
              break
            case 1:
              li.classList.add("error")
              break
            case 2:
              li.classList.add("suggestion")
              break
            case 3:
              li.classList.add("message")
              break
          }

          if (typeof diag === "string") {
            li.textContent = diag
          } else {
            li.textContent = sandbox.ts.flattenDiagnosticMessageText(diag.messageText, "\n")
          }
          errorUL.appendChild(li)

          li.onmouseenter = () => {
            if (diag.start && diag.length && !decorationLock) {
              const start = model.getPositionAt(diag.start)
              const end = model.getPositionAt(diag.start + diag.length)
              decorations = sandbox.editor.deltaDecorations(decorations, [
                {
                  range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                  options: { inlineClassName: "error-highlight" },
                },
              ])
            }
          }

          li.onmouseleave = () => {
            if (!decorationLock) {
              sandbox.editor.deltaDecorations(decorations, [])
            }
          }

          li.onclick = () => {
            if (diag.start && diag.length) {
              const start = model.getPositionAt(diag.start)
              sandbox.editor.revealLine(start.lineNumber)

              const end = model.getPositionAt(diag.start + diag.length)
              decorations = sandbox.editor.deltaDecorations(decorations, [
                {
                  range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                  options: { inlineClassName: "error-highlight", isWholeLine: true },
                },
              ])

              decorationLock = true
              setTimeout(() => {
                decorationLock = false
                sandbox.editor.deltaDecorations(decorations, [])
              }, 300)
            }
          }
        })
        return errorUL
      },

      localStorageOption: (setting: { blurb: string; flag: string; display: string }) => {
        const li = document.createElement("li")
        const label = document.createElement("label")
        label.innerHTML = `<span>${setting.display}</span><br/>${setting.blurb}`

        const key = setting.flag
        const input = document.createElement("input")
        input.type = "checkbox"
        input.id = key
        input.checked = !!localStorage.getItem(key)

        input.onchange = () => {
          if (input.checked) {
            localStorage.setItem(key, "true")
          } else {
            localStorage.removeItem(key)
          }
        }

        label.htmlFor = input.id

        li.appendChild(input)
        li.appendChild(label)
        container.appendChild(li)
        return li
      },
    }
  }

  const createASTTree = (node: Node) => {
    const div = document.createElement("div")
    div.className = "ast"

    const infoForNode = (node: Node) => {
      const name = ts.SyntaxKind[node.kind]
      return {
        name,
      }
    }

    const renderLiteralField = (key: string, value: string) => {
      const li = document.createElement("li")
      li.innerHTML = `${key}: ${value}`
      return li
    }

    const renderSingleChild = (key: string, value: Node) => {
      const li = document.createElement("li")
      li.innerHTML = `${key}: <strong>${ts.SyntaxKind[value.kind]}</strong>`
      return li
    }

    const renderManyChildren = (key: string, value: Node[]) => {
      const li = document.createElement("li")
      const nodes = value.map(n => "<strong>&nbsp;&nbsp;" + ts.SyntaxKind[n.kind] + "<strong>").join("<br/>")
      li.innerHTML = `${key}: [<br/>${nodes}</br>]`
      return li
    }

    const renderItem = (parentElement: Element, node: Node) => {
      const ul = document.createElement("ul")
      parentElement.appendChild(ul)
      ul.className = "ast-tree"

      const info = infoForNode(node)

      const li = document.createElement("li")
      ul.appendChild(li)

      const a = document.createElement("a")
      a.textContent = info.name
      li.appendChild(a)

      const properties = document.createElement("ul")
      properties.className = "ast-tree"
      li.appendChild(properties)

      Object.keys(node).forEach(field => {
        if (typeof field === "function") return
        if (field === "parent" || field === "flowNode") return

        const value = (node as any)[field]
        if (typeof value === "object" && Array.isArray(value) && "pos" in value[0] && "end" in value[0]) {
          //  Is an array of Nodes
          properties.appendChild(renderManyChildren(field, value))
        } else if (typeof value === "object" && "pos" in value && "end" in value) {
          // Is a single child property
          properties.appendChild(renderSingleChild(field, value))
        } else {
          properties.appendChild(renderLiteralField(field, value))
        }
      })
    }

    renderItem(div, node)
    return div
  }

  return {
    /** Use this to make a few dumb element generation funcs */
    el,
    /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
    requireURL,
    /** Returns a div which has an interactive AST a TypeScript AST by passing in the root node */
    createASTTree,
    /** The Gatsby copy of React */
    react,
    /**
     * The playground plugin design system. Calling any of the functions will append the
     * element to the container you pass into the first param, and return the HTMLElement
     */
    createDesignSystem,
  }
}

export type PluginUtils = ReturnType<typeof createUtils>
