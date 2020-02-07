import { PlaygroundPlugin } from '..'
import { localize } from '../localizeWithFallback'

export const showErrors = () => {
  let decorations: string[] = []
  let decorationLock = false

  const plugin: PlaygroundPlugin = {
    id: 'errors',
    displayName: localize('play_sidebar_errors', 'Errors'),
    willMount: async (sandbox, container) => {
      const noErrorsMessage = document.createElement('div')
      noErrorsMessage.id = 'empty-message-container'
      container.appendChild(noErrorsMessage)

      const errorUL = document.createElement('ul')
      errorUL.id = 'compiler-errors'
      container.appendChild(errorUL)
    },

    modelChangedDebounce: async (sandbox, model) => {
      sandbox.getWorkerProcess().then(worker => {
        worker.getSemanticDiagnostics(model.uri.toString()).then(diags => {
          const errorUL = document.getElementById('compiler-errors')
          const noErrorsMessage = document.getElementById('empty-message-container')
          if (!errorUL || !noErrorsMessage) return

          while (errorUL.firstChild) {
            errorUL.removeChild(errorUL.firstChild)
          }

          // Bail early if there's nothing to show
          if (!diags.length) {
            errorUL.style.display = 'none'
            noErrorsMessage.style.display = 'flex'

            // Already has a message
            if (noErrorsMessage.children.length) return

            const message = document.createElement('div')
            message.textContent = localize('play_sidebar_errors_no_errors', 'No errors')
            message.classList.add('empty-plugin-message')
            noErrorsMessage.appendChild(message)
            return
          }

          noErrorsMessage.style.display = 'none'
          errorUL.style.display = 'block'

          diags.forEach(diag => {
            const li = document.createElement('li')
            li.classList.add('diagnostic')
            switch (diag.category) {
              case 0:
                li.classList.add('warning')
                break
              case 1:
                li.classList.add('error')
                break
              case 2:
                li.classList.add('suggestion')
                break
              case 3:
                li.classList.add('message')
                break
            }

            if (typeof diag === 'string') {
              li.textContent = diag
            } else {
              li.textContent = sandbox.ts.flattenDiagnosticMessageText(diag.messageText, '\n')
            }
            errorUL.appendChild(li)

            li.onmouseenter = () => {
              if (diag.start && diag.length && !decorationLock) {
                const start = model.getPositionAt(diag.start)
                const end = model.getPositionAt(diag.start + diag.length)
                decorations = sandbox.editor.deltaDecorations(decorations, [
                  {
                    range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                    options: { inlineClassName: 'error-highlight' },
                  },
                ])
              }
            }

            li.onmouseleave = () => {
              if (!decorationLock) {
                sandbox.editor.deltaDecorations(decorations, [])
              }
            }

            li.onclick = () => {
              if (diag.start && diag.length) {
                const start = model.getPositionAt(diag.start)
                sandbox.editor.revealLine(start.lineNumber)

                const end = model.getPositionAt(diag.start + diag.length)
                decorations = sandbox.editor.deltaDecorations(decorations, [
                  {
                    range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                    options: { inlineClassName: 'error-highlight', isWholeLine: true },
                  },
                ])

                decorationLock = true
                setTimeout(() => {
                  decorationLock = false
                  sandbox.editor.deltaDecorations(decorations, [])
                }, 300)
              }
            }
          })
        })
      })
    },
  }

  return plugin
}
