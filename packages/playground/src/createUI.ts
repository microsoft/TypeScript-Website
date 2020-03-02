export interface UI {
  /** Show a text modal, with some buttons */
  showModal: (message: string, subtitle?: string, buttons?: { [text: string]: string }) => void
  /** A quick flash of some text */
  flashInfo: (message: string) => void
  /** Creates a modal container which you can put your own DOM elements inside */
  createModalOverlay: (classes?: string) => HTMLDivElement
}

export const createUI = (): UI => {
  const flashInfo = (message: string) => {
    let flashBG = document.getElementById('flash-bg')
    if (flashBG) {
      flashBG.parentElement?.removeChild(flashBG)
    }

    flashBG = document.createElement('div')
    flashBG.id = 'flash-bg'

    const p = document.createElement('p')
    p.textContent = message
    flashBG.appendChild(p)
    document.body.appendChild(flashBG)

    setTimeout(() => {
      flashBG?.parentElement?.removeChild(flashBG)
    }, 1000)
  }

  const createModalOverlay = (classList?: string) => {
    document.querySelectorAll('.navbar-sub li.open').forEach(i => i.classList.remove('open'))

    const existingPopover = document.getElementById('popover-modal')
    if (existingPopover) existingPopover.parentElement!.removeChild(existingPopover)

    const modalBG = document.createElement('div')
    modalBG.id = 'popover-background'
    document.body.appendChild(modalBG)

    const modal = document.createElement('div')
    modal.id = 'popover-modal'
    if (classList) modal.className = classList

    const closeButton = document.createElement('button')
    closeButton.innerText = 'Close'
    closeButton.classList.add('close')
    modal.appendChild(closeButton)

    const oldOnkeyDown = document.onkeydown

    const close = () => {
      modalBG.parentNode!.removeChild(modalBG)
      modal.parentNode!.removeChild(modal)
      // @ts-ignore
      document.onkeydown = oldOnkeyDown
    }

    modalBG.onclick = close
    closeButton.onclick = close

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

    document.body.appendChild(modal)

    return modal
  }

  /** For showing a lot of code */
  const showModal = (code: string, subtitle?: string, links?: { [text: string]: string }) => {
    const modal = createModalOverlay()

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

    modal.appendChild(buttonContainer)

    if (links) {
      Object.keys(links).forEach(name => {
        const href = links[name]
        const extraButton = document.createElement('button')
        extraButton.innerText = name
        extraButton.onclick = () => (document.location = href as any)
        buttonContainer.appendChild(extraButton)
      })
    }

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

    selectAllButton.onclick = selectAll
    copyButton.onclick = () => {
      navigator.clipboard.writeText(code)
    }
  }

  return {
    createModalOverlay,
    showModal,
    flashInfo,
  }
}
