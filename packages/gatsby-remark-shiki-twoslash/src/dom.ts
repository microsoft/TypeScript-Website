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
  const globalPopover = document.getElementById('twoslash-mouse-hover-info')
  if (globalPopover) globalPopover.style.display = 'none'
}

// Get it
const findOrCreateTooltip = () => {
  let globalPopover = document.getElementById('twoslash-mouse-hover-info')
  if (!globalPopover) {
    globalPopover = document.createElement('div')
    globalPopover.style.position = 'absolute'
    globalPopover.id = 'twoslash-mouse-hover-info'
    document.body.appendChild(globalPopover)
  }
  return globalPopover
}

/**
 * Creates the main mouse over popup for LSP info using the DOM API.
 * It is expected to be run inside a `useEffect` block inside your main
 * exported component in Gatsby.
 *
 * @example
 * import React, { useEffect } from "react"
 * import { setupTwoslashHovers } from "gatsby-remark-shiki-twoslash/dom";
 *
 * export default () => {
 *   // Add a the hovers
 *   useEffect(setupTwoslashHovers, [])
 *
 *   // Normal JSX
 *   return </>
 * }
 *
 */
export const setupTwoslashHovers = () => {
  // prettier-ignore
  const twoslashes = document.querySelectorAll(".shiki.twoslash .code-container code")

  // Gets triggered on the spans inside the codeblocks
  const hover = (event: Event) => {
    const hovered = event.target as HTMLElement
    if (hovered.nodeName !== 'DATA-LSP') return resetHover()

    const message = hovered.getAttribute('lsp')!
    const position = getAbsoluteElementPos(hovered)

    // Create or re-use the current hover dic
    const tooltip = findOrCreateTooltip()

    // Use a textarea to un-htmlencode for presenting to the user
    var txt = document.createElement('textarea')
    txt.innerHTML = message
    tooltip.textContent = txt.value

    // Offset it a bit from the mouse and present it at an absolute position
    const yOffset = 20
    tooltip.style.display = 'block'
    tooltip.style.top = `${position.top + yOffset}px`
    tooltip.style.left = `${position.left}px`
  }

  twoslashes.forEach((codeblock) => {
    codeblock.addEventListener('mouseover', hover)
    codeblock.addEventListener('mouseout', resetHover)
  })
}
