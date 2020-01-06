type Sandbox = ReturnType<typeof import('typescript-sandbox').createTypeScriptSandbox>
type Monaco = typeof import('monaco-editor')

type OptionsSummary = {
  display: string
  oneliner: string
  id: string
  categoryID: string
  categoryDisplay: string
}

declare const optionsSummary: OptionsSummary[]

export const createConfigDropdown = (sandbox: Sandbox, monaco: Monaco) => {
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

  const dropdownContainer = document.getElementById('compiler-dropdowns')!

  const target = optionsSummary.find(sum => sum.id === 'target')!
  const targetSwitch = createSelect(target.display, 'target', target.oneliner, monaco.languages.typescript.ScriptTarget)
  dropdownContainer.appendChild(targetSwitch)

  const jsx = optionsSummary.find(sum => sum.id === 'jsx')!
  const jsxSwitch = createSelect(jsx.display, 'jsx', jsx.oneliner, monaco.languages.typescript.JsxEmit)
  dropdownContainer.appendChild(jsxSwitch)

  const modSum = optionsSummary.find(sum => sum.id === 'module')!
  const moduleSwitch = createSelect(modSum.display, 'module', modSum.oneliner, monaco.languages.typescript.ModuleKind)
  dropdownContainer.appendChild(moduleSwitch)
}

export const updateConfigDropdownForCompilerOptions = (sandbox: Sandbox, monaco: Monaco) => {
  const compilerOpts = sandbox.getCompilerOptions()
  const boolOptions = Object.keys(sandbox.getCompilerOptions()).filter(k => typeof compilerOpts[k] === 'boolean')

  boolOptions.forEach(opt => {
    const inputID = 'option-' + opt
    const input = document.getElementById(inputID) as HTMLInputElement
    input.checked = !!compilerOpts[opt]
  })

  const compilerIDToMaps: any = {
    module: monaco.languages.typescript.ModuleKind,
    jsx: monaco.languages.typescript.JsxEmit,
    target: monaco.languages.typescript.ScriptTarget,
  }

  Object.keys(compilerIDToMaps).forEach(flagID => {
    const input = document.getElementById('compiler-select-' + flagID) as HTMLInputElement
    const currentValue = compilerOpts[flagID]
    const map = compilerIDToMaps[flagID]
    // @ts-ignore
    const realValue = map[currentValue]
    // @ts-ignore
    for (const option of input.children) {
      option.selected = option.value.toLowerCase() === realValue.toLowerCase()
    }
  })
}

const createSelect = (title: string, id: string, blurb: string, option: any) => {
  const label = document.createElement('label')
  const textToDescribe = document.createElement('span')
  textToDescribe.textContent = title + ':'
  label.appendChild(textToDescribe)

  const select = document.createElement('select')
  select.id = 'compiler-select-' + id
  label.appendChild(select)

  Object.keys(option)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      // hide Latest
      if (key === 'Latest') return

      const option = document.createElement('option')
      option.value = key
      option.text = key

      select.appendChild(option)
    })

  const span = document.createElement('span')
  span.textContent = blurb
  span.classList.add('compiler-flag-blurb')
  label.appendChild(span)

  return label
}

export const setupJSONToggleForConfig = (sandbox: Sandbox) => {}
