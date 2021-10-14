type Sandbox = import("@typescript/sandbox").Sandbox
type Monaco = typeof import("monaco-editor")

declare const window: any

import {
  createSidebar,
  createTabForPlugin,
  createTabBar,
  createPluginContainer,
  activatePlugin,
  createDragBar,
  setupSidebarToggle,
  createNavigationSection,
} from "./createElements"
import { runWithCustomLogs } from "./sidebar/runtime"
import { createExporter } from "./exporter"
import { createUI } from "./createUI"
import { getExampleSourceCode } from "./getExample"
import { ExampleHighlighter } from "./monaco/ExampleHighlight"
import { createConfigDropdown, updateConfigDropdownForCompilerOptions } from "./createConfigDropdown"
import { allowConnectingToLocalhost, activePlugins, addCustomPlugin } from "./sidebar/plugins"
import { createUtils, PluginUtils } from "./pluginUtils"
import type React from "react"
import { settingsPlugin, getPlaygroundPlugins } from "./sidebar/settings"
import { gistPoweredNavBar } from "./navigation"

export { PluginUtils } from "./pluginUtils"

export type PluginFactory = {
  (i: (key: string, components?: any) => string, utils: PluginUtils): PlaygroundPlugin
}

/** The interface of all sidebar plugins */
export interface PlaygroundPlugin {
  /** Not public facing, but used by the playground to uniquely identify plugins */
  id: string
  /** To show in the tabs */
  displayName: string
  /** Should this plugin be selected when the plugin is first loaded? Lets you check for query vars etc to load a particular plugin */
  shouldBeSelected?: () => boolean
  /** Before we show the tab, use this to set up your HTML - it will all be removed by the playground when someone navigates off the tab */
  willMount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** After we show the tab */
  didMount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** Model changes while this plugin is actively selected  */
  modelChanged?: (sandbox: Sandbox, model: import("monaco-editor").editor.ITextModel, container: HTMLDivElement) => void
  /** Delayed model changes while this plugin is actively selected, useful when you are working with the TS API because it won't run on every keypress */
  modelChangedDebounce?: (
    sandbox: Sandbox,
    model: import("monaco-editor").editor.ITextModel,
    container: HTMLDivElement
  ) => void
  /** Before we remove the tab */
  willUnmount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** After we remove the tab */
  didUnmount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** An object you can use to keep data around in the scope of your plugin object */
  data?: any
}

interface PlaygroundConfig {
  /** Language like "en" / "ja" etc */
  lang: string
  /** Site prefix, like "v2" during the pre-release */
  prefix: string
  /** Optional plugins so that we can re-use the playground with different sidebars */
  plugins?: PluginFactory[]
  /** Should this playground load up custom plugins from localStorage? */
  supportCustomPlugins: boolean
}

