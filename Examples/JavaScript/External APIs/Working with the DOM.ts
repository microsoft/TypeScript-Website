/// <reference path="lib.dom.d.ts" />
// This error message is OK ^

// The DOM is the underlaying API for working with a webpage,
// and TypeScript has great support for that API.

// Let's create a popover to show when you press run in
// the toolbar above.

const popover = document.createElement("div")
popover.id = "example-popover"

// Note that popover is correctly typed to be a HTMLDivElement
// specifically because we passed in "div". 

// To make it possible to re-run this code, we'll first
// add a function to remove the popover it it was already there. 

const removePopover = () => {
  const existingPopover = document.getElementById(popover.id)
  if (existingPopover && existingPopover.parentElement) {
    existingPopover.parentElement.removeChild(existingPopover)
  }
}

// Then call it right away

removePopover()

// We can set the inline styles on the element via the 
// .style property on a HTMLElement - this is fully typed

popover.style.backgroundColor = "#0078D4"
popover.style.color = "white"
popover.style.border = "1px solid black"
popover.style.position = "fixed"
popover.style.bottom = "10px"
popover.style.right = "20px"
popover.style.width = "200px"
popover.style.height = "100px"
popover.style.padding = "10px"

// Including more obscure, or deprecated CSS attributes
popover.style.webkitBorderRadius = "4px"

// To add content to the popover, we'll need to add
// a paragraph element and use it to add some text

const message = document.createElement("p")
message.textContent = "Here is an example popover"

// And we'll also add a close button 

const closebutton = document.createElement("a")
closebutton.textContent = "X"
closebutton.style.position = "absolute"
closebutton.style.top = "3px"
closebutton.style.right = "8px"
closebutton.style.color = "white"

closebutton.onclick = () => { removePopover() }

// Then add all of these elements on to the page
popover.appendChild(message)
popover.appendChild(closebutton)
document.body.appendChild(popover)

// If you hit "Run" above, then a popup should appear
// in the bottom left, which you can close by clicking
// on the x in the top right of the popup.

// This example shows how you can work with the DOM API
// in TypeScript - but it only shows a subset of working
// with the browser's APIs. TypeScript supports 

// There is an extended example for TypeScript with the
// WebGL example available here: example:typescript---webgl
