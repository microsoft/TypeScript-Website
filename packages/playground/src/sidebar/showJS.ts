import { PlaygroundPlugin, PluginFactory } from '..'

export const compiledJSPlugin: PluginFactory = i => {
  let codeElement: HTMLElement

  const plugin: PlaygroundPlugin = {
    id: 'js',
    displayName: i('play_sidebar_js'),
    willMount: (sandbox, container) => {
      const createCodePre = document.createElement('pre')
      codeElement = document.createElement('code')

      createCodePre.appendChild(codeElement)
      container.appendChild(createCodePre)
    },
    modelChangedDebounce: (sandbox, model) => {
      sandbox.getRunnableJS().then(js => {
        sandbox.monaco.editor.colorize(js, 'javascript', {}).then(coloredJS => {
          codeElement.innerHTML = coloredJS
        })
      })
    },
  }

  return plugin
}
