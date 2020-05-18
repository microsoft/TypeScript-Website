import { PlaygroundPlugin, PluginFactory } from ".."

const pluginRegistry = [
  {
    module: "typescript-playground-presentation-mode",
    display: "Presentation Mode",
    blurb: "Create presentations inside the TypeScript playground, seamlessly jump between slides and live-code.",
    repo: "https://github.com/orta/playground-slides/#readme",
    author: {
      name: "Orta",
      href: "https://orta.io",
    },
  },
  {
    module: "playground-collaborate",
    display: "Collaborate",
    blurb: "Create rooms to inspect code together.",
    repo: "https://github.com/orta/playground-collaborate/#readme",
    author: {
      name: "Orta",
      href: "https://orta.io",
    },
  },
]

/** Whether the playground should actively reach out to an existing plugin */
export const allowConnectingToLocalhost = () => {
  return !!localStorage.getItem("compiler-setting-connect-dev-plugin")
}

export const activePlugins = () => {
  const existing = customPlugins().map(module => ({ module }))
  return existing.concat(pluginRegistry.filter(p => !!localStorage.getItem("plugin-" + p.module)))
}

const removeCustomPlugins = (mod: string) => {
  const newPlugins = customPlugins().filter(p => p !== mod)
  localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins))
}

export const addCustomPlugin = (mod: string) => {
  const newPlugins = customPlugins()
  newPlugins.push(mod)
  localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins))
  // @ts-ignore
  window.appInsights &&
    // @ts-ignore
    window.appInsights.trackEvent({ name: "Added Custom Module", properties: { id: mod } })
}

const customPlugins = (): string[] => {
  return JSON.parse(localStorage.getItem("custom-plugins-playground") || "[]")
}

export const optionsPlugin: PluginFactory = (i, utils) => {
  const plugin: PlaygroundPlugin = {
    id: "plugins",
    displayName: i("play_sidebar_plugins"),
    // shouldBeSelected: () => true, // uncomment to make this the first tab on reloads
    willMount: (_sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      ds.subtitle(i("play_sidebar_plugins_options_external"))

      const pluginsOL = document.createElement("ol")
      pluginsOL.className = "playground-plugins"
      pluginRegistry.forEach(plugin => {
        const settingButton = createPlugin(plugin)
        pluginsOL.appendChild(settingButton)
      })
      container.appendChild(pluginsOL)

      const warning = document.createElement("p")
      warning.className = "warning"
      warning.textContent = i("play_sidebar_plugins_options_external_warning")
      container.appendChild(warning)

      ds.subtitle(i("play_sidebar_plugins_options_modules"))

      const customModulesOL = document.createElement("ol")
      customModulesOL.className = "custom-modules"

      const updateCustomModules = () => {
        while (customModulesOL.firstChild) {
          customModulesOL.removeChild(customModulesOL.firstChild)
        }
        customPlugins().forEach(module => {
          const li = document.createElement("li")
          li.innerHTML = module
          const a = document.createElement("a")
          a.href = "#"
          a.textContent = "X"
          a.onclick = () => {
            removeCustomPlugins(module)
            updateCustomModules()
            utils.declareRestartRequired(i)
            return false
          }
          li.appendChild(a)

          customModulesOL.appendChild(li)
        })
      }
      updateCustomModules()

      container.appendChild(customModulesOL)
      const inputForm = createNewModuleInputForm(updateCustomModules, i)
      container.appendChild(inputForm)

      ds.subtitle(i("play_sidebar_plugins_plugin_dev"))

      const pluginsDevOL = document.createElement("ol")
      pluginsDevOL.className = "playground-options"

      const connectToDev = ds.localStorageOption({
        display: i("play_sidebar_plugins_plugin_dev_option"),
        blurb: i("play_sidebar_plugins_plugin_dev_copy"),
        flag: "compiler-setting-connect-dev-plugin",
        onchange: () => {
          utils.declareRestartRequired(i)
        },
      })

      pluginsDevOL.appendChild(connectToDev)
      container.appendChild(pluginsDevOL)
    },
  }

  const createPlugin = (plugin: typeof pluginRegistry[0]) => {
    const li = document.createElement("li")
    const div = document.createElement("div")

    const label = document.createElement("label")

    const top = `<span>${plugin.display}</span> by <a href='${plugin.author.href}'>${plugin.author.name}</a><br/>${plugin.blurb}`
    const bottom = `<a href='https://www.npmjs.com/package/${plugin.module}'>npm</a> | <a href="${plugin.repo}">repo</a>`
    label.innerHTML = `${top}<br/>${bottom}`

    const key = "plugin-" + plugin.module
    const input = document.createElement("input")
    input.type = "checkbox"
    input.id = key
    input.checked = !!localStorage.getItem(key)

    input.onchange = () => {
      utils.declareRestartRequired(i)
      if (input.checked) {
        // @ts-ignore
        window.appInsights &&
          // @ts-ignore
          window.appInsights.trackEvent({ name: "Added Registry Plugin", properties: { id: key } })
        localStorage.setItem(key, "true")
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

  const createNewModuleInputForm = (updateOL: Function, i: any) => {
    const form = document.createElement("form")

    const newModuleInput = document.createElement("input")
    newModuleInput.type = "text"
    newModuleInput.id = "gist-input"
    newModuleInput.placeholder = i("play_sidebar_plugins_options_modules_placeholder")
    form.appendChild(newModuleInput)

    form.onsubmit = e => {
      utils.declareRestartRequired(i)
      addCustomPlugin(newModuleInput.value)
      e.stopPropagation()
      updateOL()
      return false
    }

    return form
  }

  return plugin
}
