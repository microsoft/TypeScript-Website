export interface UI {
  showModal: (message: string, subtitle?: string, buttons?: any) => void
}

export const createUI = (): UI => {
  return {
    showModal: (code: string, subtitle?: string, links?: any) => {
      document.querySelectorAll('.navbar-sub li.open').forEach(i => i.classList.remove('open'))

      const existingPopover = document.getElementById('popover-modal')
      if (existingPopover) existingPopover.parentElement!.removeChild(existingPopover)

      const modalBG = document.createElement('div')
      modalBG.id = 'popover-background'
      document.body.appendChild(modalBG)

      const modal = document.createElement('div')
      modal.id = 'popover-modal'

      if (subtitle) {
        const titleElement = document.createElement('p')
        titleElement.textContent = subtitle
        modal.appendChild(titleElement)
      }

      const pre = document.createElement('pre')
      modal.appendChild(pre)
      pre.textContent = code

      const buttonContainer = document.createElement('div')

      const copyButton = document.createElement('button')
      copyButton.innerText = 'Copy'
      buttonContainer.appendChild(copyButton)

      const selectAllButton = document.createElement('button')
      selectAllButton.innerText = 'Select All'
      buttonContainer.appendChild(selectAllButton)

      const closeButton = document.createElement('button')
      closeButton.innerText = 'Close'
      closeButton.classList.add('close')
      modal.appendChild(closeButton)

      modal.appendChild(buttonContainer)

      if (links) {
        Object.keys(links).forEach(name => {
          const href = links[name]
          const extraButton = document.createElement('button')
          extraButton.innerText = name
          extraButton.onclick = () => (document.location = href)
          buttonContainer.appendChild(extraButton)
        })
      }

      document.body.appendChild(modal)

      const selectAll = () => {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(pre)
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
      selectAll()

      // Keep track
      const oldOnkeyDown = document.onkeydown

      const close = () => {
        modalBG.parentNode!.removeChild(modalBG)
        modal.parentNode!.removeChild(modal)
        // @ts-ignore
        document.onkeydown = oldOnkeyDown
      }

      const copy = () => {
        navigator.clipboard.writeText(code)
      }

      modalBG.onclick = close
      closeButton.onclick = close
      copyButton.onclick = copy
      selectAllButton.onclick = selectAll

      // Support hiding the modal via escape
      document.onkeydown = function(evt) {
        evt = evt || window.event
        var isEscape = false
        if ('key' in evt) {
          isEscape = evt.key === 'Escape' || evt.key === 'Esc'
        } else {
          // @ts-ignore - this used to be the case
          isEscape = evt.keyCode === 27
        }
        if (isEscape) {
          close()
        }
      }
    },
  }
}
