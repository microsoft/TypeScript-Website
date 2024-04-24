export function setupStickyNavigation() {
  const nav = document.getElementById("top-menu")
  if (!nav) throw new Error("Didn't find a nav")

  const sideButton = document.getElementById("small-device-button-sidebar")
  let previousY = 9999

  const updateNav = () => {
    // iOS scrolls to make sure the viewport fits, don't hide the input then
    const hasKeyboardFocus =
      document.activeElement &&
      (document.activeElement.nodeName === "INPUT" ||
        document.activeElement.nodeName === "TEXTAREA")

    if (hasKeyboardFocus) {
      return
    }

    const showNav = () => {
      nav.classList.add("down")
      nav.classList.remove("up")
      sideButton?.classList.add("hidden")
    }

    const hideNav = () => {
      nav.classList.add("up")
      nav.classList.remove("down")
      sideButton?.classList.remove("hidden")
    }

    const goingUp = window.pageYOffset > 1 && window.pageYOffset > previousY
    previousY = window.pageYOffset

    if (goingUp) {
      showNav()
    } else {
      hideNav()
    }
  }

  // Non-blocking nav change
  document.removeEventListener("scroll", updateNav, {
    capture: true,
    passive: true,
  } as any)

  document.addEventListener("scroll", updateNav, {
    capture: true,
    passive: true,
  })
}
