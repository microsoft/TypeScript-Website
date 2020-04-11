import { PlaygroundPlugin, PluginFactory } from ".."

export const compiledJSPlugin: PluginFactory = (i, utils) => {
  let codeElement: HTMLElement

  const plugin: PlaygroundPlugin = {
    id: "js",
    displayName: i("play_sidebar_js"),
    willMount: (_, container) => {
      const { code } = utils.createDesignSystem(container)
      codeElement = code("")
    },
    modelChangedDebounce: (sandbox, model) => {
      sandbox.getRunnableJS().then(js => {
        sandbox.monaco.editor.colorize(js, "javascript", {}).then(coloredJS => {
          codeElement.innerHTML = coloredJS
        })
      })
    },
  }

  return plugin
}
