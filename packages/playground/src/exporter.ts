import { UI } from './createUI'

type Sandbox = import('typescript-sandbox').Sandbox
type CompilerOptions = import('monaco-editor').languages.typescript.CompilerOptions

export const createExporter = (sandbox: Sandbox, monaco: typeof import('monaco-editor'), ui: UI) => {
  function getScriptTargetText(option: any) {
    return monaco.languages.typescript.ScriptTarget[option]
  }

  function getJsxEmitText(option: any) {
    if (option === monaco.languages.typescript.JsxEmit.None) {
      return undefined
    }
    return monaco.languages.typescript.JsxEmit[option]
  }

  function getModuleKindText(option: any) {
    if (option === monaco.languages.typescript.ModuleKind.None) {
      return undefined
    }
    return monaco.languages.typescript.ModuleKind[option]
  }

  // These are the compiler's defaults, and we want a diff from
  // these before putting it in the issue
  const defaultCompilerOptionsForTSC: CompilerOptions = {
    esModuleInterop: false,
    strictNullChecks: false,
    strict: false,
    strictFunctionTypes: false,
    strictPropertyInitialization: false,
    strictBindCallApply: false,
    noImplicitAny: false,
    noImplicitThis: false,
    noImplicitReturns: false,
    checkJs: false,
    allowJs: false,
    experimentalDecorators: false,
    emitDecoratorMetadata: false,
  }

  function getValidCompilerOptions(options: CompilerOptions) {
    const { target: targetOption, jsx: jsxOption, module: moduleOption, ...restOptions } = options

    const targetText = getScriptTargetText(targetOption)
    const jsxText = getJsxEmitText(jsxOption)
    const moduleText = getModuleKindText(moduleOption)

    const opts = {
      ...restOptions,
      ...(targetText && { target: targetText }),
      ...(jsxText && { jsx: jsxText }),
      ...(moduleText && { module: moduleText }),
    }

    const diffFromTSCDefaults = Object.entries(opts).reduce((acc, [key, value]) => {
      if ((opts as any)[key] && value != defaultCompilerOptionsForTSC[key]) {
        // @ts-ignore
        acc[key] = opts[key]
      }

      return acc
    }, {})

    return diffFromTSCDefaults
  }

  // Based on https://github.com/stackblitz/core/blob/master/sdk/src/generate.ts
  function createHiddenInput(name: string, value: string) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    return input
  }

  function createProjectForm(project: any) {
    const form = document.createElement('form')

    form.method = 'POST'
    form.setAttribute('style', 'display:none;')

    form.appendChild(createHiddenInput('project[title]', project.title))
    form.appendChild(createHiddenInput('project[description]', project.description))
    form.appendChild(createHiddenInput('project[template]', project.template))

    if (project.tags) {
      project.tags.forEach((tag: string) => {
        form.appendChild(createHiddenInput('project[tags][]', tag))
      })
    }

    if (project.dependencies) {
      form.appendChild(createHiddenInput('project[dependencies]', JSON.stringify(project.dependencies)))
    }

    if (project.settings) {
      form.appendChild(createHiddenInput('project[settings]', JSON.stringify(project.settings)))
    }

    Object.keys(project.files).forEach(path => {
      form.appendChild(createHiddenInput(`project[files][${path}]`, project.files[path]))
    })

    return form
  }

  const typescriptVersion = sandbox.ts.version
  // prettier-ignore
  const stringifiedCompilerOptions = JSON.stringify({ compilerOptions: getValidCompilerOptions(sandbox.getCompilerOptions()) }, null, '  ')

  // TODO: pull deps
  function openProjectInStackBlitz() {
    const project = {
      title: 'Playground Export - ',
      description: '123',
      template: 'typescript',
      files: {
        'index.ts': sandbox.getText(),
        'tsconfig.json': stringifiedCompilerOptions,
      },
      dependencies: {
        typescript: typescriptVersion,
      },
    }
    const form = createProjectForm(project)
    form.action = 'https://stackblitz.com/run?view=editor'
    // https://github.com/stackblitz/core/blob/master/sdk/src/helpers.ts#L9
    // + buildProjectQuery(options);
    form.target = '_blank'

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  function openInTSAST() {
    const hash = `#code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`
    document.location.assign(`https://ts-ast-viewer.com/${hash}`)
  }

  function openProjectInCodeSandbox() {
    const files = {
      'package.json': {
        content: {
          name: 'TypeScript Playground Export',
          version: '0.0.0',
          description: 'TypeScript playground exported Sandbox',
          dependencies: {
            typescript: typescriptVersion,
          },
        },
      },
      'index.ts': {
        content: sandbox.getText(),
      },
      'tsconfig.json': {
        content: stringifiedCompilerOptions,
      },
    }

    // Using the v1 get API
    const parameters = sandbox.lzstring
      .compressToBase64(JSON.stringify({ files }))
      .replace(/\+/g, '-') // Convert '+' to '-'
      .replace(/\//g, '_') // Convert '/' to '_'
      .replace(/=+$/, '') // Remove ending '='

    const url = `https://codesandbox.io/api/v1/sandboxes/define?view=editor&parameters=${parameters}`
    document.location.assign(url)

    // Alternative using the http URL API, which uses POST. This has the trade-off where
    // the async nature of the call means that the redirect at the end triggers
    // popup security mechanisms in browsers because the function isn't blessed as
    // being a direct result of a user action.

    // fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
    //   method: "POST",
    //   body: JSON.stringify({ files }),
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   }
    // })
    // .then(x => x.json())
    // .then(data => {
    //   window.open('https://codesandbox.io/s/' + data.sandbox_id, '_blank');
    // });
  }

  function codify(code: string, ext: string) {
    return '```' + ext + '\n' + code + '\n```\n'
  }

  async function makeMarkdown() {
    const query = sandbox.createURLQueryWithCompilerOptions(sandbox)
    const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`
    const jsSection = sandbox.config.useJavaScript
      ? ''
      : `
<details><summary><b>Output</b></summary>

${codify(await sandbox.getRunnableJS(), 'ts')}

</details>
`

    return `
<!-- 🚨 STOP 🚨 𝗦𝗧𝗢𝗣 🚨 𝑺𝑻𝑶𝑷 🚨

Half of all issues filed here are duplicates, answered in the FAQ, or not appropriate for the bug tracker. Even if you think you've found a *bug*, please read the FAQ first, especially the Common "Bugs" That Aren't Bugs section!

Please help us by doing the following steps before logging an issue:
  * Search: https://github.com/Microsoft/TypeScript/search?type=Issues
  * Read the FAQ: https://github.com/Microsoft/TypeScript/wiki/FAQ

Please fill in the *entire* template below.
-->

**TypeScript Version:**  ${typescriptVersion}

<!-- Search terms you tried before logging this (so others can find this issue more easily) -->
**Search Terms:**

**Expected behavior:**

**Actual behavior:**

<!-- Did you find other bugs that looked similar? -->
**Related Issues:**

**Code**
${codify(sandbox.getText(), 'ts')}

${jsSection}

<details><summary><b>Compiler Options</b></summary>

${codify(stringifiedCompilerOptions, 'json')}

</details>

**Playground Link:** [Provided](${fullURL})
      `
  }

  async function reportIssue() {
    const body = await makeMarkdown()
    if (body.length < 4000) {
      window.open('https://github.com/Microsoft/TypeScript/issues/new?body=' + encodeURIComponent(body))
    } else {
      ui.showModal(
        body,
        "Issue too long to post automatically. Copy this text, then click 'Create New Issue' to begin.",
        {
          'Create New Issue': 'https://github.com/Microsoft/TypeScript/issues/new',
        }
      )
    }
  }

  async function copyAsMarkdownIssue() {
    const markdown = await makeMarkdown()
    ui.showModal(markdown, 'Markdown code')
  }

  function copyForChat() {
    const query = sandbox.createURLQueryWithCompilerOptions(sandbox)
    const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`
    const chat = `[Playground Link](${fullURL})`
    ui.showModal(chat, 'Markdown for chat')
  }

  function copyForChatWithPreview() {
    const query = sandbox.createURLQueryWithCompilerOptions(sandbox)
    const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`

    const ts = sandbox.getText()
    const preview = ts.length > 200 ? ts.substring(0, 200) + '...' : ts.substring(0, 200)

    const code = '```\n' + preview + '\n```\n'
    const chat = `${code}\n[Playground Link](${fullURL})`
    ui.showModal(chat, 'Markdown code')
  }

  return {
    openProjectInStackBlitz,
    openProjectInCodeSandbox,
    reportIssue,
    copyAsMarkdownIssue,
    copyForChat,
    copyForChatWithPreview,
    openInTSAST,
  }
}
