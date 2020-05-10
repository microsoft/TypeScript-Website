import { PlaygroundPlugin, PluginFactory } from ".."

export const showASTPlugin: PluginFactory = (i, utils) => {
  let container: HTMLElement

  const plugin: PlaygroundPlugin = {
    id: "ast",
    displayName: "AST",
    willMount: (_, _container) => {
      container = _container
    },
    modelChangedDebounce: (sandbox, model) => {
      const ds = utils.createDesignSystem(container)
      ds.clear()

      ds.title("AST")

      sandbox.getAST().then(tree => {
        console.log(tree)
        ds.createASTTree(tree)
      })
    },
  }

  return plugin
}
