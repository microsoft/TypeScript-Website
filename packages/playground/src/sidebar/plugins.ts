import { PlaygroundPlugin, PluginFactory } from ".."

import { allNPMPlugins } from "./fixtures/npmPlugins"

const pluginRegistry = ["typescript-playground-presentation-mode", "playground-transformer-timeline"]

/** Whether the playground should actively reach out to an existing plugin */
export const allowConnectingToLocalhost = () => {
  return !!localStorage.getItem("compiler-setting-connect-dev-plugin")
}

export const activePlugins = () => {
  const existing = customPlugins().map(module => ({ id: module }))
  return existing.concat(allNPMPlugins.filter(p => !!localStorage.getItem("plugin-" + p.id)))
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

      const featured = allNPMPlugins.filter(p => pluginRegistry.includes(p.id))
      const rest = allNPMPlugins.filter(p => !pluginRegistry.includes(p.id))

      ds.subtitle(i("play_sidebar_featured_plugins"))

      const featuredPluginsOL = document.createElement("ol")
      featuredPluginsOL.className = "playground-plugins featured"
      featured.forEach(plugin => {
        const settingButton = createPlugin(plugin)
        featuredPluginsOL.appendChild(settingButton)
      })
      container.appendChild(featuredPluginsOL)

      ds.subtitle(i("play_sidebar_plugins_options_external"))

      const pluginsOL = document.createElement("ol")
      pluginsOL.className = "playground-plugins"
      rest.forEach(plugin => {
        const settingButton = createPlugin(plugin)
        pluginsOL.appendChild(settingButton)
      })
      container.appendChild(pluginsOL)

      const warning = document.createElement("p")
      warning.className = "warning"
      warning.textContent = i("play_sidebar_plugins_options_external_warning")
      container.appendChild(warning)

      const subheading = ds.subtitle(i("play_sidebar_plugins_options_modules"))
      subheading.id = "custom-modules-header"

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
            ds.declareRestartRequired(i)
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
          ds.declareRestartRequired(i)
        },
      })

      pluginsDevOL.appendChild(connectToDev)
      container.appendChild(pluginsDevOL)
    },
  }

  const createPlugin = (plugin: typeof allNPMPlugins[0]) => {
    const li = document.createElement("li")
    const div = document.createElement("div")

    const label = document.createElement("label")

    // Avoid XSS by someone injecting JS via the description, which is the only free text someone can use
    var p = document.createElement("p")
    p.appendChild(document.createTextNode(plugin.description))
    const escapedDescription = p.innerHTML

    const top = `<span>${plugin.name}</span> by <a href='https://www.npmjs.com/~${plugin.author}'>${plugin.author}</a><br/>${escapedDescription}`
    const repo = plugin.href.includes("github") ? `| <a href="${plugin.href}">repo</a>` : ""
    const bottom = `<a href='https://www.npmjs.com/package/${plugin.id}'>npm</a> ${repo}`
    label.innerHTML = `${top}<br/>${bottom}`

    const key = "plugin-" + plugin.id
    const input = document.createElement("input")
    input.type = "checkbox"
    input.id = key
    input.checked = !!localStorage.getItem(key)

    input.onchange = () => {
      const ds = utils.createDesignSystem(div)
      ds.declareRestartRequired(i)
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
    newModuleInput.placeholder = i("play_sidebar_plugins_options_modules_placeholder")
    newModuleInput.setAttribute("aria-labelledby", "custom-modules-header")
    form.appendChild(newModuleInput)

    form.onsubmit = e => {
      const ds = utils.createDesignSystem(form)
      ds.declareRestartRequired(i)

      addCustomPlugin(newModuleInput.value)
      e.stopPropagation()
      updateOL()
      return false
    }

    return form
  }

  return plugin
}