export const setupPlayground = (
  sandbox: Sandbox,
  monaco: Monaco,
  config: PlaygroundConfig,
  i: (key: string) => string,
  react: typeof React
) => {
  const playgroundParent = sandbox.getDomNode().parentElement!.parentElement!.parentElement!
  // UI to the left

  const leftNav = createNavigationSection()
  playgroundParent.insertBefore(leftNav, sandbox.getDomNode().parentElement!.parentElement!)

  const dragBarLeft = createDragBar("left")
  playgroundParent.insertBefore(dragBarLeft, sandbox.getDomNode().parentElement!.parentElement!)

  leftNav.style.display = "none"
  dragBarLeft.style.display = "none"

  const showNav = () => {
    const right = document.getElementsByClassName("playground-sidebar").item(0)!
    const middle = document.getElementById("editor-container")!
    middle.style.width = `calc(100% - ${right.clientWidth + 180}px)`

    leftNav.style.display = "block"
    leftNav.style.width = "180px"
    leftNav.style.minWidth = "180px"
    leftNav.style.maxWidth = "180px"
    dragBarLeft.style.display = "block"
  }

  // UI to the right
  const dragBar = createDragBar("right")
  playgroundParent.appendChild(dragBar)

  const sidebar = createSidebar()
  playgroundParent.appendChild(sidebar)

  const tabBar = createTabBar()
  sidebar.appendChild(tabBar)

  const container = createPluginContainer()
  sidebar.appendChild(container)

  const plugins = [] as PlaygroundPlugin[]
  const tabs = [] as HTMLButtonElement[]

  // Let's things like the workbench hook into tab changes
  let didUpdateTab: (newPlugin: PlaygroundPlugin, previousPlugin: PlaygroundPlugin) => void | undefined

  const registerPlugin = (plugin: PlaygroundPlugin) => {
    plugins.push(plugin)

    const tab = createTabForPlugin(plugin)

    tabs.push(tab)

    const tabClicked: HTMLElement["onclick"] = e => {
      const previousPlugin = getCurrentPlugin()
      let newTab = e.target as HTMLElement
      // It could be a notification you clicked on
      if (newTab.tagName === "DIV") newTab = newTab.parentElement!
      const newPlugin = plugins.find(p => `playground-plugin-tab-${p.id}` == newTab.id)!
      activatePlugin(newPlugin, previousPlugin, sandbox, tabBar, container)
      didUpdateTab && didUpdateTab(newPlugin, previousPlugin)
    }

    tabBar.appendChild(tab)
    tab.onclick = tabClicked
  }

  const setDidUpdateTab = (func: (newPlugin: PlaygroundPlugin, previousPlugin: PlaygroundPlugin) => void) => {
    didUpdateTab = func
  }

  const getCurrentPlugin = () => {
    const selectedTab = tabs.find(t => t.classList.contains("active"))!
    return plugins[tabs.indexOf(selectedTab)]
  }

  const defaultPlugins = config.plugins || getPlaygroundPlugins()
  const utils = createUtils(sandbox, react)
  const initialPlugins = defaultPlugins.map(f => f(i, utils))
  initialPlugins.forEach(p => registerPlugin(p))

  // Choose which should be selected
  const priorityPlugin = plugins.find(plugin => plugin.shouldBeSelected && plugin.shouldBeSelected())
  const selectedPlugin = priorityPlugin || plugins[0]
  const selectedTab = tabs[plugins.indexOf(selectedPlugin)]!
  selectedTab.onclick!({ target: selectedTab } as any)

  let debouncingTimer = false
  sandbox.editor.onDidChangeModelContent(_event => {
    const plugin = getCurrentPlugin()
    if (plugin.modelChanged) plugin.modelChanged(sandbox, sandbox.getModel(), container)

    // This needs to be last in the function
    if (debouncingTimer) return
    debouncingTimer = true
    setTimeout(() => {
      debouncingTimer = false
      playgroundDebouncedMainFunction()

      // Only call the plugin function once every 0.3s
      if (plugin.modelChangedDebounce && plugin.id === getCurrentPlugin().id) {
        plugin.modelChangedDebounce(sandbox, sandbox.getModel(), container)
      }
    }, 300)
  })

  // If you set this to true, then the next time the playground would
  // have set the user's hash it would be skipped - used for setting
  // the text in examples
  let suppressNextTextChangeForHashChange = false

  // Sets the URL and storage of the sandbox string
  const playgroundDebouncedMainFunction = () => {
    localStorage.setItem("sandbox-history", sandbox.getText())
  }

  sandbox.editor.onDidBlurEditorText(() => {
    const alwaysUpdateURL = !localStorage.getItem("disable-save-on-type")
    if (alwaysUpdateURL) {
      if (suppressNextTextChangeForHashChange) {
        suppressNextTextChangeForHashChange = false
        return
      }
      const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox)
      window.history.replaceState({}, "", newURL)
    }
  })

  // Keeps track of whether the project has been set up as an ESM module via a package.json
  let isESMMode = false

  // When any compiler flags are changed, trigger a potential change to the URL
  sandbox.setDidUpdateCompilerSettings(async () => {
    playgroundDebouncedMainFunction()
    // @ts-ignore
    window.appInsights && window.appInsights.trackEvent({ name: "Compiler Settings changed" })

    const model = sandbox.editor.getModel()
    const plugin = getCurrentPlugin()
    if (model && plugin.modelChanged) plugin.modelChanged(sandbox, model, container)
    if (model && plugin.modelChangedDebounce) plugin.modelChangedDebounce(sandbox, model, container)

    const alwaysUpdateURL = !localStorage.getItem("disable-save-on-type")
    if (alwaysUpdateURL) {
      const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox)
      window.history.replaceState({}, "", newURL)
    }

    // Add an outer package.json with 'module: type'
    const moduleNumber = sandbox.getCompilerOptions().module || 0
    const isESMviaModule = moduleNumber > 99 && moduleNumber < 200
    const moduleResNumber = sandbox.getCompilerOptions().moduleResolution || 0
    const isESMviaModuleRes = moduleResNumber > 2 && moduleResNumber < 100

    if (isESMviaModule || isESMviaModuleRes) {
      if (isESMMode) return
      isESMMode = true
      setTimeout(() => { ui.flashInfo(i("play_esm_mode")) }, 300)

      sandbox.addLibraryToRuntime(JSON.stringify({ name: "playground", type: "module" }), "/package.json")

      const worker = await sandbox.getWorkerProcess()
      // @ts-ignore
      worker.getExtraLibs().then(e => console.log(e))
    }
  })

  const skipInitiallySettingHash = document.location.hash && document.location.hash.includes("example/")
  if (!skipInitiallySettingHash) playgroundDebouncedMainFunction()

  // Setup working with the existing UI, once it's loaded

  // Versions of TypeScript

  // Set up the label for the dropdown
  const versionButton = document.querySelectorAll("#versions > a").item(0)
  versionButton.innerHTML = "v" + sandbox.ts.version + " <span class='caret'/>"
  versionButton.setAttribute("aria-label", `Select version of TypeScript, currently ${sandbox.ts.version}`)

  // Add the versions to the dropdown
  const versionsMenu = document.querySelectorAll("#versions > ul").item(0)

  // Enable all submenus
  document.querySelectorAll("nav ul li").forEach(e => e.classList.add("active"))

  const notWorkingInPlayground = ["3.1.6", "3.0.1", "2.8.1", "2.7.2", "2.4.1"]

  const allVersions = [...sandbox.supportedVersions.filter(f => !notWorkingInPlayground.includes(f)), "Nightly"]

  allVersions.forEach((v: string) => {
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.textContent = v
    a.href = "#"

    if (v === "Nightly") {
      li.classList.add("nightly")
    }

    if (v.toLowerCase().includes("beta")) {
      li.classList.add("beta")
    }

    li.onclick = () => {
      const currentURL = sandbox.createURLQueryWithCompilerOptions(sandbox)
      const params = new URLSearchParams(currentURL.split("#")[0])
      const version = v === "Nightly" ? "next" : v
      params.set("ts", version)

      const hash = document.location.hash.length ? document.location.hash : ""
      const newURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}?${params}${hash}`

      // @ts-ignore - it is allowed
      document.location = newURL
    }

    li.appendChild(a)
    versionsMenu.appendChild(li)
  })

  // Support dropdowns
  document.querySelectorAll(".navbar-sub li.dropdown > a").forEach(link => {
    const a = link as HTMLAnchorElement
    a.onclick = _e => {
      if (a.parentElement!.classList.contains("open")) {
        document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"))
        a.setAttribute("aria-expanded", "false")
      } else {
        document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"))
        a.parentElement!.classList.toggle("open")
        a.setAttribute("aria-expanded", "true")

        const exampleContainer = a.closest("li")!.getElementsByTagName("ul").item(0)!

        const firstLabel = exampleContainer.querySelector("label") as HTMLElement
        if (firstLabel) firstLabel.focus()

        // Set exact height and widths for the popovers for the main playground navigation
        const isPlaygroundSubmenu = !!a.closest("nav")
        if (isPlaygroundSubmenu) {
          const playgroundContainer = document.getElementById("playground-container")!
          exampleContainer.style.height = `calc(${playgroundContainer.getBoundingClientRect().height + 26}px - 4rem)`

          const sideBarWidth = (document.querySelector(".playground-sidebar") as any).offsetWidth
          exampleContainer.style.width = `calc(100% - ${sideBarWidth}px - 71px)`

          // All this is to make sure that tabbing stays inside the dropdown for tsconfig/examples
          const buttons = exampleContainer.querySelectorAll("input")
          const lastButton = buttons.item(buttons.length - 1) as HTMLElement
          if (lastButton) {
            redirectTabPressTo(lastButton, exampleContainer, ".examples-close")
          } else {
            const sections = document.querySelectorAll("ul.examples-dropdown .section-content")
            sections.forEach(s => {
              const buttons = s.querySelectorAll("a.example-link")
              const lastButton = buttons.item(buttons.length - 1) as HTMLElement
              if (lastButton) {
                redirectTabPressTo(lastButton, exampleContainer, ".examples-close")
              }
            })
          }
        }
      }
      return false
    }
  })

  // Handle escape closing dropdowns etc
  document.onkeydown = function (evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc"
    } else {
      // @ts-ignore - this used to be the case
      isEscape = evt.keyCode === 27
    }
    if (isEscape) {
      document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"))
      document.querySelectorAll(".navbar-sub li").forEach(i => i.setAttribute("aria-expanded", "false"))
    }
  }

  const shareAction = {
    id: "copy-clipboard",
    label: "Save to clipboard",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],

    contextMenuGroupId: "run",
    contextMenuOrder: 1.5,

    run: function () {
      // Update the URL, then write that to the clipboard
      const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox)
      window.history.replaceState({}, "", newURL)
      window.navigator.clipboard.writeText(location.href.toString()).then(
        () => ui.flashInfo(i("play_export_clipboard")),
        (e: any) => alert(e)
      )
    },
  }

  const shareButton = document.getElementById("share-button")
  if (shareButton) {
    shareButton.onclick = e => {
      e.preventDefault()
      shareAction.run()
      return false
    }

    // Set up some key commands
    sandbox.editor.addAction(shareAction)

    sandbox.editor.addAction({
      id: "run-js",
      label: "Run the evaluated JavaScript for your TypeScript file",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],

      contextMenuGroupId: "run",
      contextMenuOrder: 1.5,

      run: function (ed) {
        const runButton = document.getElementById("run-button")
        runButton && runButton.onclick && runButton.onclick({} as any)
      },
    })
  }

  const runButton = document.getElementById("run-button")
  if (runButton) {
    runButton.onclick = () => {
      const run = sandbox.getRunnableJS()
      const runPlugin = plugins.find(p => p.id === "logs")!
      activatePlugin(runPlugin, getCurrentPlugin(), sandbox, tabBar, container)

      runWithCustomLogs(run, i)

      const isJS = sandbox.config.filetype === "js"
      ui.flashInfo(i(isJS ? "play_run_js" : "play_run_ts"))
      return false
    }
  }

  // Handle the close buttons on the examples
  document.querySelectorAll("button.examples-close").forEach(b => {
    const button = b as HTMLButtonElement
    button.onclick = (e: any) => {
      const button = e.target as HTMLButtonElement
      const navLI = button.closest("li")
      navLI?.classList.remove("open")
    }
  })

  setupSidebarToggle()

  if (document.getElementById("config-container")) {
    createConfigDropdown(sandbox, monaco)
    updateConfigDropdownForCompilerOptions(sandbox, monaco)
  }

  if (document.getElementById("playground-settings")) {
    const settingsToggle = document.getElementById("playground-settings")!

    settingsToggle.onclick = () => {
      const open = settingsToggle.parentElement!.classList.contains("open")
      const sidebarTabs = document.querySelector(".playground-plugin-tabview") as HTMLDivElement
      const sidebarContent = document.querySelector(".playground-plugin-container") as HTMLDivElement
      let settingsContent = document.querySelector(".playground-settings-container") as HTMLDivElement

      if (!settingsContent) {
        settingsContent = document.createElement("div")
        settingsContent.className = "playground-settings-container playground-plugin-container"
        const settings = settingsPlugin(i, utils)
        settings.didMount && settings.didMount(sandbox, settingsContent)
        document.querySelector(".playground-sidebar")!.appendChild(settingsContent)

        // When the last tab item is hit, go back to the settings button
        const labels = document.querySelectorAll(".playground-sidebar input")
        const lastLabel = labels.item(labels.length - 1) as HTMLElement
        if (lastLabel) {
          redirectTabPressTo(lastLabel, undefined, "#playground-settings")
        }
      }

      if (open) {
        sidebarTabs.style.display = "flex"
        sidebarContent.style.display = "block"
        settingsContent.style.display = "none"
      } else {
        sidebarTabs.style.display = "none"
        sidebarContent.style.display = "none"
        settingsContent.style.display = "block"
        document.querySelector<HTMLElement>(".playground-sidebar label")!.focus()
      }
      settingsToggle.parentElement!.classList.toggle("open")
    }

    settingsToggle.addEventListener("keydown", e => {
      const isOpen = settingsToggle.parentElement!.classList.contains("open")
      if (e.key === "Tab" && isOpen) {
        const result = document.querySelector(".playground-options li input") as any
        result.focus()
        e.preventDefault()
      }
    })
  }

  // Support grabbing examples from the location hash
  if (location.hash.startsWith("#example")) {
    const exampleName = location.hash.replace("#example/", "").trim()
    sandbox.config.logger.log("Loading example:", exampleName)
    getExampleSourceCode(config.prefix, config.lang, exampleName).then(ex => {
      if (ex.example && ex.code) {
        const { example, code } = ex

        // Update the localstorage showing that you've seen this page
        if (localStorage) {
          const seenText = localStorage.getItem("examples-seen") || "{}"
          const seen = JSON.parse(seenText)
          seen[example.id] = example.hash
          localStorage.setItem("examples-seen", JSON.stringify(seen))
        }

        const allLinks = document.querySelectorAll("example-link")
        // @ts-ignore
        for (const link of allLinks) {
          if (link.textContent === example.title) {
            link.classList.add("highlight")
          }
        }

        document.title = "TypeScript Playground - " + example.title
        suppressNextTextChangeForHashChange = true
        sandbox.setText(code)
      } else {
        suppressNextTextChangeForHashChange = true
        sandbox.setText("// There was an issue getting the example, bad URL? Check the console in the developer tools")
      }
    })
  }

  const model = sandbox.getModel()
  model.onDidChangeDecorations(() => {
    const markers = sandbox.monaco.editor.getModelMarkers({ resource: model.uri }).filter(m => m.severity !== 1)
    utils.setNotifications("errors", markers.length)
  })

  // Sets up a way to click between examples
  monaco.languages.registerLinkProvider(sandbox.language, new ExampleHighlighter())

  const languageSelector = document.getElementById("language-selector") as HTMLSelectElement
  if (languageSelector) {
    const params = new URLSearchParams(location.search)
    const options = ["ts", "d.ts", "js"]
    languageSelector.options.selectedIndex = options.indexOf(params.get("filetype") || "ts")

    languageSelector.onchange = () => {
      const filetype = options[Number(languageSelector.selectedIndex || 0)]
      const query = sandbox.createURLQueryWithCompilerOptions(sandbox, { filetype })
      const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`
      // @ts-ignore
      document.location = fullURL
    }
  }

  // Ensure that the editor is full-width when the screen resizes
  window.addEventListener("resize", () => {
    sandbox.editor.layout()
  })

  const ui = createUI()
  const exporter = createExporter(sandbox, monaco, ui)

  const playground = {
    exporter,
    ui,
    registerPlugin,
    plugins,
    getCurrentPlugin,
    tabs,
    setDidUpdateTab,
    createUtils,
  }

  window.ts = sandbox.ts
  window.sandbox = sandbox
  window.playground = playground

  console.log(`Using TypeScript ${window.ts.version}`)

  console.log("Available globals:")
  console.log("\twindow.ts", window.ts)
  console.log("\twindow.sandbox", window.sandbox)
  console.log("\twindow.playground", window.playground)
  console.log("\twindow.react", window.react)
  console.log("\twindow.reactDOM", window.reactDOM)

  /** A plugin */
  const activateExternalPlugin = (
    plugin: PlaygroundPlugin | ((utils: PluginUtils) => PlaygroundPlugin),
    autoActivate: boolean
  ) => {
    let readyPlugin: PlaygroundPlugin
    // Can either be a factory, or object
    if (typeof plugin === "function") {
      const utils = createUtils(sandbox, react)
      readyPlugin = plugin(utils)
    } else {
      readyPlugin = plugin
    }

    if (autoActivate) {
      console.log(readyPlugin)
    }

    playground.registerPlugin(readyPlugin)

    // Auto-select the dev plugin
    const pluginWantsFront = readyPlugin.shouldBeSelected && readyPlugin.shouldBeSelected()

    if (pluginWantsFront || autoActivate) {
      // Auto-select the dev plugin
      activatePlugin(readyPlugin, getCurrentPlugin(), sandbox, tabBar, container)
    }
  }

  // Dev mode plugin
  if (config.supportCustomPlugins && allowConnectingToLocalhost()) {
    window.exports = {}
    console.log("Connecting to dev plugin")
    try {
      // @ts-ignore
      const re = window.require
      re(["local/index"], (devPlugin: any) => {
        console.log("Set up dev plugin from localhost:5000")
        try {
          activateExternalPlugin(devPlugin, true)
        } catch (error) {
          console.error(error)
          setTimeout(() => {
            ui.flashInfo("Error: Could not load dev plugin from localhost:5000")
          }, 700)
        }
      })
    } catch (error) {
      console.error("Problem loading up the dev plugin")
      console.error(error)
    }
  }

  const downloadPlugin = (plugin: string, autoEnable: boolean) => {
    try {
      // @ts-ignore
      const re = window.require
      re([`unpkg/${plugin}@latest/dist/index`], (devPlugin: PlaygroundPlugin) => {
        activateExternalPlugin(devPlugin, autoEnable)
      })
    } catch (error) {
      console.error("Problem loading up the plugin:", plugin)
      console.error(error)
    }
  }

  if (config.supportCustomPlugins) {
    // Grab ones from localstorage
    activePlugins().forEach(p => downloadPlugin(p.id, false))

    // Offer to install one if 'install-plugin' is a query param
    const params = new URLSearchParams(location.search)
    const pluginToInstall = params.get("install-plugin")
    if (pluginToInstall) {
      const alreadyInstalled = activePlugins().find(p => p.id === pluginToInstall)
      if (!alreadyInstalled) {
        const shouldDoIt = confirm("Would you like to install the third party plugin?\n\n" + pluginToInstall)
        if (shouldDoIt) {
          addCustomPlugin(pluginToInstall)
          downloadPlugin(pluginToInstall, true)
        }
      }
    }
  }

  if (location.hash.startsWith("#show-examples")) {
    setTimeout(() => {
      document.getElementById("examples-button")?.click()
    }, 100)
  }

  if (location.hash.startsWith("#show-whatisnew")) {
    setTimeout(() => {
      document.getElementById("whatisnew-button")?.click()
    }, 100)
  }

  // Grab the contents of a Gist
  if (location.hash.startsWith("#gist/")) {
    gistPoweredNavBar(sandbox, ui, showNav)
  }

  return playground
}

export type Playground = ReturnType<typeof setupPlayground>

const redirectTabPressTo = (element: HTMLElement, container: HTMLElement | undefined, query: string) => {
  element.addEventListener("keydown", e => {
    if (e.key === "Tab") {
      const host = container || document
      const result = host.querySelector(query) as any
      if (!result) throw new Error(`Expected to find a result for keydown`)
      result.focus()
      e.preventDefault()
    }
  })
}
