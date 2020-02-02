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
    repo: 'https://github.com/orta/playground-slides/#README',
    author: {
      name: 'Orta',
      href: 'https://orta.io',
    },
  },
]

export const activePlugins = () => {
  return pluginRegistry.filter(p => !!localStorage.getItem('plugin-' + p.module))
}

export const optionsPlugin = () => {
  const plugin: PlaygroundPlugin = {
    id: 'options',
    displayName: 'Options',
    shouldBeSelected: () => true,
    willMount: (_sandbox, container) => {
      const categoryDiv = document.createElement('div')
      container.appendChild(categoryDiv)

      const ol = document.createElement('ol')
      ol.className = 'playground-options'

      createSection('Options', categoryDiv)

      settings.forEach(setting => {
        const settingButton = createButton(setting)
        ol.appendChild(settingButton)
      })

      categoryDiv.appendChild(ol)

      createSection('External Plugins', categoryDiv)

      const warning = document.createElement('p')
      warning.className = 'warning'
      warning.textContent = 'Warning: Code from plugins comes from third-parties.'
      categoryDiv.appendChild(warning)

      const pluginsOL = document.createElement('ol')
      pluginsOL.className = 'playground-options'
      pluginRegistry.forEach(plugin => {
        const settingButton = createPlugin(plugin)
        pluginsOL.appendChild(settingButton)
      })
      categoryDiv.appendChild(pluginsOL)

      createSection('Plugin Dev', categoryDiv)

      const pluginsDevOL = document.createElement('ol')
      pluginsDevOL.className = 'playground-options'
      const connectToDev = createButton({
        display: 'Connect to <code>localhost:5000/index.js</code>',
        blurb:
          "Automatically try connect to a playground plugin in development mode. You can read more <a href='http://TBD'>here</a>.",
        flag: 'connect-dev-plugin',
      })

      pluginsDevOL.appendChild(connectToDev)
      categoryDiv.appendChild(pluginsDevOL)
    },
  }

  return plugin
}

const createSection = (title: string, container: Element) => {
  const pluginDevTitle = document.createElement('h4')
  pluginDevTitle.textContent = title
  container.appendChild(pluginDevTitle)
}

const createPlugin = (plugin: typeof pluginRegistry[0]) => {
  const li = document.createElement('li')
  const label = document.createElement('label')
  label.innerHTML = `<span>${plugin.display}</span> by <a href='${plugin.author.href}'>${plugin.author.name}</a><br/>${plugin.blurb}`

  const key = 'plugin-' + plugin.module
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

  const info = document.createElement('p')
  info.innerHTML = `<a href='https://www.npmjs.com/package${plugin.module}'>npm</a> | <a href="${plugin.repo}">repo</a>`

  li.appendChild(input)
  li.appendChild(label)
  li.appendChild(info)
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
