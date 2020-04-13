import { PlaygroundPlugin, PluginFactory } from ".."

export const settingsPlugin: PluginFactory = (i, utils) => {
  const settings = [
    {
      display: i("play_sidebar_options_disable_ata"),
      blurb: i("play_sidebar_options_disable_ata_copy"),
      flag: "disable-ata",
    },
    {
      display: i("play_sidebar_options_disable_save"),
      blurb: i("play_sidebar_options_disable_save_copy"),
      flag: "disable-save-on-type",
    },
    // {
    //   display: 'Verbose Logging',
    //   blurb: 'Turn on superfluous logging',
    //   flag: 'enable-superfluous-logging',
    // },
  ]

  const plugin: PlaygroundPlugin = {
    id: "settings",
    displayName: i("play_subnav_settings"),
    didMount: async (sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      ds.subtitle(i("play_subnav_settings"))

      const ol = document.createElement("ol")
      ol.className = "playground-options"

      settings.forEach(setting => {
        const settingButton = ds.localStorageOption(setting)
        ol.appendChild(settingButton)
      })

      container.appendChild(ol)
    },
  }

  return plugin
}
