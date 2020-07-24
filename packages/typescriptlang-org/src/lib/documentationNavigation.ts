/* This function is completely auto-generated via the `yarn bootstrap` phase of
   the app. You can re-run it when adding new localized handbook pages by running:

   yarn workspace documentation create-handbook-nav

   Find the source of truth at packages/documentation/scripts/generateDocsNavigationPerLanguage.js
*/

export interface NewNavItem {
  title: string;
  id: string;
  permalink?: string;
  chronological?: boolean;
  oneline?: string;
  items?: NewNavItem[];
}

/** ---INSERT--- */

export function getDocumentationNavForLanguage(
  langRequest: string
): NewNavItem[] {
  const langs = ["en", "vo"];
  const lang = langs.includes(langRequest) ? langRequest : "en";
  const navigations: Record<string, NewNavItem[]> = {};

  navigations.en = [
    {
      title: "Get Started",
      oneline: "Quick introductions based on your background or preference.",
      id: "get-started",
      chronological: false,

      items: [
        {
          title: "TS for the New Programmer",
          id: "typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A good first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "Basic Types",
          id: "basic-types",
          permalink: "/docs/handbook/basic-types.html",
          oneline: "Step one in learning TypeScript: The basics types.",
        },
        {
          title: "Interfaces",
          id: "interfaces",
          permalink: "/docs/handbook/interfaces.html",
          oneline: "How to write an interface with TypeScript",
        },
        {
          title: "Functions",
          id: "functions",
          permalink: "/docs/handbook/functions.html",
          oneline: "How to add types to a function",
        },
        {
          title: "Literal Types",
          id: "literal-types",
          permalink: "/docs/handbook/literal-types.html",
          oneline: "Using literal types with TypeScript",
        },
        {
          title: "Unions and Intersection Types",
          id: "unions-and-intersection-types",
          permalink: "/docs/handbook/unions-and-intersections.html",
          oneline: "How to use unions and intersection types in TypeScript",
        },
        {
          title: "Classes",
          id: "classes",
          permalink: "/docs/handbook/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Enums",
          id: "enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Generics",
          id: "generics",
          permalink: "/docs/handbook/generics.html",
          oneline: "Introduction to TypeScript and Generics",
        },
      ],
    },
    {
      title: "Handbook Reference",
      oneline: "Deep dive reference materials.",
      id: "handbook-reference",
      chronological: false,

      items: [
        {
          title: "Advanced Types",
          id: "advanced-types",
          permalink: "/docs/handbook/advanced-types.html",
          oneline: "Advanced concepts around types in TypeScript",
        },
        {
          title: "Utility Types",
          id: "utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Iterators and Generators",
          id: "iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScripit",
        },
        {
          title: "Type Compatibility",
          id: "type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "variable-declaration",
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
          id: "asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "using-babel-with-typescript",
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
          id: "overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 3.9",
          id: "typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
        {
          title: "Overview",
          id: "overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
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
          id: "introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Ddeclaration (d.ts) file",
        },
        {
          title: "By Example",
          id: "by-example",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Do's and Don'ts",
          id: "do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Library Structures",
          id: "library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: ".d.ts-templates",
          oneline: "undefined",

          items: [
            {
              title: "global.d.ts",
              id: "global.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "global-modifying-module.d.ts",
              id: "global-modifying-module.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module.d.ts",
              id: "module.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module-plugin.d.ts",
              id: "module-plugin.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module-class.d.ts",
              id: "module-class.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module-function.d.ts",
              id: "module-function.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Publishing",
          id: "publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "consumption",
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
          id: "js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "creating-.d.ts-files-from-.js-files",
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
          title: "TSConfig Reference",
          id: "tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsconfig.json",
          id: "tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options",
          id: "compiler-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the compiler options in TypeScript",
        },
        {
          title: "Project References",
          id: "project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "Integrating with Build Tools",
          id: "integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "Nightly Builds",
          id: "nightly-builds",
          permalink: "/docs/handbook/nightly-builds.html",
          oneline: "How to use a nightly build of TypeScript",
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
          id: "typescript-for-the-new-programmer",
          permalink: "/docs/handbook/typescript-from-scratch.html",
          oneline: "Learn TypeScript from scratch",
        },
        {
          title: "TypeScript for JS Programmers",
          id: "typescript-for-javascript-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes.html",
          oneline: "Learn how TypeScript extends JavaScript",
        },
        {
          title: "TS for Java/C# Programmers",
          id: "typescript-for-java/c#-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-oop.html",
          oneline:
            "Learn TypeScript if you have a background in object-oriented languages",
        },
        {
          title: "TS for Functional Programmers",
          id: "typescript-for-functional-programmers",
          permalink: "/docs/handbook/typescript-in-5-minutes-func.html",
          oneline:
            "Learn TypeScript if you have a background in functional programming",
        },
        {
          title: "TypeScript Tooling in 5 minutes",
          id: "typescript-tooling-in-5-minutes",
          permalink: "/docs/handbook/typescript-tooling-in-5-minutes.html",
          oneline:
            "A tutorial to understand how to create a small website with TypeScript",
        },
      ],
    },
    {
      title: "Handbook",
      oneline: "A good first read for your daily TS work.",
      id: "handbook",
      chronological: true,

      items: [
        {
          title: "The TypeScript Handbook",
          id: "the-typescript-handbook",
          permalink: "/docs/handbook/intro.html",
          oneline: "Your first step to learn TypeScript",
        },
        {
          title: "B4s1c Typ3s",
          id: "b4s1c-typ3s",
          permalink: "/vo/docs/handbook/basic-types.html",
          oneline: "5tep on3 in learning 7ype5cript: The basics types.",
        },
        {
          title: "Interfaces",
          id: "interfaces",
          permalink: "/docs/handbook/interfaces.html",
          oneline: "How to write an interface with TypeScript",
        },
        {
          title: "Functions",
          id: "functions",
          permalink: "/docs/handbook/functions.html",
          oneline: "How to add types to a function",
        },
        {
          title: "Literal Types",
          id: "literal-types",
          permalink: "/docs/handbook/literal-types.html",
          oneline: "Using literal types with TypeScript",
        },
        {
          title: "Unions and Intersection Types",
          id: "unions-and-intersection-types",
          permalink: "/docs/handbook/unions-and-intersections.html",
          oneline: "How to use unions and intersection types in TypeScript",
        },
        {
          title: "Classes",
          id: "classes",
          permalink: "/docs/handbook/classes.html",
          oneline: "How classes work in TypeScript",
        },
        {
          title: "Enums",
          id: "enums",
          permalink: "/docs/handbook/enums.html",
          oneline: "How TypeScript enums work",
        },
        {
          title: "Generics",
          id: "generics",
          permalink: "/docs/handbook/generics.html",
          oneline: "Introduction to TypeScript and Generics",
        },
      ],
    },
    {
      title: "Handbook Reference",
      oneline: "Deep dive reference materials.",
      id: "handbook-reference",
      chronological: false,

      items: [
        {
          title: "Advanced Types",
          id: "advanced-types",
          permalink: "/docs/handbook/advanced-types.html",
          oneline: "Advanced concepts around types in TypeScript",
        },
        {
          title: "Utility Types",
          id: "utility-types",
          permalink: "/docs/handbook/utility-types.html",
          oneline: "Types which are globally included in TypeScript",
        },
        {
          title: "Decorators",
          id: "decorators",
          permalink: "/docs/handbook/decorators.html",
          oneline: "TypeScript Decorators overview",
        },
        {
          title: "Declaration Merging",
          id: "declaration-merging",
          permalink: "/docs/handbook/declaration-merging.html",
          oneline: "How merging namespaces and interfaces works",
        },
        {
          title: "Iterators and Generators",
          id: "iterators-and-generators",
          permalink: "/docs/handbook/iterators-and-generators.html",
          oneline: "How Iterators and Generators work in TypeScript",
        },
        {
          title: "JSX",
          id: "jsx",
          permalink: "/docs/handbook/jsx.html",
          oneline: "Using JSX with TypeScript",
        },
        {
          title: "Mixins",
          id: "mixins",
          permalink: "/docs/handbook/mixins.html",
          oneline: "Using the mixin pattern with TypeScript",
        },
        {
          title: "Modules",
          id: "modules",
          permalink: "/docs/handbook/modules.html",
          oneline: "How modules work in TypeScript",
        },
        {
          title: "Module Resolution",
          id: "module-resolution",
          permalink: "/docs/handbook/module-resolution.html",
          oneline: "How TypeScript resolves modules in JavaScript",
        },
        {
          title: "Namespaces",
          id: "namespaces",
          permalink: "/docs/handbook/namespaces.html",
          oneline: "How TypeScript namespaces work",
        },
        {
          title: "Namespaces and Modules",
          id: "namespaces-and-modules",
          permalink: "/docs/handbook/namespaces-and-modules.html",
          oneline:
            "How to organize code in TypeScript via modules or namespaces",
        },
        {
          title: "Symbols",
          id: "symbols",
          permalink: "/docs/handbook/symbols.html",
          oneline: "Using the JavaScript Symbol primitive in TypeScript",
        },
        {
          title: "Triple-Slash Directives",
          id: "triple-slash-directives",
          permalink: "/docs/handbook/triple-slash-directives.html",
          oneline: "How to use triple slash directives in TypeScripit",
        },
        {
          title: "Type Compatibility",
          id: "type-compatibility",
          permalink: "/docs/handbook/type-compatibility.html",
          oneline: "How type-checking works in TypeScript",
        },
        {
          title: "Type Inference",
          id: "type-inference",
          permalink: "/docs/handbook/type-inference.html",
          oneline: "How code flow analysis works in TypeScript",
        },
        {
          title: "Variable Declaration",
          id: "variable-declaration",
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
          id: "asp.net-core",
          permalink: "/docs/handbook/asp-net-core.html",
          oneline: "Using TypeScript in ASP.NET Core",
        },
        {
          title: "Gulp",
          id: "gulp",
          permalink: "/docs/handbook/gulp.html",
          oneline: "Using TypeScript with Gulp",
        },
        {
          title: "DOM Manipulation",
          id: "dom-manipulation",
          permalink: "/docs/handbook/dom-manipulation.html",
          oneline: "Using the DOM with TypeScript",
        },
        {
          title: "Migrating from JavaScript",
          id: "migrating-from-javascript",
          permalink: "/docs/handbook/migrating-from-javascript.html",
          oneline: "How to migrate from JavaScript to TypeScript",
        },
        {
          title: "Using Babel with TypeScript",
          id: "using-babel-with-typescript",
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
          id: "overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
        },
        {
          title: "TypeScript 3.9",
          id: "typescript-3.9",
          permalink: "/docs/handbook/release-notes/typescript-3-9.html",
          oneline: "TypeScript 3.9 Release Notes",
        },
        {
          title: "TypeScript 3.8",
          id: "typescript-3.8",
          permalink: "/docs/handbook/release-notes/typescript-3-8.html",
          oneline: "TypeScript 3.8 Release Notes",
        },
        {
          title: "TypeScript 3.7",
          id: "typescript-3.7",
          permalink: "/docs/handbook/release-notes/typescript-3-7.html",
          oneline: "TypeScript 3.7 Release Notes",
        },
        {
          title: "TypeScript 3.6",
          id: "typescript-3.6",
          permalink: "/docs/handbook/release-notes/typescript-3-6.html",
          oneline: "TypeScript 3.6 Release Notes",
        },
        {
          title: "TypeScript 3.5",
          id: "typescript-3.5",
          permalink: "/docs/handbook/release-notes/typescript-3-5.html",
          oneline: "TypeScript 3.5 Release Notes",
        },
        {
          title: "TypeScript 3.4",
          id: "typescript-3.4",
          permalink: "/docs/handbook/release-notes/typescript-3-4.html",
          oneline: "TypeScript 3.4 Release Notes",
        },
        {
          title: "TypeScript 3.3",
          id: "typescript-3.3",
          permalink: "/docs/handbook/release-notes/typescript-3-3.html",
          oneline: "TypeScript 3.3 Release Notes",
        },
        {
          title: "TypeScript 3.2",
          id: "typescript-3.2",
          permalink: "/docs/handbook/release-notes/typescript-3-2.html",
          oneline: "TypeScript 3.2 Release Notes",
        },
        {
          title: "TypeScript 3.1",
          id: "typescript-3.1",
          permalink: "/docs/handbook/release-notes/typescript-3-1.html",
          oneline: "TypeScript 3.1 Release Notes",
        },
        {
          title: "TypeScript 3.0",
          id: "typescript-3.0",
          permalink: "/docs/handbook/release-notes/typescript-3-0.html",
          oneline: "TypeScript 3.0 Release Notes",
        },
        {
          title: "TypeScript 2.9",
          id: "typescript-2.9",
          permalink: "/docs/handbook/release-notes/typescript-2-9.html",
          oneline: "TypeScript 2.9 Release Notes",
        },
        {
          title: "TypeScript 2.8",
          id: "typescript-2.8",
          permalink: "/docs/handbook/release-notes/typescript-2-8.html",
          oneline: "TypeScript 2.8 Release Notes",
        },
        {
          title: "TypeScript 2.7",
          id: "typescript-2.7",
          permalink: "/docs/handbook/release-notes/typescript-2-7.html",
          oneline: "TypeScript 2.7 Release Notes",
        },
        {
          title: "TypeScript 2.6",
          id: "typescript-2.6",
          permalink: "/docs/handbook/release-notes/typescript-2-6.html",
          oneline: "TypeScript 2.6 Release Notes",
        },
        {
          title: "TypeScript 2.5",
          id: "typescript-2.5",
          permalink: "/docs/handbook/release-notes/typescript-2-5.html",
          oneline: "TypeScript 2.5 Release Notes",
        },
        {
          title: "TypeScript 2.4",
          id: "typescript-2.4",
          permalink: "/docs/handbook/release-notes/typescript-2-4.html",
          oneline: "TypeScript 2.4 Release Notes",
        },
        {
          title: "TypeScript 2.3",
          id: "typescript-2.3",
          permalink: "/docs/handbook/release-notes/typescript-2-3.html",
          oneline: "TypeScript 2.3 Release Notes",
        },
        {
          title: "TypeScript 2.2",
          id: "typescript-2.2",
          permalink: "/docs/handbook/release-notes/typescript-2-2.html",
          oneline: "TypeScript 2.2 Release Notes",
        },
        {
          title: "TypeScript 2.1",
          id: "typescript-2.1",
          permalink: "/docs/handbook/release-notes/typescript-2-1.html",
          oneline: "TypeScript 2.1 Release Notes",
        },
        {
          title: "TypeScript 2.0",
          id: "typescript-2.0",
          permalink: "/docs/handbook/release-notes/typescript-2-0.html",
          oneline: "TypeScript 2.0 Release Notes",
        },
        {
          title: "TypeScript 1.8",
          id: "typescript-1.8",
          permalink: "/docs/handbook/release-notes/typescript-1-8.html",
          oneline: "TypeScript 1.8 Release Notes",
        },
        {
          title: "TypeScript 1.7",
          id: "typescript-1.7",
          permalink: "/docs/handbook/release-notes/typescript-1-7.html",
          oneline: "TypeScript 1.7 Release Notes",
        },
        {
          title: "TypeScript 1.6",
          id: "typescript-1.6",
          permalink: "/docs/handbook/release-notes/typescript-1-6.html",
          oneline: "TypeScript 1.6 Release Notes",
        },
        {
          title: "TypeScript 1.5",
          id: "typescript-1.5",
          permalink: "/docs/handbook/release-notes/typescript-1-5.html",
          oneline: "TypeScript 1.5 Release Notes",
        },
        {
          title: "TypeScript 1.4",
          id: "typescript-1.4",
          permalink: "/docs/handbook/release-notes/typescript-1-4.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.3",
          id: "typescript-1.3",
          permalink: "/docs/handbook/release-notes/typescript-1-3.html",
          oneline: "TypeScript 1.3 Release Notes",
        },
        {
          title: "TypeScript 1.1",
          id: "typescript-1.1",
          permalink: "/docs/handbook/release-notes/typescript-1-1.html",
          oneline: "TypeScript 1.1 Release Notes",
        },
        {
          title: "Overview",
          id: "overview",
          permalink: "/docs/handbook/release-notes/overview.html",
          oneline: "All TypeScript release notes",
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
          id: "introduction",
          permalink: "/docs/handbook/declaration-files/introduction.html",
          oneline:
            "How to write a high-quality TypeScript Ddeclaration (d.ts) file",
        },
        {
          title: "By Example",
          id: "by-example",
          permalink: "/docs/handbook/declaration-files/by-example.html",
          oneline: "How to create a d.ts file for a module",
        },
        {
          title: "Do's and Don'ts",
          id: "do's-and-don'ts",
          permalink: "/docs/handbook/declaration-files/do-s-and-don-ts.html",
          oneline: "Recommendations for writing d.ts files",
        },
        {
          title: "Deep Dive",
          id: "deep-dive",
          permalink: "/docs/handbook/declaration-files/deep-dive.html",
          oneline: "How do d.ts files work, a deep dive",
        },
        {
          title: "Library Structures",
          id: "library-structures",
          permalink: "/docs/handbook/declaration-files/library-structures.html",
          oneline: "How to structure your d.ts files",
        },
        {
          title: ".d.ts Templates",
          id: ".d.ts-templates",
          oneline: "undefined",

          items: [
            {
              title: "global.d.ts",
              id: "global.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "global-modifying-module.d.ts",
              id: "global-modifying-module.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module.d.ts",
              id: "module.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module-plugin.d.ts",
              id: "module-plugin.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-plugin-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module-class.d.ts",
              id: "module-class.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-class-d-ts.html",
              oneline: "undefined",
            },
            {
              title: "module-function.d.ts",
              id: "module-function.d.ts",
              permalink:
                "/docs/handbook/declaration-files/templates/module-function-d-ts.html",
              oneline: "undefined",
            },
          ],
        },
        {
          title: "Publishing",
          id: "publishing",
          permalink: "/docs/handbook/declaration-files/publishing.html",
          oneline: "How to get your d.ts files to users",
        },
        {
          title: "Consumption",
          id: "consumption",
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
          id: "js-projects-utilizing-typescript",
          permalink: "/docs/handbook/intro-to-js-ts.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "Type Checking JavaScript Files",
          id: "type-checking-javascript-files",
          permalink: "/docs/handbook/type-checking-javascript-files.html",
          oneline:
            "How to add type checking to JavaScript files using TypeScript",
        },
        {
          title: "JSDoc Reference",
          id: "jsdoc-reference",
          permalink: "/docs/handbook/jsdoc-supported-types.html",
          oneline: "What JSDoc does TypeScript-powered JavaScript support?",
        },
        {
          title: "Creating .d.ts Files from .js files",
          id: "creating-.d.ts-files-from-.js-files",
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
          title: "TSConfig Reference",
          id: "tsconfig-reference",
          permalink: "/tsconfig",
          oneline: "The page covering every TSConfig option",
        },
        {
          title: "tsconfig.json",
          id: "tsconfig.json",
          permalink: "/docs/handbook/tsconfig-json.html",
          oneline: "Learn about how a TSConfig works",
        },
        {
          title: "Compiler Options",
          id: "compiler-options",
          permalink: "/docs/handbook/compiler-options.html",
          oneline:
            "A very high-level overview of the compiler options in TypeScript",
        },
        {
          title: "Project References",
          id: "project-references",
          permalink: "/docs/handbook/project-references.html",
          oneline: "How to split up a large TypeScript project",
        },
        {
          title: "Compiler Options in MSBuild",
          id: "compiler-options-in-msbuild",
          permalink: "/docs/handbook/compiler-options-in-msbuild.html",
          oneline: "Which compiler options are available in MSBuild projects.",
        },
        {
          title: "Integrating with Build Tools",
          id: "integrating-with-build-tools",
          permalink: "/docs/handbook/integrating-with-build-tools.html",
          oneline: "How to use TypeScript with other build tools",
        },
        {
          title: "Configuring Watch",
          id: "configuring-watch",
          permalink: "/docs/handbook/configuring-watch.html",
          oneline: "How to configure the watch mode of TypeScript",
        },
        {
          title: "Nightly Builds",
          id: "nightly-builds",
          permalink: "/docs/handbook/nightly-builds.html",
          oneline: "How to use a nightly build of TypeScript",
        },
      ],
    },
  ];

  return navigations[lang];
}

/** ---INSERT-END--- */

const findInNav = (
  item: NewNavItem | NewNavItem[],
  fun: (item: NewNavItem) => boolean
): NewNavItem | undefined => {
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

export function getNextPageID(navs: NewNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false
  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const next = section.items[currentIndex + 1];
  if (next) {
    return {
      path: next.permalink,
      ...section.items[currentIndex + 1],
    };
  }
}

export function getPreviousPageID(navs: NewNavItem[], currentID: string) {
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
