type Sandbox = ReturnType<typeof import('typescript-sandbox').createTypeScriptSandbox>

declare const optionsSummary: { [id: string]: { display: string; oneliner: string } }

export const createConfigDropdown = (sandbox: Sandbox) => {
  const container = document.getElementById('config-container')!

  console.log('go')
  const compilerOpts = sandbox.getCompilerOptions()
  const boolOptions = Object.keys(sandbox.getCompilerOptions()).filter(k => typeof compilerOpts[k] === 'boolean')
  console.log('opts', Object.keys(sandbox.getCompilerOptions()))

  console.log(boolOptions)
  boolOptions.forEach(option => {
    const li = document.createElement('li')
    const label = document.createElement('label')
    label.textContent = optionsSummary[option].oneliner
    const button = document.createElement('button')
    button.textContent = option

    li.appendChild(label)
    li.appendChild(button)
    container.appendChild(li)
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
