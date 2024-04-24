type Sandbox = import("@typescript/sandbox").Sandbox
type Factory = import("../../../../static/js/playground").PluginFactory
type PluginUtils = import("../../../../static/js/playground").PluginUtils

import tsconfigOptions from "../../../../../tsconfig-reference/output/en-summary.json"

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

const reference: {
  name: string
  content: (
    sandbox: Sandbox,
    container: HTMLDivElement,
    ds: ReturnType<PluginUtils["createDesignSystem"]>
  ) => void
}[] = [
  {
    name: "Compiler Options",
    content: (sandbox, container, ds) => {
      ds.p(`
You can set compiler flags via <code>// @[option]</code> comments inside the sample.
<ul>
  <li>Booleans: <code>// @strict: true</code> or <code>// @strict: false</code>.<br/>You can omit <code>: true</code> to get the same behavior.</li>
  <li>Strings: <code>// @target: ES2015</code></li>
  <li>Numbers: <code>// @target: 4</code></li>
  <li>Lists: <code>// @types: ['jest']</code></li>
</ul>
`)

      ds.subtitle("Compiler Option Reference")
      tsconfigOptions.options
        .sort((l, r) => l.id.localeCompare(r.id))
        .forEach(opt => {
          const skip = ["Project_Files_0", "Watch_Options_999"]
          if (skip.includes(opt.categoryID)) return

          ds.p(`<code>// @${opt.id}</code><br>${opt.oneliner}.`)
        })
    },
  },
  {
    name: "Multi File",
    content: (sandbox, container, ds) => {
      ds.p(
        "The code file can be converted into multiple files behind the scenes. This is done by chopping the code sample whenever there is a <code>// @filename: [path]</code>."
      )

      ds.code(
        `
// @showEmit
// @filename: index.ts
import {pi} from "./utils"
console.log(pi)

// @filename: utils.ts
export const pi = "3.14"
`.trim()
      )

      const button = document.createElement("button")
      button.textContent = "See an Example"
      button.onclick = () =>
        sandbox.setText(
          `
// @filename: service.ts
export type Service = {
  id: string
  display: string
}

// @filename: app.ts
import type { Service } from "./service";
//                            ^ - this error is OK

const myServices: Service[] = [
  { id: "launch", display: "Launch" },
  { id: "lunch", disply: "Lunch" },
//               ^ - this error is real but hidden
//                   you can see it in 'Assertions'
]
      `.trim()
        )
      container.appendChild(button)
    },
  },
  {
    name: "Queries",
    content: (sandbox, container, ds) => {
      ds.p(
        "Twoslash supports making queries for what the type is at a particular location of code. It also is a specially crafted comment. "
      )
      ds.code(
        `
const myExample = {
  hello: "world"
}

myExample.hello;
//         ^?
      `.trim()
      )

      ds.p(
        "You can use as many as you want of these, but you can only have one per line."
      )
      const button = document.createElement("button")
      button.textContent = "See an Example"
      button.onclick = () =>
        sandbox.setText(
          `
const button = document.createElement("button");
button.textContent = "See an Example";

button.onclick = () => {
  console.log("Example has been clicked");
  button.disabled = true;
// ^?
}

document.body.appendChild(button);
//       ^?
      `.trim()
        )
      container.appendChild(button)

      ds.p(
        "The repro testing system will use these queries as an indicator of what has changed, so if you highlight a bug in inference then when it is fixed and the type has changed it will be raised."
      )
    },
  },
  {
    name: "Emitter",
    content: (sandbox, container, ds) => {
      ds.p(
        `
There are ways to have your test repro be about the output of running TypeScript. There are two comment types which can be used to highlight these files.
<br/><br/><code>// @showEmit</code> is a shortcut for showing the <code>.js</code> file for a single file code sample:
`.trim()
      )
      ds.code(
        `
// @showEmit
export const helloWorld: string = "Hi"
`.trim()
      )
      ds.p(
        `The long-form is <code>// @showEmittedFile: [filename]</code> which allows for showing any emitted file`
      )
      ds.code(
        `
// @declaration: true
// @showEmit
// @showEmittedFile: index.d.ts

export function getStringLength(value: string) {
  return value.length
}
`.trim()
      )
      ds.p("Multi-file seems to be buggy ATM, but this should work eventually:")
      ds.code(
        `
// @showEmit
// @showEmittedFile: b.js

// @filename: a.ts
export const helloWorld: string = "Hi"

// @filename: b.ts
const abc = ""
`.trim()
      )
    },
  },
  {
    name: "Defaults",
    content: (sandbox, container, ds) => {
      examples.forEach(e => {
        ds.p(
          "The twoslash compiler only has a few changes from the default empty TSConfig "
        )
        ds.code(`
  const defaultCompilerOptions: CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2016,
    allowJs: true
  }
`)
      })
      ds.p(
        "You may need to undo <code>strict</code> for some samples, but the others shouldn't affect most code repros."
      )
    },
  },
  {
    name: "Examples",
    content: (sandbox, container, ds) => {
      ds.p(
        "Note: this section is tricky to document... These bugs may have been fixed since the docs were created. Consider theses as ideas in how to make repros rather than useful bug reproductions."
      )
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
  },
]

export const workbenchReferencePlugin: Factory = (i, utils) => {
  return {
    id: "ref",
    displayName: "Docs",
    didMount: (sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      const tabContainer = document.createElement("div")
      const tabBar = ds.createTabBar()
      const tabs: HTMLElement[] = []

      reference.forEach((r, i) => {
        const tab = ds.createTabButton(r.name)
        tabs.push(tab)
        tab.onclick = () => {
          tabs.forEach(t => t.classList.remove("active"))
          tab.classList.add("active")

          const ds = utils.createDesignSystem(tabContainer)
          ds.clear()
          r.content(sandbox, tabContainer, ds)
        }
        tabBar.appendChild(tab)

        if (i === 0) tab.onclick({} as any)
      })

      container.appendChild(tabBar)
      container.appendChild(tabContainer)
    },
  }
}
