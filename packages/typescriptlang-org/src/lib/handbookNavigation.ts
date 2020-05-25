export interface NavItem {
  title: string
  id: string
  directory: string
  index: string
  items: { id: string; title: string; href?: string }[]
  chronological?: true
  summary: string
}
// IDs come from the filename

export const handbookNavigation: NavItem[] = [
  {
    title: "Get Started",
    summary:
      "Get an overview of TypeScript from different starting points depending on your background.",
    id: "get-started",
    directory: "handbook",
    index: "typescript-from-scratch",
    items: [
      {
        id: "typescript-from-scratch",
        title: "TS for the New Programmer",
      },
      {
        id: "typescript-in-5-minutes",
        title: "TS for JS Programmers",
      },
      {
        id: "typescript-in-5-minutes-oop",
        title: "TS for OOP Programmers ",
      },
      {
        id: "typescript-in-5-minutes-func",
        title: "TS for Functional Programmers",
      },
      { id: "typescript-tooling-in-5-minutes", title: "Tooling in 5 minutes" },
    ],
  },
  {
    title: "Handbook",
    summary:
      "A start to finish overview of TypeScript, with the goals to get you productive for daily usage.",
    id: "handbook",
    directory: "handbook",
    chronological: true,
    index: "/",
    items: [
      { id: "intro", title: "What is the Handbook?" },
      { id: "basic-types", title: "Basic Types" },
      { id: "interfaces", title: "Interfaces" },
      { id: "functions", title: "Functions" },
      { id: "literal-types", title: "Literal Types" },
      { id: "unions-and-intersections", title: "Unions and Intersections" },
      { id: "classes", title: "Classes" },
      { id: "enums", title: "Enums" },
      { id: "generics", title: "Generics" },
    ],
  },
  {
    title: "Handbook Reference",
    summary: "Deep dives into how TypeScript works in particular cases.",

    id: "handbook-reference",
    directory: "handbook",
    index: "the-handbook",
    items: [
      { id: "advanced-types", title: "Advanced Types" },
      { id: "declaration-merging", title: "Declaration Merging" },
      { id: "decorators", title: "Decorators" },
      { id: "utility-types", title: "Global Utility Types" },
      { id: "iterators-and-generators", title: "Iterators and Generators" },
      { id: "jsx", title: "JSX" },
      { id: "mixins", title: "Mixins" },
      { id: "modules", title: "Modules" },
      { id: "module-resolution", title: "Module Resolution" },
      { id: "namespaces", title: "Namespaces" },
      { id: "namespaces-and-modules", title: "Namespaces and Modules" },
      { id: "symbols", title: "Symbols" },
      { id: "triple-slash-directives", title: "Triple-Slash Directives" },
      { id: "type-compatibility", title: "Type Compatibility" },
      { id: "type-inference", title: "Type Inference" },
      {
        title: "Type Checking JavaScript Files",
        id: "type-checking-javascript-files",
      },
      { id: "dom-manipulation", title: "TypeScript & the DOM" },
      { id: "variable-declarations", title: "Variable Declarations" },
    ],
  },
  {
    title: "Tutorials",
    id: "tutorials",
    directory: "handbook",
    index: "typescript-in-5-minutes",
    summary:
      "Step by step tutorials how TypeScript works with different tools.",
    items: [
      { id: "asp-net-core", title: "ASP.NET Core" },
      { id: "gulp", title: "Gulp" },
      { id: "migrating-from-javascript", title: "Migrating from JavaScript" },
      { id: "react-&-webpack", title: "React & Webpack" },
    ],
  },
  {
    title: "What's New",
    id: "whats-new",
    directory: "handbook/release-notes",
    index: "overview",
    summary:
      "Find out how TypeScript has evolved and what's new in the releases.",
    items: [
      { id: "overview", title: "Overview" },
      { id: "typescript-3-9", title: "TypeScript 3.9" },
      { id: "typescript-3-8", title: "TypeScript 3.8" },
      { id: "typescript-3-7", title: "TypeScript 3.7" },
      { id: "typescript-3-6", title: "TypeScript 3.6" },
      { id: "typescript-3-5", title: "TypeScript 3.5" },
      { id: "typescript-3-4", title: "TypeScript 3.4" },
      { id: "typescript-3-3", title: "TypeScript 3.3" },
      { id: "typescript-3-2", title: "TypeScript 3.2" },
      { id: "typescript-3-1", title: "TypeScript 3.1" },
      { id: "typescript-3-0", title: "TypeScript 3.0" },
      { id: "typescript-2-9", title: "TypeScript 2.9" },
      { id: "typescript-2-8", title: "TypeScript 2.8" },
      { id: "typescript-2-7", title: "TypeScript 2.7" },
      { id: "typescript-2-6", title: "TypeScript 2.6" },
      { id: "typescript-2-5", title: "TypeScript 2.5" },
      { id: "typescript-2-4", title: "TypeScript 2.4" },
      { id: "typescript-2-3", title: "TypeScript 2.3" },
      { id: "typescript-2-2", title: "TypeScript 2.2" },
      { id: "typescript-2-1", title: "TypeScript 2.1" },
      { id: "typescript-2-0", title: "TypeScript 2.0" },
      { id: "typescript-1-8", title: "TypeScript 1.8" },
      { id: "typescript-1-7", title: "TypeScript 1.7" },
      { id: "typescript-1-6", title: "TypeScript 1.6" },
      { id: "typescript-1-5", title: "TypeScript 1.5" },
      { id: "typescript-1-4", title: "TypeScript 1.4" },
      { id: "typescript-1-3", title: "TypeScript 1.3" },
      { id: "typescript-1-1", title: "TypeScript 1.1" },
    ],
  },

  {
    title: "Declaration Files",
    id: "declaration-files",
    summary:
      "Learn how to write declaration files to describe existing JavaScript.",
    directory: "handbook/declaration-files",
    index: "introduction",
    chronological: true,
    items: [
      { id: "introduction", title: "Introduction" },
      { id: "library-structures", title: "Library Structures" },
      {
        id: "global-plugin-d-ts",
        href:
          "/docs/handbook/declaration-files/templates/global-plugin-d-ts.html",
        title: "Template: Global Module",
      },
      {
        id: "global-modifying-module-d-ts",
        href:
          "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
        title: "Template: Global Extends",
      },
      {
        id: "module-d-ts",
        href: "/docs/handbook/declaration-files/templates/module-d-ts.html",
        title: "Template: Module",
      },
      {
        id: "module-plugin-d-ts",
        href:
          "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
        title: "Template: Plugin",
      },
      {
        id: "module-class-d-ts",
        href:
          "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
        title: "Template: Class",
      },
      {
        id: "module-function-d-ts",
        href:
          "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
        title: "Template: Function",
      },
      { id: "by-example", title: "By Example" },
      { id: "do-s-and-don-ts", title: "Do's and Don'ts" },
      { id: "dts-from-js", title: "DTS files from JS files" },
      { id: "deep-dive", title: "Deep Dive" },
      { id: "templates", title: "Templates" },
      { id: "publishing", title: "Publishing" },
      { id: "consumption", title: "Consumption" },
    ],
  },
  {
    title: "Project Configuration",
    id: "project-config",
    summary: "Understand how TypeScript is configured.",
    directory: "handbook",
    index: "compiler-options",
    items: [
      {
        id: "project-references",
        href: "/tsconfig",
        title: "TSConfig Reference",
      },
      { id: "tsconfig-json", title: "The tsconfig.json" },
      { id: "compiler-options", title: "Options via the CLI" },
      { id: "project-references", title: "Project References" },
      {
        id: "compiler-options-in-msbuild",
        title: "Compiler Options in MSBuild",
      },
      {
        id: "integrating-with-build-tools",
        title: "Integrating with Build Tools",
      },
      { id: "configuring-watch", title: "Configuring Watch Mode" },
      { id: "nightly-builds", title: "Nightly Builds" },
    ],
  },
]

export function getNextPageID(currentID: string) {
  // prettier-ignore
  const section = handbookNavigation.find((nav) => nav.items.find((i) => i.id === currentID))
  if (!section) return undefined
  if (!section.chronological) return undefined

  const currentIndex = section.items.findIndex(i => i.id === currentID)
  const next = section.items[currentIndex + 1]
  if (next) {
    return {
      // prettier-ignore
      path: `/docs/${section.directory}/${next.href || next.id}.html`,
      ...section.items[currentIndex + 1],
    }
  }
}

export function getPreviousPageID(currentID: string) {
  const section = handbookNavigation.find(nav =>
    nav.items.find(i => i.id === currentID)
  )

  if (!section) return undefined
  if (!section.chronological) return undefined

  const currentIndex = section.items.findIndex(i => i.id === currentID)
  const prev = section.items[currentIndex - 1]

  if (prev) {
    return {
      // prettier-ignore
      path: `/docs/${section.directory}/${prev.href || prev.id}.html`,
      ...section.items[currentIndex - 1],
    }
  }
}
