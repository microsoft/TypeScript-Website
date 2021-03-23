type PluginFactory = import("../../../../static/js/playground").PluginFactory
type PluginUtils = import("../../../../static/js/playground").PluginUtils

export const workbenchMarkdownPlugin: PluginFactory = (i, utils) => {
  let pluginContainer: HTMLDivElement

  const render = (
    container: HTMLElement,
    ds: ReturnType<PluginUtils["createDesignSystem"]>,
    code: string
  ) => {
    ds.subtitle("Markdown for issue")
    ds.button({
      label: "Copy Markdown",
      onclick: () => navigator.clipboard.writeText(mdCode),
    })
    ds.p("")

    const url = document && document.location ? document.location.href : ""
    const mdCode = `
\`\`\`ts repro
${code.replace(/</g, "&lt;")}
\`\`\`

[Workbench Repro](${url})
    `.trim()

    ds.code(mdCode)
    ds.p(
      "Congrats! These repros make it much easier for us to keep track of bugs on the TypeScript team. You can copy & paste this into an issue or comment on the TypeScript repo to have it get hooked up."
    )
  }

  return {
    id: "md",
    displayName: "Export",
    didMount: (_sandbox, container) => {
      pluginContainer = container
    },
    noResults: (sandbox: any) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()
      render(pluginContainer, ds, sandbox.getText())
    },
    getResults: (sandbox: any) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()
      render(pluginContainer, ds, sandbox.getText())
    },
  }
}
