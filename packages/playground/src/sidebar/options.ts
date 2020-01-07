import { PlaygroundPlugin } from '..'

export const optionsPlugin = () => {
  const plugin: PlaygroundPlugin = {
    id: 'config',
    displayName: 'Config',
    willMount: (sandbox, container) => {},
  }

  return plugin
}
