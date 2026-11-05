import LZString from "lz-string"
import type { Symlinks } from "./symlinks"

export type ExportProject = {
  activeFile: string
  files: Readonly<Record<string, string>>
  outputFiles: Readonly<Record<string, string>>
  symlinks: Symlinks
  url: string
}

export function decodeCompressedHash(encoded: string) {
  try {
    return LZString.decompressFromEncodedURIComponent(decodeURIComponent(encoded))
  } catch {
    return null
  }
}

function codeBlock(text: string, language = "") {
  let length = 3
  for (const match of text.matchAll(/`+/g)) length = Math.max(length, match[0].length + 1)
  const fence = "`".repeat(length)
  return `${fence}${language}\n${text}\n${fence}\n`
}

export function projectMarkdown(project: ExportProject) {
  const sections = Object.entries(project.files).map(([path, text]) => {
    const extension = path.split(".").at(-1) ?? ""
    return `### ${JSON.stringify(path)}\n\n${codeBlock(text, /^\w+$/.test(extension) ? extension : "")}`
  })
  if (Object.keys(project.symlinks).length) {
    sections.push(`### Symbolic links\n\n${codeBlock(JSON.stringify(project.symlinks, undefined, 2), "json")}`)
  }
  if (Object.keys(project.outputFiles).length) {
    const output = Object.entries(project.outputFiles).map(
      ([path, text]) => `### ${JSON.stringify(path)}\n\n${codeBlock(text, path.endsWith(".js") ? "js" : "ts")}`
    )
    sections.push(`<details><summary>Output</summary>\n\n${output.join("\n")}\n</details>`)
  }
  return `${sections.join("\n")}\n[Playground Link](${project.url})\n`
}

export function configureExports(options: { project(): ExportProject; compile(): Promise<void> | void }) {
  const menu = element<HTMLDetailsElement>("exports")
  const summary = element<HTMLElement>("exports-button")
  const items = [...menu.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>("[data-export]")]
  const dialog = element<HTMLDialogElement>("export-dialog")
  const title = element<HTMLElement>("export-title")
  const text = element<HTMLTextAreaElement>("export-text")
  const error = element<HTMLElement>("export-error")
  const showText = (heading: string, value: string) => {
    title.textContent = heading
    text.value = value
    error.hidden = true
    dialog.showModal()
    text.focus()
    text.select()
  }
  const closeMenu = () => {
    menu.open = false
    summary.setAttribute("aria-expanded", "false")
  }
  const focusItem = (index: number) => {
    items.forEach((item, current) => (item.tabIndex = current === index ? 0 : -1))
    items[index].focus()
  }
  items.forEach(item => (item.tabIndex = -1))
  menu.addEventListener("toggle", () => summary.setAttribute("aria-expanded", String(menu.open)))
  summary.addEventListener("click", event => {
    event.preventDefault()
    menu.open = !menu.open
    summary.setAttribute("aria-expanded", String(menu.open))
    if (menu.open) focusItem(0)
  })
  summary.addEventListener("keydown", event => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
    event.preventDefault()
    event.stopPropagation()
    menu.open = true
    focusItem(event.key === "ArrowDown" ? 0 : items.length - 1)
  })
  menu.addEventListener("keydown", event => {
    const index = items.indexOf(document.activeElement as HTMLButtonElement | HTMLAnchorElement)
    if (event.key === "Escape") {
      event.preventDefault()
      closeMenu()
      summary.focus()
    } else if (event.key === "Tab") {
      closeMenu()
      summary.focus()
    } else if (index >= 0 && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault()
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
          ? items.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
      focusItem(next)
    }
  })
  document.addEventListener("pointerdown", event => {
    if (event.target instanceof Node && !menu.contains(event.target)) closeMenu()
  })
  for (const item of items) {
    if (item instanceof HTMLAnchorElement) {
      const updateLink = () => {
        const project = options.project()
        const source = project.files[project.activeFile] ?? ""
        item.href = `https://ts-ast-viewer.com/#code/${LZString.compressToEncodedURIComponent(source)}`
      }
      item.addEventListener("pointerdown", updateLink)
      item.addEventListener("focus", updateLink)
      item.addEventListener("contextmenu", updateLink)
      item.addEventListener("click", updateLink)
      item.addEventListener("keydown", event => {
        if (event.key !== " ") return
        event.preventDefault()
        item.click()
      })
    }
    item.addEventListener("click", () => {
      closeMenu()
      summary.focus()
      if (item instanceof HTMLAnchorElement) return
      void perform(item.dataset.export!).catch(cause =>
        showText("Export failed", cause instanceof Error ? cause.message : String(cause))
      )
    })
  }
  element<HTMLButtonElement>("export-close-button").addEventListener("click", () => dialog.close())
  element<HTMLButtonElement>("export-copy-button").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text.value)
      dialog.close()
    } catch (cause) {
      error.textContent = `Could not copy: ${
        cause instanceof Error ? cause.message : String(cause)
      }. Select the text and copy it manually.`
      error.hidden = false
      text.focus()
      text.select()
    }
  })

  async function perform(action: string) {
    if (action === "issue") await options.compile()
    const project = options.project()
    const source = project.files[project.activeFile] ?? ""
    const language = /\.(jsx?|tsx?)$/i.exec(project.activeFile)?.[1] ?? ""
    const link = `[Playground Link](${project.url})`
    switch (action) {
      case "link":
        return showText("Playground link", project.url)
      case "issue":
        return showText("Markdown Issue", projectMarkdown(project))
      case "markdown-link":
        return showText("Markdown Link", link)
      case "preview":
        return showText(
          "Markdown Link with Preview",
          `${codeBlock(source.length > 200 ? `${source.slice(0, 200)}...` : source, language)}\n${link}`
        )
      default:
        throw new Error(`Unknown export: ${action}`)
    }
  }
}

function element<T extends HTMLElement>(id: string) {
  const result = document.getElementById(id)
  if (!result) throw new Error(`Missing #${id}`)
  return result as T
}
