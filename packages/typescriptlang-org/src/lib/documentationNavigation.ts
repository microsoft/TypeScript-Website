/* This function is completely auto-generated via the `yarn bootstrap` phase of
   the app. You can re-run it when adding new localized handbook pages by running:

   yarn workspace documentation create-handbook-nav

   Find the source of truth at packages/documentation/scripts/generateDocsNavigationPerLanguage.js
*/

export interface SidebarNavItem {
  title: string;
  id: string;
  permalink?: string;
  chronological?: boolean;
  oneline?: string;
  items?: SidebarNavItem[];
}

/** ---INSERT--- */

export function getDocumentationNavForLanguage(
  langRequest: string
): SidebarNavItem[] {
  const langs = ["en", "id", "ja", "ko", "pl", "pt", "vo", "zh"];
  const lang = langs.includes(langRequest) ? langRequest : "en";
  const navigations: Record<string, SidebarNavItem[]> = {};

  navigations.en = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "0-typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators and Generators",
          id: "2-iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "3-dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "3-using-babel-with-typescript",
          permalink: "/docs/handbook/babel-with-typescript.html",
          oneline: "How to create a hybrid Babel + TypeScript project",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "JS Projects Utilizing TypeScript",
          id: "6-js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "6-type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "6-jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "6-creating-.d.ts-files-from-.js-files",
          permalink: "/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "How to add d.ts generation to JavaScript projects",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "7-configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "Nightly Builds",
          id: "7-nightly-builds",
          permalink: "/docs/handbook/nightly-builds.html",
          oneline: "How to use a nightly build of TypeScript",
        },
      ],
    },
  ];
  navigations.id = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling dalam 5 menit",
          id: "0-typescript-tooling-dalam-5-menit",
          permalink: "/id/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "Sebuah tutorial untuk memahami cara membuat situs web kecil dengan TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/id/docs/handbook/decorators.html",
          oneline: "Ringkasan Dekorator TypeScript",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators dan Generators",
          id: "2-iterators-dan-generators",
          permalink: "/id/docs/handbook/iterators-and-generators.html",
          oneline: "Bagaimana Iterator dan Generator bekerja di TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/id/docs/handbook/jsx.html",
          oneline: "Menggunakan JSX dengan TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/id/docs/handbook/mixins.html",
          oneline: "Menggunakan pola mixin dengan TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/id/docs/handbook/symbols.html",
          oneline: "Menggunakan Simbol JavaScript primitif di TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "Manipulasi DOM",
          id: "3-manipulasi-dom",
          permalink: "/id/docs/handbook/dom-manipulation.html",
          oneline: "Menggunakan DOM dengan TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Menggunakan Babel dengan TypeScript",
          id: "3-menggunakan-babel-dengan-typescript",
          permalink: "/id/docs/handbook/babel-with-typescript.html",
          oneline: "Cara membuat proyek hybrid Babel + TypeScript",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "Memanfaatkan Typescript pada Proyek JS",
          id: "6-memanfaatkan-typescript-pada-proyek-js",
          permalink: "/id/docs/handbook/intro-to-js-ts.html",
          oneline:
            "Cara menambahkan pemeriksaan tipe data pada berkas JavaScript menggunakan TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "6-type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Referensi JSDoc",
          id: "6-referensi-jsdoc",
          permalink: "/id/docs/handbook/jsdoc-supported-types.html",
          oneline: "JSDoc apa yang didukung JavaScript dan TypeScript?",
        },
        {
          title: "Membuat Berkas .d.ts dari berkas .js",
          id: "6-membuat-berkas-.d.ts-dari-berkas-.js",
          permalink: "/id/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "Bagaimana cara menambahkan hasil d.ts ke proyek JavaScript",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Mengkonfigurasi Watch",
          id: "7-mengkonfigurasi-watch",
          permalink: "/id/docs/handbook/configuring-watch.html",
          oneline: "Cara mengkonfigurasi mode watch TypeScript",
        },
        {
          title: "Nightly Builds",
          id: "7-nightly-builds",
          permalink: "/id/docs/handbook/nightly-builds.html",
          oneline: "Cara menggunakan nightly build TypeScript",
        },
      ],
    },
  ];
  navigations.ja = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "0-typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators and Generators",
          id: "2-iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "3-dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "3-using-babel-with-typescript",
          permalink: "/docs/handbook/babel-with-typescript.html",
          oneline: "How to create a hybrid Babel + TypeScript project",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "TypeScriptを活用したJSプロジェクト",
          id: "6-typescriptを活用したjsプロジェクト",
          permalink: "/ja/docs/handbook/intro-to-js-ts.html",
          oneline:
            "TypeScriptを使ってJavaScriptファイルに型チェックを追加する方法",
        },
        {
          title: "JavaScriptファイルの型チェック",
          id: "6-javascriptファイルの型チェック",
          permalink: "/ja/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "TypeScriptを使ってJavaScriptファイルに型チェックを追加する方法",
        },
        {
          title: "JSDocリファレンス",
          id: "6-jsdocリファレンス",
          permalink: "/ja/docs/handbook/jsdoc-supported-types.html",
          oneline:
            "TypeScriptを備えたJavaScriptはどのようなJSDocをサポートしているか",
        },
        {
          title: ".jsファイルから.d.tsファイルを生成する",
          id: "6-.jsファイルから.d.tsファイルを生成する",
          permalink: "/ja/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "JavaScriptプロジェクトでd.tsファイルを生成する方法",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "7-configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "ナイトリービルド",
          id: "7-ナイトリービルド",
          permalink: "/ja/docs/handbook/nightly-builds.html",
          oneline: "TypeScriptのナイトリービルドを使うには",
        },
      ],
    },
  ];
  navigations.ko = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "0-typescript-tooling-in-5-minutes",
          permalink: "/ko/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/ko/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/ko/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators and Generators",
          id: "2-iterators-and-generators",
          permalink: "/ko/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/ko/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/ko/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/ko/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/ko/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "3-dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "3-using-babel-with-typescript",
          permalink: "/ko/docs/handbook/babel-with-typescript.html",
          oneline: "How to create a hybrid Babel + TypeScript project",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "JS Projects Utilizing TypeScript",
          id: "6-js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "6-type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "6-jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "6-creating-.d.ts-files-from-.js-files",
          permalink: "/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "How to add d.ts generation to JavaScript projects",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "7-configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "Nightly Builds",
          id: "7-nightly-builds",
          permalink: "/docs/handbook/nightly-builds.html",
          oneline: "How to use a nightly build of TypeScript",
        },
      ],
    },
  ];
  navigations.pl = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "0-typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "Przewodnik po TypeScript",
          id: "1-przewodnik-po-typescript",
          permalink: "/pl/docs/handbook/intro.html",
          oneline: "Twoje pierwsze kroki w nauce TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators and Generators",
          id: "2-iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "3-dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "3-using-babel-with-typescript",
          permalink: "/docs/handbook/babel-with-typescript.html",
          oneline: "How to create a hybrid Babel + TypeScript project",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "JS Projects Utilizing TypeScript",
          id: "6-js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "6-type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "6-jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "6-creating-.d.ts-files-from-.js-files",
          permalink: "/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "How to add d.ts generation to JavaScript projects",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "7-configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "Nocna kompilacja",
          id: "7-nocna-kompilacja",
          permalink: "/pl//docs/handbook/nightly-builds.html",
          oneline: "Jak korzystać z nocnej kompilacji języka TypeScript",
        },
      ],
    },
  ];
  navigations.pt = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "Ferramentas TypeScript em 5 minutos",
          id: "0-ferramentas-typescript-em-5-minutos",
          permalink: "/pt/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "Um tutorial para entender como criar um pequeno site com TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Tipos Utilitários",
          id: "2-tipos-utilitários",
          permalink: "/pt/docs/handbook/utility-types.html",
          oneline: "Tipos que são inclusos globalmente em TypeScript",
        },
        {
          title: "Decoradores",
          id: "2-decoradores",
          permalink: "/pt/docs/handbook/Decorators.html",
          oneline: "Visão geral dos Decoradores no TypeScript",
        },
        {
          title: "Fusão de Declarações",
          id: "2-fusão-de-declarações",
          permalink: "/pt/docs/handbook/declaration-merging.html",
          oneline: "Como a fusão de namespaces e interfaces funciona",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iteradores e Geradores",
          id: "2-iteradores-e-geradores",
          permalink: "/pt/docs/handbook/iterators-and-generators.html",
          oneline: "Como os Iteradores e Geradores funcionam no TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/pt/docs/handbook/jsx.html",
          oneline: "Utilizando JSX com TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/pt/docs/handbook/mixins.html",
          oneline: "Usando o padrão Mixin com TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/pt/docs/handbook/modules.html",
          oneline: "Como módulos funcionam no TypeScript",
        },
        {
          title: "Resolução de módulos",
          id: "2-resolução-de-módulos",
          permalink: "/pt/docs/handbook/module-resolution.html",
          oneline: "Como o TypeScript resolve módulos em JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/pt/docs/handbook/namespaces.html",
          oneline: "Como funcionam os Namespaces no TypeScript",
        },
        {
          title: "Namespaces e Módulos",
          id: "2-namespaces-e-módulos",
          permalink: "/pt/docs/handbook/namespaces-and-modules.html",
          oneline:
            "Como organizar o código em TypeScript através de módulos ou namespaces",
        },
        {
          title: "Símbolos (Symbols)",
          id: "2-símbolos-(symbols)",
          permalink: "/pt/docs/handbook/symbols.html",
          oneline: "Usando o símbolo primitivo do JavaScript no TypeScript",
        },
        {
          title: "Diretivas de barra tripla",
          id: "2-diretivas-de-barra-tripla",
          permalink: "/pt/docs/handbook/triple-slash-directives.html",
          oneline: "Como usar diretivas de barra tripla no TypeScript",
        },
        {
          title: "Compatibilidade de Tipos",
          id: "2-compatibilidade-de-tipos",
          permalink: "/pt/docs/handbook/type-compatibility.html",
          oneline: "Como checagem de tipos funciona em TypeScript",
        },
        {
          title: "Inferência de Tipo",
          id: "2-inferência-de-tipo",
          permalink: "/pt/docs/handbook/type-inference.html",
          oneline: "Como a analise do fluxo de código funciona em TypeScript",
        },
        {
          title: "Declarações de variáveis",
          id: "2-declarações-de-variáveis",
          permalink: "/pt/docs/handbook/variable-declarations.html",
          oneline: "Como TypeScript lida com declarações de variáveis",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "Manipulação do DOM",
          id: "3-manipulação-do-dom",
          permalink: "/pt/docs/handbook/manipulacao-dom.html",
          oneline: "Usando o DOM com TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Usando Babel com TypeScript",
          id: "3-usando-babel-com-typescript",
          permalink: "/pt/docs/handbook/babel-with-typescript.html",
          oneline: "Como criar um projeto híbrido com Babel + TypeScript",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "Projetos JS utilizando TypeScript",
          id: "6-projetos-js-utilizando-typescript",
          permalink: "/pt/docs/handbook/intro-to-js-ts.html",
          oneline:
            "Como adicionar verificação de tipo a arquivos JavaScript usando TypeScript",
        },
        {
          title: "Checando tipos de arquivos JavaScript",
          id: "6-checando-tipos-de-arquivos-javascript",
          permalink: "/pt/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "Como adicionar checagem de tipos a arquivos JavaScript usando Typescript",
        },
        {
          title: "Referência JSDoc",
          id: "6-referência-jsdoc",
          permalink: "/pt/docs/handbook/jsdoc-supported-types.html",
          oneline: "Quais JSDoc Javascript baseado em Typescript suporta?",
        },
        {
          title: "Criação de arquivos .d.ts a partir de arquivos .js",
          id: "6-criação-de-arquivos-.d.ts-a-partir-de-arquivos-.js",
          permalink: "/pt/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "Como adicionar geração d.ts a projetos JavaScript",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "tsconfig.json",
          id: "7-tsconfig.json",
          permalink: "/pt/docs/handbook/tsconfig-json.html",
          oneline: "Aprenda sobre como o TSConfig funciona",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Referência de Projeto",
          id: "7-referência-de-projeto",
          permalink: "/pt/docs/handbook/project-references.html",
          oneline: "Como dividir um projeto Typescript grande",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configurando Watch",
          id: "7-configurando-watch",
          permalink: "/pt/docs/handbook/configuring-watch.html",
          oneline: "Como configurar o modo de observação do Typescript",
        },
        {
          title: "Compilação Noturna",
          id: "7-compilação-noturna",
          permalink: "/pt/docs/handbook/nightly-builds.html",
          oneline: "Como usar uma compilação noturna de TypeScript",
        },
      ],
    },
  ];
  navigations.vo = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "0-typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators and Generators",
          id: "2-iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "3-dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "3-using-babel-with-typescript",
          permalink: "/docs/handbook/babel-with-typescript.html",
          oneline: "How to create a hybrid Babel + TypeScript project",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "JS Projects Utilizing TypeScript",
          id: "6-js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "6-type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "6-jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "6-creating-.d.ts-files-from-.js-files",
          permalink: "/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "How to add d.ts generation to JavaScript projects",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "7-configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "Nightly Builds",
          id: "7-nightly-builds",
          permalink: "/docs/handbook/nightly-builds.html",
          oneline: "How to use a nightly build of TypeScript",
        },
      ],
    },
  ];
  navigations.zh = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "0-typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "0-typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "0-typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "0-typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "0-typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A great first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "1-the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "The Basics",
          id: "1-the-basics",
          permalink: "/docs/handbook/2/basic-types.html",
          oneline: "Step one in learning TypeScript: The basic types.",
        },
        {
          title: "Everyday Types",
          id: "1-everyday-types",
          permalink: "/docs/handbook/2/everyday-types.html",
          oneline: "The language primitives.",
        },
        {
          title: "Narrowing",
          id: "1-narrowing",
          permalink: "/docs/handbook/2/narrowing.html",
          oneline:
            "Understand how TypeScript uses JavaScript knowledge to reduce the amount of type syntax in your projects.",
        },
        {
          title: "More on Functions",
          id: "1-more-on-functions",
          permalink: "/docs/handbook/2/functions.html",
          oneline: "Learn about how Functions work in TypeScript.",
        },
        {
          title: "Object Types",
          id: "1-object-types",
          permalink: "/docs/handbook/2/objects.html",
          oneline: "How TypeScript describes the shapes of JavaScript objects.",
        },
        {
          title: "Type Manipulation",
          id: "1-type-manipulation",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Creating Types from Types",
              id: "1-creating-types-from-types",
              permalink: "/docs/handbook/2/types-from-types.html",
              oneline:
                "An overview of the ways in which you can create more types from existing types.",
            },
            {
              title: "Generics",
              id: "1-generics",
              permalink: "/docs/handbook/2/generics.html",
              oneline: "Types which take parameters",
            },
            {
              title: "Keyof Type Operator",
              id: "1-keyof-type-operator",
              permalink: "/docs/handbook/2/keyof-types.html",
              oneline: "Using the keyof operator in type contexts.",
            },
            {
              title: "Typeof Type Operator",
              id: "1-typeof-type-operator",
              permalink: "/docs/handbook/2/typeof-types.html",
              oneline: "Using the typeof operator in type contexts.",
            },
            {
              title: "Indexed Access Types",
              id: "1-indexed-access-types",
              permalink: "/docs/handbook/2/indexed-access-types.html",
              oneline: "Using Type['a'] syntax to access a subset of a type.",
            },
            {
              title: "Conditional Types",
              id: "1-conditional-types",
              permalink: "/docs/handbook/2/conditional-types.html",
              oneline:
                "Create types which act like if statements in the type system.",
            },
            {
              title: "Mapped Types",
              id: "1-mapped-types",
              permalink: "/docs/handbook/2/mapped-types.html",
              oneline: "Generating types by re-using an existing type.",
            },
            {
              title: "Template Literal Types",
              id: "1-template-literal-types",
              permalink: "/docs/handbook/2/template-literal-types.html",
              oneline:
                "Generating mapping types which change properties via template literal strings.",
            },
          ],
        },
        {
          title: "Classes",
          id: "1-classes",
          permalink: "/docs/handbook/2/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Modules",
          id: "1-modules",
          permalink: "/docs/handbook/2/modules.html",
          oneline:
            "How JavaScript handles communicating across file boundaries.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Deep dive reference materials.",
      id: "reference",
      chronological: false,

      items: [
        {
          title: "Utility Types",
          id: "2-utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "2-decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "2-declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Enums",
          id: "2-enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Iterators and Generators",
          id: "2-iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "2-jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "2-mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "2-modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "2-module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "2-namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "2-namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "2-symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "2-triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScript",
        },
        {
          title: "Type Compatibility",
          id: "2-type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "2-type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "2-variable-declaration",
          permalink: "/docs/handbook/variable-declarations.html",
          oneline: "How TypeScript handles variable declaration",
        },
      ],
    },
    {
      title: "Tutorials",
      oneline: "Using TypeScript in several environments.",
      id: "tutorials",
      chronological: false,

      items: [
        {
          title: "ASP.NET Core",
          id: "3-asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "3-gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "3-dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "3-migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "3-using-babel-with-typescript",
          permalink: "/docs/handbook/babel-with-typescript.html",
          oneline: "How to create a hybrid Babel + TypeScript project",
        },
      ],
    },
    {
      title: "What's New",
      oneline:
        "Find out how TypeScript has evolved and what's new in the releases.",
      id: "what's-new",
      chronological: false,

      items: [
        {
          title: "Overview",
          id: "4-overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 4.4",
          id: "4-typescript-4.4",
          permalink: "/docs/handbook/release-notes/typescript-4-4.html",
          oneline: "TypeScript 4.4 Release Notes",
        },
        {
          title: "TypeScript 4.3",
          id: "4-typescript-4.3",
          permalink: "/docs/handbook/release-notes/typescript-4-3.html",
          oneline: "TypeScript 4.3 Release Notes",
        },
        {
          title: "TypeScript 4.2",
          id: "4-typescript-4.2",
          permalink: "/docs/handbook/release-notes/typescript-4-2.html",
          oneline: "TypeScript 4.2 Release Notes",
        },
        {
          title: "TypeScript 4.1",
          id: "4-typescript-4.1",
          permalink: "/docs/handbook/release-notes/typescript-4-1.html",
          oneline: "TypeScript 4.1 Release Notes",
        },
        {
          title: "TypeScript 4.0",
          id: "4-typescript-4.0",
          permalink: "/docs/handbook/release-notes/typescript-4-0.html",
          oneline: "TypeScript 4.0 Release Notes",
        },
        {
          title: "TypeScript 3.9",
          id: "4-typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "4-typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "4-typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "4-typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "4-typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "4-typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "4-typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "4-typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "4-typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "4-typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "4-typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "4-typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "4-typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "4-typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "4-typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "4-typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "4-typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "4-typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "4-typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "4-typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "4-typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "4-typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "4-typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "4-typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "4-typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "4-typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "4-typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
      ],
    },
    {
      title: "Declaration Files",
      oneline:
        "Learn how to write declaration files to describe existing JavaScript. Important for DefinitelyTyped contributions.",
      id: "declaration-files",
      chronological: true,

      items: [
        {
          title: "Introduction",
          id: "5-introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Declaration (d.ts) file",
        },
        {
          title: "Declaration Reference",
          id: "5-declaration-reference",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Library Structures",
          id: "5-library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: "5-.d.ts-templates",
          oneline: "undefined",
          chronological: false,

          items: [
            {
              title: "Modules .d.ts",
              id: "5-modules-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Plugin",
              id: "5-module:-plugin",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Class",
              id: "5-module:-class",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Module: Function",
              id: "5-module:-function",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global .d.ts",
              id: "5-global-.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "Global: Modifying Module",
              id: "5-global:-modifying-module",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Do's and Don'ts",
          id: "5-do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "5-deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Publishing",
          id: "5-publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "5-consumption",
          permalink: "/docs/handbook/declaration-files/consumption.html",
          oneline: "How to download d.ts files for your project",
        },
      ],
    },
    {
      title: "JavaScript",
      oneline: "How to use TypeScript-powered JavaScript tooling.",
      id: "javascript",
      chronological: true,

      items: [
        {
          title: "JS Projects Utilizing TypeScript",
          id: "6-js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "6-type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "6-jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "6-creating-.d.ts-files-from-.js-files",
          permalink: "/docs/handbook/declaration-files/dts-from-js.html",
          oneline: "How to add d.ts generation to JavaScript projects",
        },
      ],
    },
    {
      title: "Project Configuration",
      oneline: "Compiler configuration reference.",
      id: "project-configuration",
      chronological: false,

      items: [
        {
          title: "What is a tsconfig.json",
          id: "7-what-is-a-tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "7-compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "TSConfig Reference",
          id: "7-tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsc CLI Options",
          id: "7-tsc-cli-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the CLI compiler options for tsc",
        },
        {
          title: "Project References",
          id: "7-project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Integrating with Build Tools",
          id: "7-integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "7-configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "每日构建",
          id: "7-每日构建",
          permalink: "/zh/docs/handbook/nightly-builds.html",
          oneline: "如何使用TypeScript的每日构建版本",
        },
      ],
    },
  ];

  return navigations[lang];
}

/** ---INSERT-END--- */

const findInNav = (
  item: SidebarNavItem | SidebarNavItem[],
  fun: (item: SidebarNavItem) => boolean
): SidebarNavItem | undefined => {
  if (Array.isArray(item)) {
    for (const subItem of item) {
      const sub = findInNav(subItem, fun);
      if (sub) return sub;
    }
  } else {
    if (fun(item)) return item;
    if (!item.items) return undefined;
    for (const subItem of item.items) {
      const sub = findInNav(subItem, fun);
      if (sub) return sub;
    }
    return undefined;
  }
};

export function getNextPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false
  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const next = section.items[currentIndex + 1];
  if (next) {
    if (next.items) {
      return {
        path: next.items[0].permalink,
        ...section.items[currentIndex + 1],
      };
    } else {
      return {
        path: next.permalink,
        ...section.items[currentIndex + 1],
      };
    }
  }
}

export function getPreviousPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false

  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const prev = section.items[currentIndex - 1];

  if (prev) {
    return {
      path: prev.permalink,
      ...section.items[currentIndex - 1],
    };
  }
}
