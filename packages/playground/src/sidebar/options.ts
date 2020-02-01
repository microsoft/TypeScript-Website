import { PlaygroundPlugin } from '..'

/** Whether the playground should actively reach out to an existing plugin */
export const allowConnectingToLocalhost = () => {
  return !!localStorage.getItem('compiler-setting-connect-dev-plugin')
}

export const optionsPlugin = () => {
  const plugin: PlaygroundPlugin = {
    id: 'options',
    displayName: 'Options',
    shouldBeSelected: () => true,
    willMount: (sandbox, container) => {
      const categoryDiv = document.createElement('div')
      const ol = document.createElement('ol')
      ol.className = 'playground-options'

      const optionsTitle = document.createElement('h4')
      optionsTitle.textContent = 'Options'
      container.appendChild(optionsTitle)

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

      settings.forEach(setting => {
        const settingButton = createButton(setting)
        ol.appendChild(settingButton)
      })

      categoryDiv.appendChild(ol)
      container.appendChild(categoryDiv)

      // Hidden for now
      const isDevMode = document.location.host.includes('localhost')
      if (isDevMode) {
        const pluginsTitle = document.createElement('h4')
        pluginsTitle.textContent = 'Plugins'
        container.appendChild(pluginsTitle)

        const ol = document.createElement('ol')
        ol.className = 'playground-options'
        const connectToDev = createButton({
          display: 'Connect to <code>localhost:5000/index.js</code>',
          blurb:
            "Automatically try connect to a playground plugin in development. You can read more <a href='http://TBD'>here</a>.",
          flag: 'connect-dev-plugin',
        })

        ol.appendChild(connectToDev)
        container.appendChild(ol)
      }
    },
  }

  return plugin
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
