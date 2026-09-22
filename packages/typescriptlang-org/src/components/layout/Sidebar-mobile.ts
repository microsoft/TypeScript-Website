const mobileSidebarQuery = "(max-width: 800px)"
const sidebarId = "sidebar"
const toggleId = "small-device-button-sidebar"
const backdropId = "sidebar-backdrop"
const bodyOpenClass = "mobile-sidebar-open"

const backgroundElementsMadeInert = new Set<HTMLElement>()

type SidebarElements = {
  sidebar: HTMLElement
  toggle: HTMLButtonElement
  backdrop: HTMLElement
}

const getSidebarElements = (): SidebarElements | undefined => {
  const sidebar = document.getElementById(sidebarId)
  const toggle = document.getElementById(toggleId)
  const backdrop = document.getElementById(backdropId)

  if (!(sidebar instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement) || !(backdrop instanceof HTMLElement)) {
    return undefined
  }

  return { sidebar, toggle, backdrop }
}

const setBackgroundInert = (elements: SidebarElements, inert: boolean) => {
  if (!inert) {
    backgroundElementsMadeInert.forEach(element => element.removeAttribute("inert"))
    backgroundElementsMadeInert.clear()
    return
  }

  const interactiveElements = [elements.sidebar, elements.toggle, elements.backdrop]
  let current: HTMLElement | null = elements.sidebar

  while (current?.parentElement) {
    const parent: HTMLElement = current.parentElement
    Array.from(parent.children).forEach(child => {
      if (!(child instanceof HTMLElement)) return
      if (interactiveElements.some(element => child === element || child.contains(element))) return
      if (child.hasAttribute("inert")) return

      child.setAttribute("inert", "")
      backgroundElementsMadeInert.add(child)
    })
    current = parent
  }
}

const setOpen = (elements: SidebarElements, open: boolean, restoreFocus = false) => {
  elements.sidebar.classList.toggle("show", open)
  elements.sidebar.toggleAttribute("inert", !open)
  elements.toggle.setAttribute("aria-expanded", String(open))
  elements.toggle.setAttribute("aria-label", `${open ? "Close" : "Open"} sidebar navigation`)
  elements.backdrop.hidden = !open
  document.body.classList.toggle(bodyOpenClass, open)
  setBackgroundInert(elements, open)

  if (!open && restoreFocus) elements.toggle.focus()
}

/** Connects the independently rendered mobile drawer controls without changing desktop navigation. */
export const setupMobileSidebar = () => {
  const elements = getSidebarElements()
  if (!elements) return () => {}

  const mediaQuery = window.matchMedia(mobileSidebarQuery)
  const close = (restoreFocus = true) => setOpen(elements, false, restoreFocus)

  const toggle = () => {
    if (!mediaQuery.matches) return
    setOpen(elements, !elements.sidebar.classList.contains("show"), true)
  }
  const dismissFromBackdrop = () => close()
  const dismissFromKeyboard = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !mediaQuery.matches || !elements.sidebar.classList.contains("show")) return
    event.preventDefault()
    close()
  }
  const dismissFromDestination = (event: MouseEvent) => {
    if (!mediaQuery.matches || !elements.sidebar.classList.contains("show")) return
    if (!(event.target instanceof Element) || !event.target.closest("a")) return
    close()
  }
  const syncToViewport = () => {
    close(false)
    if (!mediaQuery.matches) elements.sidebar.removeAttribute("inert")
  }

  elements.toggle.addEventListener("click", toggle)
  elements.backdrop.addEventListener("click", dismissFromBackdrop)
  elements.sidebar.addEventListener("click", dismissFromDestination)
  document.addEventListener("keydown", dismissFromKeyboard)
  mediaQuery.addEventListener("change", syncToViewport)
  syncToViewport()

  return () => {
    elements.toggle.removeEventListener("click", toggle)
    elements.backdrop.removeEventListener("click", dismissFromBackdrop)
    elements.sidebar.removeEventListener("click", dismissFromDestination)
    document.removeEventListener("keydown", dismissFromKeyboard)
    mediaQuery.removeEventListener("change", syncToViewport)
    close(false)
    elements.sidebar.removeAttribute("inert")
  }
}
