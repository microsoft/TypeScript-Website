import { PlaygroundPlugin } from '.'

type Sandbox = ReturnType<typeof import('typescript-sandbox').createTypeScriptSandbox>

export const createSidebar = () => {
  const sidebar = document.createElement('div')
  sidebar.className = 'playground-sidebar'
  return sidebar
}

export const createTabBar = () => {
  const tabBar = document.createElement('div')
  tabBar.classList.add('playground-plugin-tabview')
  return tabBar
}

export const createPluginContainer = () => {
  const container = document.createElement('div')
  container.classList.add('playground-plugin-container')
  return container
}

export const createTabForPlugin = (plugin: PlaygroundPlugin) => {
  const element = document.createElement('button')
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
    if (tab.textContent === plugin.displayName) newPluginTab = tab
    if (previousPlugin && tab.textContent === previousPlugin.displayName) oldPluginTab = tab
  }

  // @ts-ignore
  if (!newPluginTab) throw new Error('Could not get a tab for the plugin: ' + plugin.displayName)

  // Tell the old plugin it's getting the boot
  // @ts-ignore
  if (previousPlugin && oldPluginTab) {
    if (previousPlugin.willUnmount) previousPlugin.willUnmount(sandbox, container)
    oldPluginTab.classList.remove('active')
  }

  // Wipe the sidebar
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  // Start booting up the new plugin
  newPluginTab.classList.add('active')

  // Tell the new plugin to start doing some work
  if (plugin.willMount) plugin.willMount(sandbox, container)
  plugin.modelChanged(sandbox, sandbox.editor.getModel()!)
  if (plugin.didMount) plugin.didMount(sandbox, container)

  // Let the previous plugin do any slow work after it's all done
  if (previousPlugin && previousPlugin.didUnmount) previousPlugin.didUnmount(sandbox, container)
}
