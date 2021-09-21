import { getEffectiveConstraintOfTypeParameter } from "typescript"
import { PlaygroundPlugin } from "."

type Sandbox = import("@typescript/sandbox").Sandbox

export const createDragBar = (side: "left" | "right") => {
  const sidebar = document.createElement("div")
  sidebar.className = "playground-dragbar"
  if (side === "left") sidebar.classList.add("left")

  let leftSize = 0,
    rightSize = 0

  let left: HTMLElement, middle: HTMLElement, right: HTMLElement
  const drag = (e: MouseEvent) => {
    rightSize = right?.clientWidth
    leftSize = left?.clientWidth

    if (side === "right" && middle && right) {
      // Get how far right the mouse is from the right
      const rightX = right.getBoundingClientRect().right
      const offset = rightX - e.pageX
      const screenClampRight = window.innerWidth - 320
      rightSize = Math.min(Math.max(offset, 280), screenClampRight)
      // console.log({ leftSize, rightSize })

      // Set the widths
      middle.style.width = `calc(100% - ${rightSize + leftSize}px)`
      right.style.width = `${rightSize}px`
      right.style.flexBasis = `${rightSize}px`
      right.style.maxWidth = `${rightSize}px`
    }

    if (side === "left" && left && middle) {
      // Get how far right the mouse is from the right
      const leftX = e.pageX //left.getBoundingClientRect().left
      const screenClampLeft = window.innerWidth - 320
      leftSize = Math.min(Math.max(leftX, 180), screenClampLeft)

      // Set the widths
      middle.style.width = `calc(100% - ${rightSize + leftSize}px)`
      left.style.width = `${leftSize}px`
      left.style.flexBasis = `${leftSize}px`
      left.style.maxWidth = `${leftSize}px`
    }

    // Save the x coordinate of the
    if (window.localStorage) {
      window.localStorage.setItem("dragbar-left", "" + leftSize)
      window.localStorage.setItem("dragbar-right", "" + rightSize)
      window.localStorage.setItem("dragbar-window-width", "" + window.innerWidth)
    }

    // @ts-ignore - I know what I'm doing
    window.sandbox.editor.layout()

    // Don't allow selection
    // e.stopPropagation()
    // e.cancelBubble = true
  }

  sidebar.addEventListener("mousedown", e => {
    sidebar.classList.add("selected")
    left = document.getElementById("navigation-container")!
    middle = document.getElementById("editor-container")!
    right = sidebar.parentElement?.getElementsByClassName("playground-sidebar").item(0)! as any
    // Handle dragging all over the screen
    document.addEventListener("mousemove", drag)

    // Remove it when you lt go anywhere
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", drag)
      document.body.style.userSelect = "auto"
      sidebar.classList.remove("selected")
    })

    // Don't allow the drag to select text accidentally
    document.body.style.userSelect = "none"
    e.stopPropagation()
    e.cancelBubble = true
  })

  return sidebar
}

export const sidebarHidden = () => !!window.localStorage.getItem("sidebar-hidden")

export const createSidebar = () => {
  const sidebar = document.createElement("div")
  sidebar.className = "playground-sidebar"

  // Start with the sidebar hidden on small screens
  const isTinyScreen = window.innerWidth < 800

  // This is independent of the sizing below so that you keep the same sized sidebar
  if (isTinyScreen || sidebarHidden()) {
    sidebar.style.display = "none"
  }

  if (window.localStorage && window.localStorage.getItem("dragbar-x")) {
    // Don't restore the x pos if the window isn't the same size
    if (window.innerWidth === Number(window.localStorage.getItem("dragbar-window-width"))) {
      // Set the dragger to the previous x pos
      let width = window.localStorage.getItem("dragbar-x")

      if (isTinyScreen) {
        width = String(Math.min(Number(width), 280))
      }

      sidebar.style.width = `${width}px`
      sidebar.style.flexBasis = `${width}px`
      sidebar.style.maxWidth = `${width}px`

      const left = document.getElementById("editor-container")!
      left.style.width = `calc(100% - ${width}px)`
    }
  }

  return sidebar
}

const toggleIconWhenOpen = "&#x21E5;"
const toggleIconWhenClosed = "&#x21E4;"

