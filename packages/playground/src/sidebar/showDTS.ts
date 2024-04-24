import { PlaygroundPlugin, PluginFactory } from ".."

export const showDTSPlugin: PluginFactory = (i, utils) => {
  let codeElement: HTMLElement

  const plugin: PlaygroundPlugin = {
    id: "dts",
    displayName: i("play_sidebar_dts"),
    willMount: (_, container) => {
      const { code } = utils.createDesignSystem(container)
      codeElement = code("")
    },
    modelChanged: (sandbox, model) => {
      sandbox.getDTSForCode().then(dts => {
        sandbox.monaco.editor.colorize(dts, "typescript", {}).then(coloredDTS => {
          codeElement.innerHTML = coloredDTS
        })
      })
    },
  }

  return plugin
}
