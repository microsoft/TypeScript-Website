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
          if (typeof value === "object" && Array.isArray(value) && value[0] && "pos" in value[0] && "end" in value[0]) {
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
