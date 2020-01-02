type Sandbox = ReturnType<typeof import('typescript-sandbox').createTypeScriptSandbox>
type Monaco = typeof import('monaco-editor')

declare const window: any

import { compiledJSPlugin } from './sidebar/showJS'
import {
  createSidebar,
  createTabForPlugin,
  createTabBar,
  createPluginContainer,
  activatePlugin,
  createDragBar,
} from './createElements'
import { showDTSPlugin } from './sidebar/showDTS'
import { createExporter } from './exporter'
import { createUI } from './createUI'

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
  modelChanged?: (sandbox: Sandbox, model: import('monaco-editor').editor.ITextModel) => void
  /** Delayed model changes while this plugin is front-most, useful when you are working with the TS API because it won't run on every keypress */
  modelChangedDebounce?: (sandbox: Sandbox, model: import('monaco-editor').editor.ITextModel) => void
  /** Before we remove the tab */
  willUnmount?: (sandbox: Sandbox, container: HTMLDivElement) => void
  /** Before we remove the tab */
  didUnmount?: (sandbox: Sandbox, container: HTMLDivElement) => void
}

const defaultPluginFactories: (() => PlaygroundPlugin)[] = [compiledJSPlugin, showDTSPlugin]

export const setupPlayground = (sandbox: Sandbox, monaco: Monaco) => {
  const playgroundParent = sandbox.getDomNode().parentElement!.parentElement!.parentElement!
  const dragBar = createDragBar()
  playgroundParent.appendChild(dragBar)

  const sidebar = createSidebar()
  playgroundParent.appendChild(sidebar)

  const tabBar = createTabBar()
  sidebar.appendChild(tabBar)

  const container = createPluginContainer()
  sidebar.appendChild(container)

  const plugins = defaultPluginFactories.map(f => f())
  const tabs = plugins.map(p => createTabForPlugin(p))

  const currentPlugin = () => {
    const selectedTab = tabs.find(t => t.classList.contains('active'))!
    return plugins[tabs.indexOf(selectedTab)]
  }

  const tabClicked: HTMLElement['onclick'] = e => {
    const previousPlugin = currentPlugin()
    const newTab = e.target as HTMLElement
    const newPlugin = plugins.find(p => p.displayName == newTab.textContent)!
    activatePlugin(newPlugin, previousPlugin, sandbox, tabBar, container)
  }

  tabs.forEach(t => {
    tabBar.appendChild(t)
    t.onclick = tabClicked
  })

  // Choose which should be selected
  const priorityPlugin = plugins.find(plugin => plugin.shouldBeSelected && plugin.shouldBeSelected())
  const selectedPlugin = priorityPlugin || plugins[0]
  const selectedTab = tabs[plugins.indexOf(selectedPlugin)]!
  selectedTab.onclick!({ target: selectedTab } as any)

  let debouncingTimer = false
  sandbox.editor.onDidChangeModelContent(_event => {
    const plugin = currentPlugin()
    if (plugin.modelChanged) plugin.modelChanged(sandbox, sandbox.getModel())

    // Only call this fuhnction once every 0.3s
    if (plugin.modelChangedDebounce) {
      if (debouncingTimer) return
      debouncingTimer = true
      setTimeout(() => {
        debouncingTimer = false
        if (plugin.modelChangedDebounce && plugin.displayName === currentPlugin().displayName) {
          plugin.modelChangedDebounce(sandbox, sandbox.getModel())
        }
      }, 300)
    }
  })

  // Setup working with the existing UI, once it's loaded

  // Versions of TypeScript

  // Set up the label for the dropdown
  document.querySelectorAll('#versions > a').item(0).innerHTML = 'v' + sandbox.ts.version + " <span class='caret'/>"
  // Add the versions to the dropdown
  const versionsMenu = document.querySelectorAll('#versions > ul').item(0)
  sandbox.supportedVersions.forEach((v: string) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.textContent = v
    a.href = document.location.host + document.location.pathname + `?ts=${v}`
    // TODO: Why does this not work?
    a.onclick = () => {
      const params = new URLSearchParams(location.search)
      params.set('ts', v)
      const newURL = `${document.location.host}${document.location.pathname}?${params}#${document.location.hash}`
      document.location.href = newURL
    }

    li.appendChild(a)
    versionsMenu.appendChild(li)
  })

  // Support dropdowns on the
  document.querySelectorAll('.navbar-sub li.dropdown > a').forEach(link => {
    const li = link as HTMLLIElement
    li.onclick = _e => {
      document.querySelectorAll('.navbar-sub li.open').forEach(i => i.classList.remove('open'))
      li.parentElement!.classList.toggle('open')
    }
  })

  // Support grabbing examples
  if (location.hash.startsWith('#example')) {
    const exampleName = location.hash.replace('#example/', '').trim()
    console.log('Loading example:', exampleName)

    // return decodeURIComponent(code)
  }

  const ui = createUI()
  const exporter = createExporter(sandbox, monaco, ui)

  const playground = {
    exporter,
    ui,
  }

  window.ts = sandbox.ts
  window.sandbox = sandbox
  window.playground = playground

  console.log(`Using TypeScript ${window.ts.version}`)

  console.log('Available globals:')
  console.log('\twindow.ts', window.ts)
  console.log('\twindow.sandbox', window.sandbox)
  console.log('\twindow.playground', window.playground)

  return playground
}

export type Playground = ReturnType<typeof setupPlayground>
