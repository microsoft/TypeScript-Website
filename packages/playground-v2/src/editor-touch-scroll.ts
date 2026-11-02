import type * as monaco from "monaco-editor-core"
import { EventType } from "monaco-editor-core/esm/vs/base/browser/touch.js"

export function configureEditorTouchScroll(editor: monaco.editor.IStandaloneCodeEditor, mobileLayout: MediaQueryList) {
  const element = editor.getDomNode()
  if (!element) throw new Error("Cannot configure touch scrolling before the editor is mounted")
  const listeners = new AbortController()
  const options = { capture: true, passive: true, signal: listeners.signal }
  let pointerType = ""
  let chainGesture = false
  let scrollPage = false
  let dragged = false
  let startX = 0
  let startY = 0
  const recordDrag = (touch: Touch) => {
    if (Math.hypot(touch.clientX - startX, touch.clientY - startY) >= 8) dragged = true
  }

  element.addEventListener(
    "pointerdown",
    event => {
      pointerType = event.pointerType
    },
    options
  )
  element.addEventListener(
    "touchstart",
    event => {
      scrollPage = false
      dragged = false
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      chainGesture =
        event.touches.length === 1 &&
        pointerType !== "pen" &&
        event.target instanceof Element &&
        event.target.closest(".lines-content") !== null &&
        event.target.closest(".contentWidgets, .view-zones") === null
    },
    options
  )
  element.addEventListener(
    "touchmove",
    event => {
      if (!chainGesture || event.touches.length !== 1) return
      recordDrag(event.touches[0])
    },
    options
  )
  element.addEventListener(
    "touchend",
    event => {
      if (chainGesture && event.changedTouches.length === 1) recordDrag(event.changedTouches[0])
    },
    options
  )
  element.addEventListener(
    EventType.Tap,
    event => {
      // Monaco treats movements under 30px as taps, even after scrolling.
      if (chainGesture && dragged) event.stopPropagation()
    },
    options
  )
  element.addEventListener(
    EventType.Change,
    event => {
      if (
        !mobileLayout.matches ||
        !chainGesture ||
        !(event.target instanceof Element) ||
        !event.target.classList.contains("lines-content") ||
        !("translationY" in event) ||
        typeof event.translationY !== "number"
      )
        return
      const delta = -event.translationY
      if (!scrollPage) {
        const bounds = element.getBoundingClientRect()
        scrollPage = (delta < 0 && bounds.top < 0) || (delta > 0 && bounds.bottom > window.innerHeight)
      }
      if (scrollPage) {
        event.stopPropagation()
        window.scrollBy(0, delta)
        return
      }
      const top = editor.getScrollTop()
      const maximum = Math.max(0, editor.getScrollHeight() - editor.getLayoutInfo().height)
      const consumed = Math.min(maximum, Math.max(0, top + delta)) - top
      const remainder = delta - consumed
      if (remainder !== 0) window.scrollBy(0, remainder)
    },
    options
  )
  editor.onDidDispose(() => listeners.abort())
}
