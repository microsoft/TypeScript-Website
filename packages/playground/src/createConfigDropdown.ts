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
  const configContainer = document.getElementById('config-container')!
  const container = document.createElement('div')
  container.id = 'boolean-options-container'
  configContainer.appendChild(container)

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
      label.innerHTML = `<span>${optSummary.id}</span><br/>${optSummary.oneliner}`

      const input = document.createElement('input')
      input.value = optSummary.id
      input.type = 'checkbox'
      input.name = optSummary.id
      input.id = 'option-' + optSummary.id

      input.onchange = () => {
        const newUpdate: any = {}
        newUpdate[optSummary.id] = input.checked
        sandbox.updateCompilerSettings(newUpdate)
      }

      label.htmlFor = input.id

      li.appendChild(input)
      li.appendChild(label)
      ol.appendChild(li)
    })

    categoryDiv.appendChild(header)
    categoryDiv.appendChild(ol)
    container.appendChild(categoryDiv)
  })
}

export const updateConfigDropdownForCompilerOptions = (sandbox: Sandbox) => {
  const compilerOpts = sandbox.getCompilerOptions()
  const boolOptions = Object.keys(sandbox.getCompilerOptions()).filter(k => typeof compilerOpts[k] === 'boolean')

  boolOptions.forEach(opt => {
    const inputID = 'option-' + opt
    const input = document.getElementById(inputID) as HTMLInputElement
    input.checked = !!compilerOpts[opt]
  })
}

export const setupJSONToggleForConfig = (sandbox: Sandbox) => {}
