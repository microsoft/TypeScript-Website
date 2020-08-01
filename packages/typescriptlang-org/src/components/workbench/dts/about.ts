type Factory = import("../../../../static/js/playground").PluginFactory

const intro = `
The .d.ts workbench....
`.trim()

const why = `
The bug workbench lets make reproductions of bugs which are trivial to verify against many different versions of TypeScript over time.
`.trim()

const how = `
A repro can highlight an issue in a few ways:
<ul>
  <li>Does this code sample fail to compile?</li>
  <li>Does this code sample fail to compile?</li>
  <li>Is a type wrong at a position in the file?</li>
  <li>Is the .js/.d.ts/.map file wrong?</li>
</ul>
`.trim()

const cta = `
To learn how the tools for making a repro, go to "Docs"

`.trim()

export const workbenchAboutPlugin: Factory = (i, utils) => {
  return {
    id: "about",
    displayName: "About",
    didMount: (sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      ds.title(".d.ts Workbench")
      ds.p(intro)

      ds.p(why)
      ds.p(how)
      ds.p(cta)
    },
  }
}
