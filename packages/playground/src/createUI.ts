export interface UI {
  /** Show a text modal, with some buttons */
  showModal: (
    message: string,
    postFocalElement: HTMLElement,
    subtitle?: string,
    buttons?: { [text: string]: string },
    event?: React.MouseEvent
  ) => void
  /** A quick flash of some text */
  flashInfo: (message: string, time?: number) => void
  /** Creates a modal container which you can put your own DOM elements inside */
  createModalOverlay: (postFocalElement: HTMLElement, classes?: string) => HTMLDivElement
}

export const createUI = (): UI => {
  const flashInfo = (message: string, timeout = 1000) => {
    let flashBG = document.getElementById("flash-bg")
    if (flashBG) {
      flashBG.parentElement?.removeChild(flashBG)
    }

    flashBG = document.createElement("div")
    flashBG.id = "flash-bg"

    const p = document.createElement("p")
    p.textContent = message
    flashBG.appendChild(p)
    document.body.appendChild(flashBG)

    setTimeout(() => {
      flashBG?.parentElement?.removeChild(flashBG)
    }, timeout)
  }

  const createModalOverlay = (postFocalElement: HTMLElement, classList?: string) => {
    document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"))

    const existingPopover = document.getElementById("popover-modal")
    if (existingPopover) existingPopover.parentElement!.removeChild(existingPopover)

    const modalBG = document.createElement("div")
    modalBG.id = "popover-background"
    document.body.appendChild(modalBG)

    const modal = document.createElement("div")
    modal.id = "popover-modal"
    if (classList) modal.className = classList

    const closeButton = document.createElement("button")
    closeButton.innerText = "Close"
    closeButton.classList.add("close")
    closeButton.tabIndex = 1
    modal.appendChild(closeButton)

    const oldOnkeyDown = document.onkeydown

    const close = () => {
      modalBG.parentNode!.removeChild(modalBG)
      modal.parentNode!.removeChild(modal)
      // @ts-ignore
      document.onkeydown = oldOnkeyDown
      postFocalElement.focus()
    }

    modalBG.onclick = close
    closeButton.onclick = close

    // Support hiding the modal via escape
    document.onkeydown = whenEscape(close)

    document.body.appendChild(modal)

    return modal
  }

  /** For showing a lot of code */
  const showModal = (
    code: string,
    postFocalElement: HTMLElement,
    subtitle?: string,
    links?: { [text: string]: string },
    event?: React.MouseEvent
  ) => {
    const modal = createModalOverlay(postFocalElement)
    // I've not been able to get this to work in a way which
    // works with every screenreader and browser combination, so
    // instead I'm dropping the feature.

    const isNotMouse = false //  event && event.screenX === 0 && event.screenY === 0

    if (subtitle) {
      const titleElement = document.createElement("h3")
      titleElement.textContent = subtitle
      setTimeout(() => {
        titleElement.setAttribute("role", "alert")
      }, 100)
      modal.appendChild(titleElement)
    }

    const textarea = document.createElement("textarea")
    textarea.readOnly = true
    textarea.wrap = "off"
    textarea.style.marginBottom = "20px"
    modal.appendChild(textarea)
    textarea.textContent = code
    textarea.rows = 60

    const buttonContainer = document.createElement("div")

    const copyButton = document.createElement("button")
    copyButton.innerText = "Copy"
    buttonContainer.appendChild(copyButton)

    const selectAllButton = document.createElement("button")
    selectAllButton.innerText = "Select All"
    buttonContainer.appendChild(selectAllButton)

    modal.appendChild(buttonContainer)
    const close = modal.querySelector(".close") as HTMLElement
    close.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        ; (modal.querySelector("textarea") as any).focus()
        e.preventDefault()
      }
    })

    if (links) {
      Object.keys(links).forEach(name => {
        const href = links[name]
        const extraButton = document.createElement("button")
        extraButton.innerText = name
        extraButton.onclick = () => (document.location = href as any)
        buttonContainer.appendChild(extraButton)
      })
    }

    const selectAll = () => {
      textarea.select()
    }

    const shouldAutoSelect = !isNotMouse
    if (shouldAutoSelect) {
      selectAll()
    } else {
      textarea.focus()
    }

    const buttons = modal.querySelectorAll("button")
    const lastButton = buttons.item(buttons.length - 1) as HTMLElement
    lastButton.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        ; (document.querySelector(".close") as any).focus()
        e.preventDefault()
      }
    })

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

/**
 * Runs the closure when escape is tapped
 * @param func closure to run on escape being pressed
 */
const whenEscape = (func: () => void) => (event: KeyboardEvent) => {
  const evt = event || window.event
  let isEscape = false
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc"
  } else {
    // @ts-ignore - this used to be the case
    isEscape = evt.keyCode === 27
  }
  if (isEscape) {
    func()
  }
}
