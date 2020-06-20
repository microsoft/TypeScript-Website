/**
 * Runs the closure when escape is tapped
 * @param func closure to run on escape being pressed
 */
export const whenEscape = (func: () => void) => (event: KeyboardEvent) => {
  const evt = event || window.event
  let isEscape = false
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc"
  } else {
    // @ts-ignore - this used to be the case
    isEscape = evt.keyCode === 27
  }
  if (isEscape) {
    func()
  }
}
