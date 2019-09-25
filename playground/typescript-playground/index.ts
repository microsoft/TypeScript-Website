type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
type MonacoEditor = import("monaco-editor").editor.ICodeEditor
type Monaco = typeof import("monaco-editor")
type Sandbox = ReturnType<typeof import("../typescript-sandbox/startPlayground").createTypeScriptSandbox>

import "../typescript-sandbox/index"
import { compiledJSPlugin } from "./sidebar/compiledJS"
import { createSidebar, createTabForPlugin } from "./createElements"
import { showDTSPlugin } from "./sidebar/dts"

/** The interface of all sidebar plugins */
export interface PlaygroundPlugin {
  /** To show in the tabs */
  displayName: string
  /** Should this plugin be selected on launch? */
  shouldBeSelected?: () => boolean
  /** Before we show the tab, use this to set up your HTML - it will all be removed whe*/
  willMount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** After we show the tab */
  didMount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** Model changes while this plugin is front-most  */
  modelChanged: (sandbox: Sandbox, model: import("monaco-editor").editor.ITextModel) => void
  /** Before we remove the tab */
  willUnmount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** Before we remove the tab */
  didUnmount?: (sandbox: Sandbox, container: HTMLDivElement) => void
}

const defaultPluginFactories: (() => PlaygroundPlugin)[] = [
  compiledJSPlugin,
  showDTSPlugin
]

const setupPlayground = (sandbox: Sandbox) => {
  const playgroundParent = sandbox.editor.getDomNode().parentElement.parentElement
  const sidebar = createSidebar()
  playgroundParent.appendChild(sidebar)

  const tabBar = document.createElement("div")
  tabBar.classList.add("tabview")
  sidebar.appendChild(tabBar)

  const container = document.createElement("div")
  container.classList.add("container")
  sidebar.appendChild(container)
  
  const plugins = defaultPluginFactories.map(f => f())

  const tabs = plugins.map(p => createTabForPlugin(sandbox, p, container))
  tabs.forEach(t => tabBar.appendChild(t))

  // Choose which should be selected
  const priorityPlugin = plugins.find(plugin => plugin.shouldBeSelected && plugin.shouldBeSelected())
  const selectedPlugin = priorityPlugin || plugins[0]
  tabs[plugins.indexOf(selectedPlugin)].onclick({} as any)

  const currentPlugin = () => {
    const selectedTab = tabs.find(t => t.classList.contains("active"))
    return plugins[tabs.indexOf(selectedTab)]
  }

  sandbox.editor.onDidChangeModelContent(_event => {
    const plugin = currentPlugin()
    plugin.modelChanged(sandbox, sandbox.editor.getModel())
  })
}

(window as any).playground = {
  setup: setupPlayground,
}
