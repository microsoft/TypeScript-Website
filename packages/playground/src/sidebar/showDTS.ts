import { PlaygroundPlugin } from '..'

export const showDTSPlugin = () => {
  let codeElement: HTMLElement

  const plugin: PlaygroundPlugin = {
    displayName: 'DTS',
    willMount: (sandbox, container) => {
      // TODO: Monaco?
      const createCodePre = document.createElement('pre')
      codeElement = document.createElement('code')

      createCodePre.appendChild(codeElement)
      container.appendChild(createCodePre)
    },
    modelChanged: async (sandbox, model) => {
      codeElement.textContent = await sandbox.getDTSForCode()
    },
  }

  return plugin
}
