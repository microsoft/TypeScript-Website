import { PlaygroundPlugin } from '..'
import { localize } from '../localizeWithFallback'

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

const removeCustomPlugins = (mod: string) => {
  const newPlugins = customPlugins().filter(p => p !== mod)
  localStorage.setItem('custom-plugins-playground', JSON.stringify(newPlugins))
}

const addCustomPlugin = (mod: string) => {
  const newPlugins = customPlugins()
  newPlugins.push(mod)
  localStorage.setItem('custom-plugins-playground', JSON.stringify(newPlugins))
}

const customPlugins = (): string[] => {
  return JSON.parse(localStorage.getItem('custom-plugins-playground') || '[]')
}

export const activePlugins = () => {
  const existing = customPlugins().map(module => ({ module }))
  return existing.concat(pluginRegistry.filter(p => !!localStorage.getItem('plugin-' + p.module)))
}

const announceWeNeedARestart = () => {
  document.getElementById('restart-required')!.style.display = 'block'
}

export const optionsPlugin = () => {
  const plugin: PlaygroundPlugin = {
    id: 'options',
    displayName: localize('play_sidebar_options', 'Options'),
    // shouldBeSelected: () => true, // uncomment to make this the first tab on reloads
    willMount: (_sandbox, container) => {
      const categoryDiv = document.createElement('div')
      container.appendChild(categoryDiv)

      const p = document.createElement('p')
      p.id = 'restart-required'
      p.textContent = 'Restart required'
      categoryDiv.appendChild(p)

      const ol = document.createElement('ol')
      ol.className = 'playground-options'

      createSection('Options', categoryDiv)

      settings.forEach(setting => {
        const settingButton = createButton(setting)
        ol.appendChild(settingButton)
      })

      categoryDiv.appendChild(ol)

      createSection('External Plugins', categoryDiv)

      const pluginsOL = document.createElement('ol')
      pluginsOL.className = 'playground-plugins'
      pluginRegistry.forEach(plugin => {
        const settingButton = createPlugin(plugin)
        pluginsOL.appendChild(settingButton)
      })
      categoryDiv.appendChild(pluginsOL)

      const warning = document.createElement('p')
      warning.className = 'warning'
      warning.textContent = 'Warning: Code from plugins comes from third-parties.'
      categoryDiv.appendChild(warning)

      createSection('Custom Modules', categoryDiv)
      const customModulesOL = document.createElement('ol')
      customModulesOL.className = 'custom-modules'

      const updateCustomModules = () => {
        while (customModulesOL.firstChild) {
          customModulesOL.removeChild(customModulesOL.firstChild)
        }
        customPlugins().forEach(module => {
          const li = document.createElement('li')
          li.innerHTML = module
          const a = document.createElement('a')
          a.href = '#'
          a.textContent = 'X'
          a.onclick = () => {
            removeCustomPlugins(module)
            updateCustomModules()
            announceWeNeedARestart()
            return false
          }
          li.appendChild(a)

          customModulesOL.appendChild(li)
        })
      }
      updateCustomModules()

      categoryDiv.appendChild(customModulesOL)
      const inputForm = createNewModuleInputForm(updateCustomModules)
      categoryDiv.appendChild(inputForm)

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
  const div = document.createElement('div')

  const label = document.createElement('label')

  const top = `<span>${plugin.display}</span> by <a href='${plugin.author.href}'>${plugin.author.name}</a><br/>${plugin.blurb}`
  const bottom = `<a href='https://www.npmjs.com/package${plugin.module}'>npm</a> | <a href="${plugin.repo}">repo</a>`
  label.innerHTML = `${top}<br/>${bottom}`

  const key = 'plugin-' + plugin.module
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.id = key
  input.checked = !!localStorage.getItem(key)

  input.onchange = () => {
    announceWeNeedARestart()
    if (input.checked) {
      localStorage.setItem(key, 'true')
    } else {
      localStorage.removeItem(key)
    }
  }

  label.htmlFor = input.id

  div.appendChild(input)
  div.appendChild(label)
  li.appendChild(div)
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

const createNewModuleInputForm = (updateOL: Function) => {
  const form = document.createElement('form')

  const newModuleInput = document.createElement('input')
  newModuleInput.type = 'text'
  newModuleInput.id = 'gist-input'
  newModuleInput.placeholder = 'Module from npm'
  form.appendChild(newModuleInput)

  form.onsubmit = e => {
    announceWeNeedARestart()
    addCustomPlugin(newModuleInput.value)
    e.stopPropagation()
    updateOL()
    return false
  }

  return form
}
