/// <reference path="lib.dom.d.ts" />

// The DOM is the underlaying API for working with a webpage,
// and TypeScript has great support for that API.

// Let's create a popover to show when you press run in
// the toolbar above.

const popover = document.createElement("div")
popover.id = "example-popover"

// Note that popover is correctly typed to be a HTMLDivElement
// specifically because we passed in "div". 

// To make it possible to re-run this code, we'll first
// remove the popover it it was already there. 

const existingPopover = document.getElementById(popover.id)
if (existingPopover && existingPopover.parentElement) {
  existingPopover.parentElement.removeChild(existingPopover)
}
