import { KeyboardEventHandler } from "react"
import { getTagFromParents } from "./Sidebar"

const UpArrow = 38
const DownArrow = 40

const childOfType = (tag: string, element: any) => {
  let found: HTMLElement | undefined
  for (const e of element.children) {
    if (e.nodeName === tag.toUpperCase()) found = e
  }
  return found
}

/**
 * Handles moving up and down through the navigation hierarchy
 * selecting leaf nodes and jumping up into section categories
 */
export const onAnchorKeyDown: KeyboardEventHandler = event => {
  const li = getTagFromParents("li", event.target as any)

  // Up, and jump into section headers
  if (event.keyCode == UpArrow) {
    const aboveLI = li.previousElementSibling
    const a = aboveLI && childOfType("a", aboveLI)
    const button = aboveLI && childOfType("button", aboveLI)

    if (a) {
      // next link
      a.focus()
    } else if (aboveLI && button) {
      // Jump to the subnav above, either at the bottom item if open or
      // the main button otherwise
      const open = aboveLI.classList.contains("open")
      if (open) {
        const listOfLinks = childOfType("ul", aboveLI)!
        const lastLI = listOfLinks.lastElementChild
        childOfType("a", lastLI)!.focus()
      } else {
        button.focus()
      }
    } else {
      // at the top
      const sectionHostingLI = getTagFromParents("li", li)
      childOfType("button", sectionHostingLI)!.focus()
    }

    event.preventDefault()
  }

  // Down, and jump into section header belows
  if (event.keyCode === DownArrow) {
    const belowLI = li.nextElementSibling
    const a = belowLI && childOfType("a", belowLI)
    const button = belowLI && childOfType("button", belowLI)

    if (a) {
      // next link
      a.focus()
    } else if (button) {
      // potential subnav above
      button.focus()
    } else {
      // at the bottom
      const sectionHostingLI = getTagFromParents("li", li)
      const nextLI = sectionHostingLI.nextElementSibling
      const a = nextLI && childOfType("a", nextLI)
      const button = nextLI && childOfType("button", nextLI)

      if (a) {
        // next link
        a.focus()
      } else if (button) {
        // potential subnav above
        button.focus()
      }
    }

    event.preventDefault()
  }
}

/**
 * Handles moving up and down through the navigation hierarchy
 * when it's at a section category, which has different semantics
 * from the a's above
 */
export const onButtonKeydown: KeyboardEventHandler = event => {
  const li = getTagFromParents("li", event.target as any)
  // Up, either go to the bottom of the a's in the section above
  // if it's open or jump to the previous sibling button
  if (event.keyCode == UpArrow) {
    const aboveLI = li.previousElementSibling
    if (!aboveLI) return // Hit the top

    const a = aboveLI && childOfType("a", aboveLI)
    const button = aboveLI && childOfType("button", aboveLI)

    if (a) {
      // next link
      a.focus()
    } else if (button) {
      // potential subnav above
      const open = aboveLI.classList.contains("open")
      if (open) {
        const listOfLinks = childOfType("ul", aboveLI)!
        const lastLI = listOfLinks.lastElementChild
        childOfType("a", lastLI)!.focus()
      } else {
        button.focus()
      }
    } else {
      // at the top
      const sectionHostingLI = getTagFromParents("li", li)
      childOfType("button", sectionHostingLI)!.focus()
    }

    event.preventDefault()
  }

  // Down, and jump into section header belows
  if (event.keyCode == DownArrow) {
    const open = li.classList.contains("open")
    if (open) {
      // Need to jump to first in the section
      const listOfLinks = childOfType("ul", li)!
      const lastLI = listOfLinks.firstElementChild
      childOfType("a", lastLI)!.focus()
    } else {
      const belowLI = li.nextElementSibling
      if (belowLI) {
        const a = belowLI && childOfType("a", belowLI)
        const button = belowLI && childOfType("button", belowLI)

        if (a) {
          // next link
          a.focus()
        } else if (button) {
          // potential subnav above
          button.focus()
        }
      }
    }
    event.preventDefault()
  }

  // Right, open
  if (event.key === "ArrowRight") {
    li.classList.remove("closed")
    li.classList.add("open")

    event.preventDefault()
  }

  // Right, close
  if (event.key === "ArrowLeft") {
    li.classList.remove("open")
    li.classList.add("closed")

    event.preventDefault()
  }
}
