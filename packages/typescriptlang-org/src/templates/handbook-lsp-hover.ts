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
  // prettier-ignore
  const twoslashes = document.querySelectorAll(".shiki.twoslash .code-container code")

  // Gets triggered on the spans inside the codeblocks
  const hover = (event) => {
    const hovered = event.target as HTMLElement
    if (hovered.nodeName !== "DATA-LSP") return resetHover()

    const message = hovered.getAttribute("lsp")!
    const position = getAbsoluteElementPos(hovered)

    const globalPopover = document.getElementById("mouse-hover-info")!

    // Use a textarea to un-htmlencode for presenting to the user
    var txt = document.createElement("textarea")
    txt.innerHTML = message

    globalPopover.textContent = txt.value

    const yOffset = 20

    globalPopover.style.display = "block"
    globalPopover.style.top = `${position.top + yOffset}px`
    globalPopover.style.left = `${position.left}px`
  }

  twoslashes.forEach((codeblock) => {
    codeblock.addEventListener("mouseover", hover)
    codeblock.addEventListener("mouseout", resetHover)
  })
}
