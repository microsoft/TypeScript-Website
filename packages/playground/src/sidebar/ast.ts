import { PlaygroundPlugin, PluginFactory } from ".."
import type { IDisposable } from "monaco-editor"

export const showASTPlugin: PluginFactory = (i, utils) => {
  let container: HTMLElement
  let ast: HTMLElement
  let disposable: IDisposable | undefined

  const plugin: PlaygroundPlugin = {
    id: "ast",
    displayName: "AST",
    willMount: (_, _container) => {
      container = _container
    },
    didMount: (sandbox, container) => {
      // While this plugin is forefront, keep cursor changes in sync with the AST selection

      disposable = sandbox.editor.onDidChangeCursorPosition(e => {
        const cursorPos = sandbox.getModel().getOffsetAt(e.position)
        const allTreeStarts = (container.querySelectorAll("div.ast-tree-start") as any) as HTMLDivElement[]

        let deepestElement: HTMLDivElement = null as any

        allTreeStarts.forEach(e => {
          // Close them all first, because we're about to open them up after
          e.classList.remove("open")

          // Find the deepest element in the set and open it up
          const { pos, end, depth } = e.dataset as { pos: string; end: string; depth: string }
          const nPos = Number(pos)
          const nEnd = Number(end)

          if (cursorPos > nPos && cursorPos <= nEnd) {
            if (deepestElement) {
              const currentDepth = Number(deepestElement!.dataset.depth)
              if (currentDepth < Number(depth)) {
                deepestElement = e
              }
            } else {
              deepestElement = e
            }
          }
        })

        // Take that element, open it up, then go through its ancestors till they are all opened
        let openUpElement: HTMLDivElement | null | undefined = deepestElement
        while (openUpElement) {
          openUpElement.classList.add("open")
          openUpElement = openUpElement.parentElement?.closest(".ast-tree-start")
        }

        // Scroll and flash to let folks see what's happening
        deepestElement.scrollIntoView({ block: "nearest", behavior: "smooth" })
        utils.flashHTMLElement(deepestElement)
      })
    },
    modelChangedDebounce: sandbox => {
      const ds = utils.createDesignSystem(container)
      ds.clear()
      ds.title("AST")

      sandbox.getAST().then(tree => {
        ast = ds.createASTTree(tree)
      })
    },
    didUnmount: () => {
      disposable && disposable.dispose()
    },
  }

  return plugin
}
