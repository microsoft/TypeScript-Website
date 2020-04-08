import { NavItem } from "../components/layout/Sidebar"

export const oldHandbookNavigation: NavItem[] = [
  {
    title: "Get Started",
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
    id: "handbook",
    directory: "handbook",
    chronological: true,
    index: "/",
    items: [
      { id: "index", title: "What is the Handbook?" },
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
      { id: "variable-declarations", title: "Variable Declarations" },
    ],
  },
  {
    title: "Tutorials",
    id: "tutorials",
    directory: "handbook",
    index: "typescript-in-5-minutes",
    items: [
      { id: "asp-net-core", title: "ASP.NET Core" },
      { id: "gulp", title: "Gulp" },
      { id: "migrating-from-javascript", title: "Migrating from JavaScript" },
      { id: "react-&-webpack", title: "React & Webpack" },
      { id: "dom-manipulation", title: "TypeScript & the DOM" },
    ],
  },
  {
    title: "What's New",
    id: "whats-new",
    directory: "handbook/release-notes",
    index: "overview",
    items: [
      { id: "overview", title: "Overview" },
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
    directory: "handbook/declaration-files",
    index: "introduction",
    chronological: true,
    items: [
      { id: "introduction", title: "Introduction" },
      { id: "library-structures", title: "Library Structures" },
      { id: "by-example", title: "By Example" },
      { id: "do-s-and-don-ts", title: "Do's and Don'ts" },
      { id: "deep-dive", title: "Deep Dive" },
      { id: "templates", title: "Templates" },
      { id: "publishing", title: "Publishing" },
      { id: "consumption", title: "Consumption" },
    ],
  },
  {
    title: "Project Configuration",
    id: "project-config",
    directory: "handbook",
    index: "compiler-options",
    items: [
      { id: "tsconfig-json", title: "tsconfig.json" },
      { id: "compiler-options", title: "Compiler Options" },
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
  const section = oldHandbookNavigation.find((nav) => nav.items.find((i) => i.id === currentID))
  if (!section) return undefined
  if (!section.chronological) return undefined

  const currentIndex = section.items.findIndex((i) => i.id === currentID)
  if (section.items[currentIndex + 1]) {
    return {
      // prettier-ignore
      path: `/docs/${section.directory}/${section.items[currentIndex + 1].id}.html`,
      ...section.items[currentIndex + 1],
    }
  }
}

export function getPreviousPageID(currentID: string) {
  const section = oldHandbookNavigation.find((nav) =>
    nav.items.find((i) => i.id === currentID)
  )

  if (!section) return undefined
  if (!section.chronological) return undefined

  const currentIndex = section.items.findIndex((i) => i.id === currentID)
  if (section.items[currentIndex - 1]) {
    return {
      // prettier-ignore
      path: `/docs/${section.directory}/${section.items[currentIndex - 1].id}.html`,
      ...section.items[currentIndex - 1],
    }
  }
}
