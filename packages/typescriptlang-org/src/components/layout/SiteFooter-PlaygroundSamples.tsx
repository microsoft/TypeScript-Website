import React, { useEffect } from "react"

import { RenderExamples } from "../ShowExamples"

interface Props {
  lang: string
}

export const PlaygroundSamples = (props: Props) => {

  // This ensures that the popover only becomes available when JS is enabled

  useEffect(() => {
    // Only allow hovering on wider windows 
    const allowHover = window.innerWidth > 900
    if (!allowHover) {
      (document.getElementById("playground-samples-popover") as any).style.display = "none"
      return
    }

    // Visually enable the popover icon
    const iconSpan = document.getElementsByClassName("footer-icon")[0] as HTMLElement
    iconSpan.style.display = "inline-block"

    // This is all that is needed for the mouse hover
    // @ts-ignore
    for (const element of document.getElementsByClassName("popover-container")) {
      element.classList.add("allow-hover")
    }

    // This is used to handle tabbing
    const showPopover = () => {
      const popover = document.getElementById("playground-samples-popover")
      if (!popover) throw new Error("No popover found")
      popover.style.visibility = "visible"
      popover.style.opacity = "1"

      // When the popover is up, allow tabbing through all of the items to hide the popover
      popover.addEventListener("blur", (e) => {
        const element = e.relatedTarget as HTMLElement
        if (!element || element.tagName === "A" && !element.classList.contains("example-link")) {
          popover.style.visibility = "hidden"
        }
      }, true);
    }

    const triggerAnchor = document.getElementById("popover-trigger-anchor")
    if (!triggerAnchor) throw new Error("No trigger anchor found")
    triggerAnchor.onfocus = showPopover
  }, []);

  return (
    <div id="playground-samples-popover" aria-hidden="true" aria-label="Code Samples Submenu" tabIndex={-1}>
      <RenderExamples defaultSection="TypeScript" sections={["JavaScript", "TypeScript"]} />
      <div className="arrow-down" />
    </div>)
}
