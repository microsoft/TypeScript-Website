type StoryContent =
  | { type: "html"; html: string; title: string }
  | { type: "code"; code: string; params: string; title: string }
  | { type: "hr" }

import type { Sandbox } from "typescriptlang-org/static/js/sandbox"
import type { UI } from "./createUI"

export const gistPoweredNavBar = (sandbox: Sandbox, ui: UI, showNav: () => void) => {
  const setCode = (code: string) => {
    const story = document.getElementById("story-container")
    if (story) story.style.display = "none"

    const toolbar = document.getElementById("editor-toolbar")
    if (toolbar) toolbar.style.display = "block"

    const monaco = document.getElementById("monaco-editor-embed")
    if (monaco) monaco.style.display = "block"

    sandbox.setText(code)
    sandbox.editor.layout()
  }

  const setStory = (html: string) => {
    const toolbar = document.getElementById("editor-toolbar")
    if (toolbar) toolbar.style.display = "none"

    const monaco = document.getElementById("monaco-editor-embed")
    if (monaco) monaco.style.display = "none"

    const story = document.getElementById("story-container")
    if (story) {
      story.style.display = "block"
      story.innerHTML = html
    }
  }

  const gistHash = location.hash.split("#gist/")[1]
  const [gistID, gistStoryIndex] = gistHash.split("-")
  fetch(`http://localhost:7071/api/API?gistID=${gistID}`).then(async res => {
    const response = await res.json()
    if ("error" in response) {
      return ui.flashInfo(response.display)
    }

    if (response.type === "code") {
      sandbox.setText(response.code)
      sandbox.setCompilerSettings(response.params)
      sandbox.editor.updateOptions({ readOnly: false })
    } else if (response.type === "story") {
      showNav()

      const nav = document.getElementById("navigation-container")
      if (!nav) return

      const title = document.createElement("h4")
      title.textContent = response.title
      nav.appendChild(title)

      const ul = document.createElement("ul")
      response.files.forEach((element: StoryContent, i: number) => {
        const li = document.createElement("li")
        switch (element.type) {
          case "html":
          case "code": {
            li.classList.add("selectable")
            const a = document.createElement("a")
            a.textContent = element.title
            a.href = `/play?#gist/${gistID}-${i}`

            a.onclick = e => {
              e.preventDefault()

              const ed = sandbox.editor.getDomNode()
              if (!ed) return
              sandbox.editor.updateOptions({ readOnly: false })
              const alreadySelected = ul.querySelector(".selected") as HTMLElement
              if (alreadySelected) alreadySelected.classList.remove("selected")

              li.classList.add("selected")
              if (element.type === "code") {
                setCode(element.code)
              } else if (element.type === "html") {
                setStory(element.html)
              }

              return false
            }
            li.appendChild(a)

            break
          }
          case "hr": {
            const hr = document.createElement("hr")
            li.appendChild(hr)
          }
        }
        ul.appendChild(li)
      })
      nav.appendChild(ul)

      const targetedLi = ul.children.item(Number(gistStoryIndex) || 0) || ul.children.item(0)
      if (targetedLi) {
        const a = targetedLi.getElementsByTagName("a")
        // @ts-ignore
        if (a) a.onclick()
      }
    }
  })
}
