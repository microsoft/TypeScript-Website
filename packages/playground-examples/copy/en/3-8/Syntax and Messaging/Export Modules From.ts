//// { compiler: { ts: "3.8.3" } }
// TypeScripts ability to re-export got closer to supporting
// the additional cases available in ES2018
//
// JavaScript exports have the ability to elegantly
// re-export a part of a dependency:

export { ScriptTransformer } from "@jest/transform";

// When you wanted to export the full object, that
// becomes a little more verbose in previous versions
// of TypeScript:

import * as console from "@jest/console";
import * as reporters from "@jest/reporters";

export { console, reporters };

// With 3.8, TypeScript supports more of the export
// statement forms in the JavaScript specs, letting
// you write a single line to re-export a module

export * as jestConsole from "@jest/console";
export * as jestReporters from "@jest/reporters";
