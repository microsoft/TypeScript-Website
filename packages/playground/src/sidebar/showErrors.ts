import { PlaygroundPlugin } from '..'

export const showErrors = () => {
  const plugin: PlaygroundPlugin = {
    id: 'errors',
    displayName: 'Errors',
    willMount: async (sandbox, container) => {
      const errorUL = document.createElement('ul')
      errorUL.id = 'compiler-errors'
      container.appendChild(errorUL)
    },
    modelChangedDebounce: async (sandbox, model) => {
      sandbox.getWorkerProcess().then(worker => {
        worker.getSemanticDiagnostics(model.uri.toString()).then(diags => {
          const errorUL = document.getElementById('compiler-errors')
          if (!errorUL) return

          while (errorUL.firstChild) {
            errorUL.removeChild(errorUL.firstChild)
          }

          diags.forEach(diag => {
            const li = document.createElement('li')

            if (typeof diag === 'string') {
              li.textContent = diag
            } else {
              li.textContent = sandbox.ts.flattenDiagnosticMessageText(diag.messageText, '\n')
            }
            errorUL.appendChild(li)
          })
        })
      })
    },
  }

  return plugin
}
