type Factory = import("../../../../static/js/playground").PluginFactory

const intro = `
The bug workbench uses <a href='https://www.npmjs.com/package/@typescript/twoslash'>Twoslash</a> to help you create accurate bug reports. 
Twoslash is an markup format for TypeScript files which lets you highlight code, handle-multiple files and
show the files the TypeScript compiler creates.
`.trim()

const why = `
This means we can make reproductions of bugs which are trivial to verify against many different versions of TypeScript over time. 
`.trim()

const examples = [
  {
    issue: 37231,
    name: "Incorrect Type Inference Example",
    blurb:
      "Using <code>// ^?</code> to highlight how inference gives different results at different locations",
    code: `// @noImplicitAny: false

type Entity = {
  someDate: Date | null;
} & ({ id: string; } | { id: number; })

type RowRendererMeta<TInput extends {}> = {
  [key in keyof TInput]: { key: key; caption: string; formatter?: (value: TInput[key]) => string; };
}
type RowRenderer<TInput extends {}> = RowRendererMeta<TInput>[keyof RowRendererMeta<TInput>];

const test: RowRenderer<Entity> = {
  key: 'someDate',
  caption: 'My Date',
  formatter: (value) => value ? value.toString() : '-' // value: any
//            ^?
}

const thisIsNotTheIssue: Partial<RowRendererMeta<Entity>> = {
  someDate: {
    key: 'someDate',
    caption: 'My Date',
    formatter: (value) => value ? value.toString() : '-' // value: Date | null
//              ^?
  }
}`,
  },
]
export const workbenchHelpPlugin: Factory = (i, utils) => {
  return {
    id: "help",
    displayName: "Help",
    didMount: (sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      ds.subtitle("Twoslash Overview")
      ds.p(intro)

      ds.p(why)

      ds.title("Examples")

      examples.forEach(e => {
        // prettier-ignore
        ds.subtitle(e.name + ` <a href='https://github.com/microsoft/TypeScript/issues/${e.issue}'>${e.issue}</a>`)
        ds.p(e.blurb)
        const button = document.createElement("button")
        button.textContent = "Show example"
        button.onclick = () => sandbox.setText(e.code)
        container.appendChild(button)
      })
    },
  }
}
