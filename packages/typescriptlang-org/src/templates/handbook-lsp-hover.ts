const getAbsoluteElementPos = (element: HTMLElement) => {
  const bodyRect = document.body.getBoundingClientRect()
  const elemRect = element.getBoundingClientRect()
  const top = elemRect.top - bodyRect.top
  const left = elemRect.left - bodyRect.left
  return {
    top,
    left,
  }
}

// Hide it
const resetHover = () => {
  const globalPopover = document.getElementById("mouse-hover-info")!
  globalPopover.style.display = "none"
}

/** Creates the main mouse over popup for LSP info */
export const setupHandbookHovers = () => {
  const twoslashes = document.querySelectorAll(
    ".shiki.twoslash .code-container code"
  )

  // Gets triggered on the spans inside the codeblocks
  const hover = event => {
    const hovered = event.target as HTMLElement
    if (!hovered.className.includes("lsp")) return resetHover()
    if (!hovered.firstElementChild) return resetHover()

    const message = hovered.firstElementChild.textContent
    const position = getAbsoluteElementPos(hovered)

    const globalPopover = document.getElementById("mouse-hover-info")!
    globalPopover.textContent = message

    const yOffset = 20

    globalPopover.style.display = "block"
    globalPopover.style.top = `${position.top + yOffset}px`
    globalPopover.style.left = `${position.left}px`
  }

  twoslashes.forEach(codeblock => {
    codeblock.addEventListener("mouseover", hover)
    codeblock.addEventListener("mouseout", resetHover)
  })
}
