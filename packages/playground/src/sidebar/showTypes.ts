import { PlaygroundPlugin } from '..'

export const compiledJSPlugin = () => {
  let codeElement: HTMLElement

  const plugin: PlaygroundPlugin = {
    id: 'types',
    displayName: 'Types',
    willMount: async (sandbox, container) => {
      const createCodePre = document.createElement('pre')
      codeElement = document.createElement('code')

      createCodePre.appendChild(codeElement)
      container.appendChild(createCodePre)
    },

    modelChangedDebounce: async (sandbox, model) => {
      const program = sandbox.createTSProgram()
      const checker = program.getTypeChecker()
      // const smychecker.getSymbolAtLocation
      const sourceFile = program.getSourceFile(model.uri.path)!
      const ts = sandbox.ts
      sandbox.ts.forEachChild(sourceFile, node => {
        if (ts.isInterfaceDeclaration(node)) {
          const symbol = checker.getSymbolAtLocation(node)
          if (symbol) {
            console.log(symbol, symbol.members)
          } else {
            console.log('could not get symbol for interface')
          }
        }
      })
    },
  }

  return plugin
}
