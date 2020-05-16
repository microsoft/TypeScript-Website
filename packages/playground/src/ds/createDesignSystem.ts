import type { Sandbox } from "typescriptlang-org/static/js/sandbox"
import type { DiagnosticRelatedInformation, Node } from "typescript"

export type LocalStorageOption = {
  blurb: string
  flag: string
  display: string

  emptyImpliesEnabled?: true
  oneline?: true
}

export type OptionsListConfig = {
  style: "separated" | "rows"
}

const el = (str: string, elementType: string, container: Element) => {
  const el = document.createElement(elementType)
  el.innerHTML = str
  container.appendChild(el)
  return el
}

// The Playground Plugin design system
export const createDesignSystem = (sandbox: Sandbox) => {
  const ts = sandbox.ts

  return (container: Element) => {
    const clear = () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
    let decorations: string[] = []
    let decorationLock = false

    /** Lets a HTML Element hover to highlight code in the editor  */
    const addEditorHoverToElement = (
      element: HTMLElement,
      pos: { start: number; end: number },
      config: { type: "error" | "info" }
    ) => {
      element.onmouseenter = () => {
        if (!decorationLock) {
          const model = sandbox.getModel()
          const start = model.getPositionAt(pos.start)
          const end = model.getPositionAt(pos.end)
          decorations = sandbox.editor.deltaDecorations(decorations, [
            {
              range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
              options: { inlineClassName: "highlight-" + config.type },
            },
          ])
        }
      }

      element.onmouseleave = () => {
        if (!decorationLock) {
          sandbox.editor.deltaDecorations(decorations, [])
        }
      }
    }

    const localStorageOption = (setting: LocalStorageOption) => {
      // Think about this as being something which you want enabled by default and can suppress whether
      // it should do something.
      const invertedLogic = setting.emptyImpliesEnabled

      const li = document.createElement("li")
      const label = document.createElement("label")
      const split = setting.oneline ? "" : "<br/>"
      label.innerHTML = `<span>${setting.display}</span>${split}${setting.blurb}`

      const key = setting.flag
      const input = document.createElement("input")
      input.type = "checkbox"
      input.id = key

      input.checked = invertedLogic ? !localStorage.getItem(key) : !!localStorage.getItem(key)

      input.onchange = () => {
        if (input.checked) {
          if (!invertedLogic) localStorage.setItem(key, "true")
          else localStorage.removeItem(key)
        } else {
          if (invertedLogic) localStorage.setItem(key, "true")
          else localStorage.removeItem(key)
        }
      }

      label.htmlFor = input.id

      li.appendChild(input)
      li.appendChild(label)
      container.appendChild(li)
      return li
    }

    const code = (code: string) => {
      const createCodePre = document.createElement("pre")
      const codeElement = document.createElement("code")

      codeElement.innerHTML = code

      createCodePre.appendChild(codeElement)
      container.appendChild(createCodePre)

      return codeElement
    }

    const showEmptyScreen = (message: string) => {
      clear()

      const noErrorsMessage = document.createElement("div")
      noErrorsMessage.id = "empty-message-container"

      const messageDiv = document.createElement("div")
      messageDiv.textContent = message
      messageDiv.classList.add("empty-plugin-message")
      noErrorsMessage.appendChild(messageDiv)

      container.appendChild(noErrorsMessage)
      return noErrorsMessage
    }

    const listDiags = (model: import("monaco-editor").editor.ITextModel, diags: DiagnosticRelatedInformation[]) => {
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

        if (diag.start && diag.length) {
          addEditorHoverToElement(li, { start: diag.start, end: diag.start + diag.length }, { type: "error" })
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
    }

    const showOptionList = (options: LocalStorageOption[], style: OptionsListConfig) => {
      const ol = document.createElement("ol")
      ol.className = style.style === "separated" ? "playground-options" : "playground-options tight"

      options.forEach(option => {
        if (style.style === "rows") option.oneline = true

        const settingButton = localStorageOption(option)
        ol.appendChild(settingButton)
      })

      container.appendChild(ol)
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

      type NodeInfo = ReturnType<typeof infoForNode>

      const renderLiteralField = (key: string, value: string, info: NodeInfo) => {
        const li = document.createElement("li")
        const typeofSpan = `ast-node-${typeof value}`
        let suffix = ""
        if (key === "kind") {
          suffix = ` (SyntaxKind.${info.name})`
        }
        li.innerHTML = `${key}: <span class='${typeofSpan}'>${value}</span>${suffix}`
        return li
      }

      const renderSingleChild = (key: string, value: Node, depth: number) => {
        const li = document.createElement("li")
        li.innerHTML = `${key}: `

        renderItem(li, value, depth + 1)
        return li
      }

      const renderManyChildren = (key: string, nodes: Node[], depth: number) => {
        const childers = document.createElement("div")
        childers.classList.add("ast-children")

        const li = document.createElement("li")
        li.innerHTML = `${key}: [<br/>`
        childers.appendChild(li)

        nodes.forEach(node => {
          renderItem(childers, node, depth + 1)
        })

        const liEnd = document.createElement("li")
        liEnd.innerHTML += "]"
        childers.appendChild(liEnd)
        return childers
      }

      const renderItem = (parentElement: Element, node: Node, depth: number) => {
        const itemDiv = document.createElement("div")
        parentElement.appendChild(itemDiv)
        itemDiv.className = "ast-tree-start"
        itemDiv.attributes.setNamedItem
        // @ts-expect-error
        itemDiv.dataset.pos = node.pos
        // @ts-expect-error
        itemDiv.dataset.end = node.end
        // @ts-expect-error
        itemDiv.dataset.depth = depth

        if (depth === 0) itemDiv.classList.add("open")

        const info = infoForNode(node)

        const a = document.createElement("a")
        a.classList.add("node-name")
        a.textContent = info.name
        itemDiv.appendChild(a)
        a.onclick = _ => a.parentElement!.classList.toggle("open")
        addEditorHoverToElement(a, { start: node.pos, end: node.end }, { type: "info" })

        const properties = document.createElement("ul")
        properties.className = "ast-tree"
        itemDiv.appendChild(properties)

        Object.keys(node).forEach(field => {
          if (typeof field === "function") return
          if (field === "parent" || field === "flowNode") return

          const value = (node as any)[field]
          if (typeof value === "object" && Array.isArray(value) && value[0] && "pos" in value[0] && "end" in value[0]) {
            //  Is an array of Nodes
            properties.appendChild(renderManyChildren(field, value, depth))
          } else if (typeof value === "object" && "pos" in value && "end" in value) {
            // Is a single child property
            properties.appendChild(renderSingleChild(field, value, depth))
          } else {
            properties.appendChild(renderLiteralField(field, value, info))
          }
        })
      }

      renderItem(div, node, 0)
      container.append(div)
      return div
    }

    type TextInputConfig = {
      id: string
      placeholder: string

      onChanged?: (text: string, input: HTMLInputElement) => void
      onEnter: (text: string, input: HTMLInputElement) => void

      value?: string
      keepValueAcrossReloads?: true
      isEnabled?: (input: HTMLInputElement) => boolean
    }

    const createTextInput = (config: TextInputConfig) => {
      const form = document.createElement("form")

      const textbox = document.createElement("input")
      textbox.id = config.id
      textbox.placeholder = config.placeholder
      textbox.autocomplete = "off"
      textbox.autocapitalize = "off"
      textbox.spellcheck = false
      // @ts-ignore
      textbox.autocorrect = "off"

      const localStorageKey = "playground-input-" + config.id

      if (config.value) {
        textbox.value = config.value
      } else if (config.keepValueAcrossReloads) {
        const storedQuery = localStorage.getItem(localStorageKey)
        if (storedQuery) textbox.value = storedQuery
      }

      if (config.isEnabled) {
        const enabled = config.isEnabled(textbox)
        textbox.classList.add(enabled ? "good" : "bad")
      } else {
        textbox.classList.add("good")
      }

      const textUpdate = (e: any) => {
        const href = e.target.value.trim()
        if (config.keepValueAcrossReloads) {
          localStorage.setItem(localStorageKey, href)
        }
        if (config.onChanged) config.onChanged(e.target.value, textbox)
      }

      textbox.style.width = "90%"
      textbox.style.height = "2rem"
      textbox.addEventListener("input", textUpdate)

      // Suppress the enter key
      textbox.onkeydown = (evt: KeyboardEvent) => {
        if (evt.keyCode == 13) {
          return false
        }
      }

      form.appendChild(textbox)
      return form
    }

    return {
      /** Clear the sidebar */
      clear,
      /** Present code in a pre > code  */
      code,
      /** Ideally only use this once, and maybe even prefer using subtitles everywhere */
      title: (title: string) => el(title, "h3", container),
      /** Used to denote sections, give info etc */
      subtitle: (subtitle: string) => el(subtitle, "h4", container),
      /** Used to show a paragraph */
      p: (subtitle: string) => el(subtitle, "p", container),
      /** When you can't do something, or have nothing to show */
      showEmptyScreen,
      /**
       * Shows a list of hoverable, and selectable items (errors, highlights etc) which have code representation.
       * The type is quite small, so it should be very feasible for you to massage other data to fit into this function
       */
      listDiags,
      /** Shows a single option in local storage (adds an li to the container BTW) */
      localStorageOption,
      /** Uses localStorageOption to create a list of options */
      showOptionList,
      /** Shows a full-width text input */
      createTextInput,
      /** Renders an AST tree */
      createASTTree,
    }
  }
}
