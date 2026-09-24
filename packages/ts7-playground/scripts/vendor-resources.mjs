import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const websiteDirectory = resolve(packageDirectory, "../..")
const examplesDirectory = resolve(websiteDirectory, "packages/typescriptlang-org/static/js/examples")
const examplesIndex = JSON.parse(await readFile(resolve(examplesDirectory, "en.json"), "utf8"))
const helpIndex = {
  docs: [
    {
      title: "Projects and files",
      html: "<p>The playground is a virtual project rooted at <code>/workspace</code>. Use <strong>+ File</strong> to add source or configuration files, select files in the project tree, and use <strong>Delete</strong> to remove the active project file.</p><p>The project is saved in the page URL and browser storage as you edit.</p>",
    },
    {
      title: "Compiler versions",
      html: "<p>The selector offers TypeScript 7.1, the latest patch release for each previous major.minor line, and custom playground-CDN build IDs.</p><p>Changing compiler versions reloads the page while preserving the project.</p>",
    },
    {
      title: "Compiler settings",
      html: "<p>Edit <code>tsconfig.json</code> directly. The editor provides schema completion, hover documentation, and validation for compiler options.</p><p>Emit and diagnostics use the files and options selected by that configuration.</p>",
    },
    {
      title: "Package types",
      html: "<p>Imports from npm packages automatically acquire bundled declarations or matching <code>@types</code> packages. Downloaded declarations are cached and available to diagnostics, completion, hover, and go-to-definition.</p><p>Package JavaScript is not downloaded, so <strong>Run</strong> still supports only emitted project files and relative CommonJS imports.</p>",
    },
    {
      title: "Editor navigation",
      html: "<p>Use hover, completion, references, rename, formatting, quick fixes, and <kbd>F12</kbd> go-to-definition as in an editor. Back and Forward return between project and declaration files.</p><p>Place <code>// ^?</code> beneath an expression to display its inferred type.</p>",
    },
    {
      title: "Emit and Run",
      html: "<p>The Emit panel shows every generated JavaScript and declaration file. <strong>Run</strong> executes the emitted project with an in-browser CommonJS loader and captures console output.</p><p>Set <code>compilerOptions.module</code> to <code>CommonJS</code> when running a project.</p>",
    },
  ],
}

const examples = await Promise.all(
  examplesIndex.examples.map(async example => {
    const fileName = resolve(examplesDirectory, example.lang, ...example.path, example.name)
    let code = await readFile(fileName, "utf8")
    if (code.startsWith("//// {")) code = code.split(/\r?\n/).slice(1).join("\n").trim()
    return { ...example, code }
  })
)

const vendorDirectory = resolve(packageDirectory, "vendor")
const ataVendorDirectory = resolve(vendorDirectory, "ata")
await mkdir(vendorDirectory, { recursive: true })
await mkdir(ataVendorDirectory, { recursive: true })
await Promise.all([
  writeFile(
    resolve(vendorDirectory, "examples.json"),
    `${JSON.stringify({
      examples,
      sections: examplesIndex.sections,
      sortedSubSections: examplesIndex.sortedSubSections,
    })}\n`
  ),
  writeFile(resolve(vendorDirectory, "help.json"), `${JSON.stringify(helpIndex)}\n`),
  cp(resolve(websiteDirectory, "packages/ata/dist/index.js"), resolve(ataVendorDirectory, "index.js")),
  cp(resolve(websiteDirectory, "packages/ata/dist/src/index.d.ts"), resolve(ataVendorDirectory, "index.d.ts")),
  cp(resolve(websiteDirectory, "LICENSE-CODE"), resolve(ataVendorDirectory, "LICENSE.txt")),
  writeFile(
    resolve(ataVendorDirectory, "package.json"),
    `${JSON.stringify(
      {
        name: "@typescript/ata",
        version: "0.9.8",
        type: "module",
        main: "./index.js",
        types: "./index.d.ts",
      },
      undefined,
      2
    )}\n`
  ),
])

console.log(`Vendored ${examples.length} playground examples and ${helpIndex.docs.length} help topics`)
