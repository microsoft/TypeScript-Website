import { PlaygroundPlugin } from '..'

/** Whether the playground should actively reach out to an existing plugin */
export const allowConnectingToLocalhost = () => {
  return !!localStorage.getItem('compiler-setting-connect-dev-plugin')
}

const settings = [
  {
    display: 'Disable ATA',
    blurb: 'Disable the automatic acquisition of types for imports and requires',
    flag: 'disable-ata',
  },
  {
    display: 'Disable Save-On-Type',
    blurb: 'Disable changing the URL when you type',
    flag: 'disable-save-on-type',
  },
  // {
  //   display: 'Verbose Logging',
  //   blurb: 'Turn on superfluous logging',
  //   flag: 'enable-superfluous-logging',
  // },
]

const pluginRegistry = [
  {
    module: 'typescript-playground-presentation-mode',
    display: 'Presentation Mode',
    blurb: 'Create presentations inside the TypeScript playground, seamlessly jump between slides and live-code.',
    homepage: 'https://github.com/orta/playground-slides/',
    author: {
      name: 'Orta',
      twitter: '@orta',
    },
  },
]

export const optionsPlugin = () => {
  const plugin: PlaygroundPlugin = {
    id: 'options',
    displayName: 'Options',
    shouldBeSelected: () => true,
    willMount: (_sandbox, container) => {
      const categoryDiv = document.createElement('div')
      const ol = document.createElement('ol')
      ol.className = 'playground-options'

      const optionsTitle = document.createElement('h4')
      optionsTitle.textContent = 'Options'
      container.appendChild(optionsTitle)

      settings.forEach(setting => {
        const settingButton = createButton(setting)
        ol.appendChild(settingButton)
      })

      categoryDiv.appendChild(ol)
      container.appendChild(categoryDiv)

      const pluginsTitle = document.createElement('h4')
      pluginsTitle.textContent = 'Plugins'
      container.appendChild(pluginsTitle)

      const pluginsOL = document.createElement('ol')
      pluginsOL.className = 'playground-options'
      pluginRegistry.forEach(plugin => {
        const settingButton = createPlugin(plugin)
        ol.appendChild(settingButton)
      })

      const pluginDevTitle = document.createElement('h4')
      pluginDevTitle.textContent = 'Plugin Dev'
      container.appendChild(pluginDevTitle)

      const pluginsDevOL = document.createElement('ol')
      pluginsOL.className = 'playground-options'
      const connectToDev = createButton({
        display: 'Connect to <code>localhost:5000/index.js</code>',
        blurb:
          "Automatically try connect to a playground plugin in development mode. You can read more <a href='http://TBD'>here</a>.",
        flag: 'connect-dev-plugin',
      })

      ol.appendChild(connectToDev)
      container.appendChild(pluginsOL)
    },
  }

  return plugin
}

const createPlugin = (setting: typeof pluginRegistry[0]) => {
  const li = document.createElement('li')
  const label = document.createElement('label')
  label.innerHTML = `<span>${setting.display}</span><br/>${setting.blurb}`

  const key = 'plugin-' + setting.module
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.id = key
  input.checked = !!localStorage.getItem(key)

  input.onchange = () => {
    if (input.checked) {
      localStorage.setItem(key, 'true')
    } else {
      localStorage.removeItem(key)
    }
  }

  label.htmlFor = input.id

  li.appendChild(input)
  li.appendChild(label)
  return li
}

const createButton = (setting: { blurb: string; flag: string; display: string }) => {
  const li = document.createElement('li')
  const label = document.createElement('label')
  label.innerHTML = `<span>${setting.display}</span><br/>${setting.blurb}`

  const key = 'compiler-setting-' + setting.flag
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.id = key
  input.checked = !!localStorage.getItem(key)

  input.onchange = () => {
    if (input.checked) {
      localStorage.setItem(key, 'true')
    } else {
      localStorage.removeItem(key)
    }
  }

  label.htmlFor = input.id

  li.appendChild(input)
  li.appendChild(label)
  return li
}
