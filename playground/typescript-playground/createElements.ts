import { PlaygroundPlugin } from ".";

type Sandbox = ReturnType<typeof import("../typescript-sandbox/startPlayground").createTypeScriptSandbox>

export const createSidebar = () => {
  const sidebar = document.createElement("div")
  sidebar.className = "playground-sidebar"
  return sidebar
}

export const createTabView = () => {

}

export const createTabForPlugin = (sandbox: Sandbox,  plugin: PlaygroundPlugin, container: HTMLDivElement) => {
  const element = document.createElement("button")
  element.textContent = plugin.displayName
  
  const activate = () => {
    element.classList.add("active")
    if (plugin.willMount) plugin.willMount(sandbox, container)
    plugin.modelChanged(sandbox, sandbox.editor.getModel())
    if (plugin.didMount) plugin.didMount(sandbox, container)
  }

  element.onclick = activate
  return element
}