export const setupSidebarToggle = () => {
  const toggle = document.getElementById("sidebar-toggle")!

  const updateToggle = () => {
    const sidebar = window.document.querySelector(".playground-sidebar") as HTMLDivElement
    const sidebarShowing = sidebar.style.display !== "none"

    toggle.innerHTML = sidebarShowing ? toggleIconWhenOpen : toggleIconWhenClosed
    toggle.setAttribute("aria-label", sidebarShowing ? "Hide Sidebar" : "Show Sidebar")
  }

  toggle.onclick = () => {
    const sidebar = window.document.querySelector(".playground-sidebar") as HTMLDivElement
    const newState = sidebar.style.display !== "none"

    if (newState) {
      localStorage.setItem("sidebar-hidden", "true")
      sidebar.style.display = "none"
    } else {
      localStorage.removeItem("sidebar-hidden")
      sidebar.style.display = "block"
    }

    updateToggle()

    // @ts-ignore - I know what I'm doing
    window.sandbox.editor.layout()

    return false
  }

  // Ensure its set up at the start
  updateToggle()
}

export const createTabBar = () => {
  const tabBar = document.createElement("div")
  tabBar.classList.add("playground-plugin-tabview")
  tabBar.id = "playground-plugin-tabbar"
  tabBar.setAttribute("aria-label", "Tabs for plugins")
  tabBar.setAttribute("role", "tablist")

  /** Support left/right in the tab bar for accessibility */
  let tabFocus = 0
  tabBar.addEventListener("keydown", e => {
    const tabs = document.querySelectorAll('.playground-plugin-tabview [role="tab"]')
    // Move right
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      tabs[tabFocus].setAttribute("tabindex", "-1")
      if (e.key === "ArrowRight") {
        tabFocus++
        // If we're at the end, go to the start
        if (tabFocus >= tabs.length) {
          tabFocus = 0
        }
        // Move left
      } else if (e.key === "ArrowLeft") {
        tabFocus--
        // If we're at the start, move to the end
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1
        }
      }

      tabs[tabFocus].setAttribute("tabindex", "0")
      ;(tabs[tabFocus] as any).focus()
    }
  })

  return tabBar
}

export const createPluginContainer = () => {
  const container = document.createElement("div")
  container.setAttribute("role", "tabpanel")
  container.classList.add("playground-plugin-container")
  return container
}

export const createTabForPlugin = (plugin: PlaygroundPlugin) => {
  const element = document.createElement("button")
  element.setAttribute("role", "tab")
  element.setAttribute("aria-selected", "false")
  element.id = "playground-plugin-tab-" + plugin.id
  element.textContent = plugin.displayName
  return element
}

export const activatePlugin = (
  plugin: PlaygroundPlugin,
  previousPlugin: PlaygroundPlugin | undefined,
  sandbox: Sandbox,
  tabBar: HTMLDivElement,
  container: HTMLDivElement
) => {
  let newPluginTab: Element, oldPluginTab: Element
  // @ts-ignore - This works at runtime
  for (const tab of tabBar.children) {
    if (tab.id === `playground-plugin-tab-${plugin.id}`) newPluginTab = tab
    if (previousPlugin && tab.id === `playground-plugin-tab-${previousPlugin.id}`) oldPluginTab = tab
  }

  // @ts-ignore
  if (!newPluginTab) throw new Error("Could not get a tab for the plugin: " + plugin.displayName)

  // Tell the old plugin it's getting the boot
  // @ts-ignore
  if (previousPlugin && oldPluginTab) {
    if (previousPlugin.willUnmount) previousPlugin.willUnmount(sandbox, container)
    oldPluginTab.classList.remove("active")
    oldPluginTab.setAttribute("aria-selected", "false")
    oldPluginTab.removeAttribute("tabindex")
  }

  // Wipe the sidebar
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  // Start booting up the new plugin
  newPluginTab.classList.add("active")
  newPluginTab.setAttribute("aria-selected", "true")
  newPluginTab.setAttribute("tabindex", "0")

  // Tell the new plugin to start doing some work
  if (plugin.willMount) plugin.willMount(sandbox, container)
  if (plugin.modelChanged) plugin.modelChanged(sandbox, sandbox.getModel(), container)
  if (plugin.modelChangedDebounce) plugin.modelChangedDebounce(sandbox, sandbox.getModel(), container)
  if (plugin.didMount) plugin.didMount(sandbox, container)

  // Let the previous plugin do any slow work after it's all done
  if (previousPlugin && previousPlugin.didUnmount) previousPlugin.didUnmount(sandbox, container)
}

export const createNavigationSection = () => {
  const container = document.createElement("div")
  container.id = "navigation-container"
  return container
}
