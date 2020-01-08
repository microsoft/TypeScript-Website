import { PlaygroundPlugin } from '..'

export const optionsPlugin = () => {
  const plugin: PlaygroundPlugin = {
    id: 'options',
    displayName: 'Options',
    willMount: (sandbox, container) => {
      const categoryDiv = document.createElement('div')
      const ol = document.createElement('ol')
      ol.id = 'playground-options'

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
        const li = document.createElement('li')
        const label = document.createElement('label')
        label.innerHTML = `<span>${setting.display}</span><br/>${setting.blurb}`

        const input = document.createElement('input')
        input.type = 'checkbox'
        input.id = 'compiler-setting-' + setting.flag
        input.checked = !!localStorage.getItem(setting.flag)

        input.onchange = () => {
          if (input.checked) {
            localStorage.setItem(setting.flag, 'true')
          } else {
            localStorage.removeItem(setting.flag)
          }
        }

        label.htmlFor = input.id

        li.appendChild(input)
        li.appendChild(label)
        ol.appendChild(li)
      })

      categoryDiv.appendChild(ol)
      container.appendChild(categoryDiv)
    },
  }

  return plugin
}
