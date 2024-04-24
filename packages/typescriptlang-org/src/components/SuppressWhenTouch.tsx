import React, { useEffect } from "react"
import { isTouchDevice } from "../lib/isTouchDevice"

/**
 * A React component which will remove its children (at runtime!)
 * from the hierarchy if we're on a touch device
 */
export const SuppressWhenTouch = ({ children, hideOnTouch }: any) => {

  useEffect(() => {
    if (isTouchDevice()) {
      // It's touch, so let's kill the content in the child and 
      // replace it with a message that this section isn't good for mobile
      const suppressible = document.getElementById("touch-suppressible")!
      while (suppressible.firstChild) {
        suppressible.removeChild(suppressible.firstChild)
      }

      if (hideOnTouch) return

      const h4 = document.createElement("h4")
      h4.textContent = "Section best on a computer"

      const p = document.createElement("p")
      p.textContent = "This part of the site does not run well on a touch-oriented browser. We recommend switching to a computer to carry on."

      suppressible.appendChild(h4)
      suppressible.appendChild(p)
    }

  }, [])
  return (
    <div id="touch-suppressible">
      {children}
    </div>)
}
