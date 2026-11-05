/** @jest-environment jsdom */

import { setupMobileSidebar } from "./Sidebar-mobile"

const renderSidebar = (backgroundInert = false) => {
  document.body.innerHTML = `
    <div id="site-root">
      <header><a href="/">Home</a></header>
      <main>
        <section id="doc-layout">
          <button
            id="small-device-button-sidebar"
            aria-controls="sidebar"
            aria-expanded="false"
            aria-label="Open sidebar navigation"
          >Toggle</button>
          <div id="sidebar-backdrop" hidden></div>
          <nav id="sidebar">
            <button id="section-toggle">Section</button>
            <a href="/docs/destination">Destination</a>
          </nav>
          <article id="background"${backgroundInert ? " inert" : ""}>
            <button>Background action</button>
          </article>
        </section>
      </main>
      <footer><a href="/footer">Footer</a></footer>
    </div>
  `
}

const setMobileViewport = (matches: boolean) => {
  const listeners = new Set<() => void>()
  const media = {
    matches,
    addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
  }
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn(() => media),
  })
  return { media, listeners }
}

describe("mobile documentation sidebar", () => {
  afterEach(() => {
    document.body.innerHTML = ""
    document.body.className = ""
  })

  it("opens and closes from the trigger while exposing its state", () => {
    renderSidebar()
    setMobileViewport(true)
    const cleanup = setupMobileSidebar()
    const sidebar = document.getElementById("sidebar")!
    const toggle = document.getElementById("small-device-button-sidebar")!
    const backdrop = document.getElementById("sidebar-backdrop")!
    const background = document.getElementById("background")!

    expect(sidebar.hasAttribute("inert")).toBe(true)

    toggle.click()

    expect(sidebar.classList.contains("show")).toBe(true)
    expect(sidebar.hasAttribute("inert")).toBe(false)
    expect(toggle.getAttribute("aria-controls")).toBe("sidebar")
    expect(toggle.getAttribute("aria-expanded")).toBe("true")
    expect(toggle.getAttribute("aria-label")).toBe("Close sidebar navigation")
    expect(backdrop.hidden).toBe(false)
    expect(background.hasAttribute("inert")).toBe(true)
    expect(document.body.classList.contains("mobile-sidebar-open")).toBe(true)

    toggle.click()

    expect(sidebar.classList.contains("show")).toBe(false)
    expect(toggle.getAttribute("aria-expanded")).toBe("false")
    expect(toggle.getAttribute("aria-label")).toBe("Open sidebar navigation")
    expect(backdrop.hidden).toBe(true)
    expect(background.hasAttribute("inert")).toBe(false)
    expect(document.body.classList.contains("mobile-sidebar-open")).toBe(false)
    expect(document.activeElement).toBe(toggle)
    cleanup()
  })

  it("dismisses from the backdrop, Escape, and destination links only", () => {
    renderSidebar()
    setMobileViewport(true)
    const cleanup = setupMobileSidebar()
    const sidebar = document.getElementById("sidebar")!
    const toggle = document.getElementById("small-device-button-sidebar")!
    const backdrop = document.getElementById("sidebar-backdrop")!

    toggle.click()
    document.getElementById("section-toggle")!.click()
    expect(sidebar.classList.contains("show")).toBe(true)

    backdrop.click()
    expect(sidebar.classList.contains("show")).toBe(false)

    toggle.click()
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    expect(sidebar.classList.contains("show")).toBe(false)
    expect(document.activeElement).toBe(toggle)

    toggle.click()
    document.querySelector<HTMLAnchorElement>("#sidebar a")!.click()
    expect(sidebar.classList.contains("show")).toBe(false)
    cleanup()
  })

  it("leaves desktop navigation and pre-existing inert state unchanged", () => {
    renderSidebar(true)
    const { media, listeners } = setMobileViewport(false)
    const cleanup = setupMobileSidebar()
    const sidebar = document.getElementById("sidebar")!
    const toggle = document.getElementById("small-device-button-sidebar")!
    const background = document.getElementById("background")!

    toggle.click()
    expect(sidebar.classList.contains("show")).toBe(false)
    expect(sidebar.hasAttribute("inert")).toBe(false)

    media.matches = true
    listeners.forEach(listener => listener())
    expect(sidebar.hasAttribute("inert")).toBe(true)

    toggle.click()
    cleanup()
    expect(background.hasAttribute("inert")).toBe(true)
    expect(sidebar.hasAttribute("inert")).toBe(false)
  })
})
