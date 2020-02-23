import { PlaygroundPlugin } from '.'

type Sandbox = import('typescript-sandbox').Sandbox

export const createDragBar = () => {
  const sidebar = document.createElement('div')
  sidebar.className = 'playground-dragbar'

  let left: HTMLElement, right: HTMLElement
  const drag = (e: MouseEvent) => {
    if (left && right) {
      // Get how far right the mouse is from the right
      const rightX = right.getBoundingClientRect().right
      const offset = rightX - e.pageX
      const screenClampLeft = window.innerWidth - 320
      const clampedOffset = Math.min(Math.max(offset, 280), screenClampLeft)

      // Set the widths
      left.style.width = `calc(100% - ${clampedOffset}px)`
      right.style.width = `${clampedOffset}px`
      right.style.flexBasis = `${clampedOffset}px`
      right.style.maxWidth = `${clampedOffset}px`

      // Save the x coordinate of the
      if (window.localStorage) {
        window.localStorage.setItem('dragbar-x', '' + clampedOffset)
        window.localStorage.setItem('dragbar-window-width', '' + window.innerWidth)
      }

      // Don't allow selection
      e.stopPropagation()
      e.cancelBubble = true
    }
  }

  sidebar.addEventListener('mousedown', e => {
    left = document.getElementById('editor-container')!
    right = sidebar.parentElement?.getElementsByClassName('playground-sidebar').item(0)! as any
    // Handle dragging all over the screen
    document.addEventListener('mousemove', drag)
    // Remove it when you lt go anywhere
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', drag)
      document.body.style.userSelect = 'auto'
    })

    // Don't allow the drag to select text accidentally
    document.body.style.userSelect = 'none'
    e.stopPropagation()
    e.cancelBubble = true
  })

  return sidebar
}

export const sidebarHidden = () => !!window.localStorage.getItem('sidebar-hidden')

export const createSidebar = () => {
  const sidebar = document.createElement('div')
  sidebar.className = 'playground-sidebar'

  // This is independent of the sizing below so that you keep the same sized sidebar
  if (sidebarHidden()) {
    sidebar.style.display = 'none'
  }

  if (window.localStorage && window.localStorage.getItem('dragbar-x')) {
    // Don't restore the x pos if the window isn't the same size
    if (window.innerWidth === Number(window.localStorage.getItem('dragbar-window-width'))) {
      // Set the dragger to the previous x pos
      const width = window.localStorage.getItem('dragbar-x')
      sidebar.style.width = `${width}px`
      sidebar.style.flexBasis = `${width}px`
      sidebar.style.maxWidth = `${width}px`

      const left = document.getElementById('editor-container')!
      left.style.width = `calc(100% - ${width}px)`
    }
  }

  return sidebar
}

export const createTabBar = () => {
  const tabBar = document.createElement('div')
  tabBar.classList.add('playground-plugin-tabview')
  return tabBar
}

export const createPluginContainer = () => {
  const container = document.createElement('div')
  container.classList.add('playground-plugin-container')
  return container
}

export const createTabForPlugin = (plugin: PlaygroundPlugin) => {
  const element = document.createElement('button')
  element.textContent = plugin.displayName
  return element
}

export const activatePlugin = (
  plugin: PlaygroundPlugin,
  previousPlugin: PlaygroundPlugin | undefined,
  sandbox: Sandbox,
  tabBar: HTMLDivElement,
  container: HTMLDivElement
) => {
  let newPluginTab: Element, oldPluginTab: Element
  // @ts-ignore - This works at runtime
  for (const tab of tabBar.children) {
    if (tab.textContent === plugin.displayName) newPluginTab = tab
    if (previousPlugin && tab.textContent === previousPlugin.displayName) oldPluginTab = tab
  }

  // @ts-ignore
  if (!newPluginTab) throw new Error('Could not get a tab for the plugin: ' + plugin.displayName)

  // Tell the old plugin it's getting the boot
  // @ts-ignore
  if (previousPlugin && oldPluginTab) {
    if (previousPlugin.willUnmount) previousPlugin.willUnmount(sandbox, container)
    oldPluginTab.classList.remove('active')
  }

  // Wipe the sidebar
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  // Start booting up the new plugin
  newPluginTab.classList.add('active')

  // Tell the new plugin to start doing some work
  if (plugin.willMount) plugin.willMount(sandbox, container)
  if (plugin.modelChanged) plugin.modelChanged(sandbox, sandbox.getModel())
  if (plugin.modelChangedDebounce) plugin.modelChangedDebounce(sandbox, sandbox.getModel())
  if (plugin.didMount) plugin.didMount(sandbox, container)

  // Let the previous plugin do any slow work after it's all done
  if (previousPlugin && previousPlugin.didUnmount) previousPlugin.didUnmount(sandbox, container)
}

const toggleIconWhenOpen = '&#x21E5;'
const toggleIconWhenClosed = '&#x21E4;'

export const setupSidebarToggle = () => {
  const toggle = document.getElementById('sidebar-toggle')!

  const updateToggle = () => {
    const sidebarShowing = !sidebarHidden()
    toggle.innerHTML = sidebarShowing ? toggleIconWhenOpen : toggleIconWhenClosed
    toggle.setAttribute('aria-label', sidebarShowing ? 'Hide Sidebar' : 'Show Sidebar')
  }

  toggle.onclick = () => {
    const newState = !sidebarHidden()

    const sidebar = window.document.querySelector('.playground-sidebar') as HTMLDivElement
    if (newState) {
      localStorage.setItem('sidebar-hidden', 'true')
      sidebar.style.display = 'none'
    } else {
      localStorage.removeItem('sidebar-hidden')
      sidebar.style.display = 'block'
    }
    updateToggle()
    return false
  }
}
