import { KeyboardEventHandler } from "react"
import { getTagFromParents } from "./Sidebar"

const childOfType = (tag: string, element: Element) => {
  let found: Element = null
  for(const e of element.children) {
    if(e.nodeName === tag.toUpperCase()) found = e
  }
  if(!found) throw new Error(`Could not find a ${tag} in the children of ${element.tagName}`)
  return found
}

/** 
 * Handles moving up and down through the navigation hierarchy 
 * selecting leaf nodes and jumping up into section categories
 */
export const onAnchorKeyDown: KeyboardEventHandler = (event) => {
  const li = getTagFromParents("li", event.target);
  // Up, and jump into section headers
  if (event.keyCode == 38) {
    const aboveLI = li.previousElementSibling;
    if (aboveLI)
      childOfType("a", aboveLI).focus();
    else {
      const sectionHostingLI = getTagFromParents("li", li);
      childOfType("button", sectionHostingLI).focus();
    }
    event.preventDefault();
  }

  // Down, and jump into section header belows
  if (event.keyCode === 40) {
    const belowLI = li.nextElementSibling;
    if (belowLI)
      childOfType("a", belowLI).focus();

    else {
      const sectionHostingCurrentLI = getTagFromParents("li", li);
      const nextLI = sectionHostingCurrentLI.nextElementSibling;
      childOfType("button", nextLI).focus();
    }
    event.preventDefault();
  }
}

/** 
 * Handles moving up and down through the navigation hierarchy 
 * when it's at a section category, which has different semantics
 * from the a's above
 */
export const onButtonKeydown: KeyboardEventHandler = (event) => {
  const li = getTagFromParents("li", event.target);
  // Up, either go to the bottom of the a's in the section above 
  // if it's open or jump to the previous sibling button
  if (event.keyCode == 38) {
    const aboveLI = li.previousElementSibling;

    if (!aboveLI) return; // Hit the top
    const open = aboveLI.classList.contains("open")
    if (open) {
      // Need to jump to last a in above section
      const listOfLinks = childOfType("ul", aboveLI)
      const lastLI = listOfLinks.lastElementChild
      childOfType("a", lastLI).focus();

    } else {
      childOfType("button", aboveLI).focus();
    }
    // aboveLI.firstElementChild.focus();

    event.preventDefault();
  }

  // Down, and jump into section header belows
  if (event.keyCode == 40) {
    const open = li.classList.contains("open")
    if (open) {
      // Need to jump to first in the section
      const listOfLinks = childOfType("ul", li)
      const lastLI = listOfLinks.firstElementChild
      childOfType("a", lastLI).focus();
      
    } else {
      const belowLI = li.nextElementSibling;
      if (belowLI) childOfType("button", belowLI).focus();
    }
    event.preventDefault();
  }

  // Right, open
  if (event.keyCode == 39) {
    li.classList.remove("closed")
    li.classList.add("open")

    event.preventDefault();
  } 

  // Right, close
  if (event.keyCode == 37) {
    li.classList.remove("open")
    li.classList.add("closed")
    
    event.preventDefault();
  } 

}
