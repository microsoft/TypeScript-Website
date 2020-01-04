type Sandbox = ReturnType<typeof import('typescript-sandbox').createTypeScriptSandbox>

type OptionsSummary = {
  display: string
  oneliner: string
  id: string
  categoryID: string
  categoryDisplay: string
}

declare const optionsSummary: OptionsSummary[]

export const createConfigDropdown = (sandbox: Sandbox) => {
  const container = document.getElementById('config-container')!

  const compilerOpts = sandbox.getCompilerOptions()
  const boolOptions = Object.keys(sandbox.getCompilerOptions()).filter(k => typeof compilerOpts[k] === 'boolean')

  // we want to make sections of categories
  const categoryMap = {} as { [category: string]: { [optID: string]: OptionsSummary } }
  boolOptions.forEach(optID => {
    const summary = optionsSummary.find(sum => optID === sum.id)!

    const existingCategory = categoryMap[summary.categoryID]
    if (!existingCategory) categoryMap[summary.categoryID] = {}

    categoryMap[summary.categoryID][optID] = summary
  })

  Object.keys(categoryMap).forEach(categoryID => {
    const categoryDiv = document.createElement('div')
    const header = document.createElement('h4')
    const ol = document.createElement('ol')

    Object.keys(categoryMap[categoryID]).forEach(optID => {
      const optSummary = categoryMap[categoryID][optID]
      header.textContent = optSummary.categoryDisplay

      const li = document.createElement('li')
      const label = document.createElement('label')
      label.textContent = optSummary.oneliner
      const button = document.createElement('button')
      button.textContent = optSummary.display

      li.appendChild(label)
      li.appendChild(button)
      ol.appendChild(li)
    })

    categoryDiv.appendChild(header)
    categoryDiv.appendChild(ol)
    container.appendChild(categoryDiv)
  })

  // .map(([key, value]) => {
  //   return `<li style="margin: 0; padding: 0; ${isJS ? "opacity: 0.5" : ""}" title="${UI.tooltips[key] ||
  //     ""}"><label class="button" style="user-select: none; display: block;"><input class="pointer" onchange="javascript:UI.updateCompileOptions(event.target.name, event.target.checked);event.stopPropagation();" name="${key}" type="checkbox" ${
  //     value ? "checked" : ""
  //   }></input>${key}</label></li>`;
  // })
  // .join("\n")}
}

export const updatecreateConfigDropdown = (sandbox: Sandbox) => {}
