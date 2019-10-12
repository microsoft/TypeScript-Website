// Automatic Type Acquisition is the term for how TypeScript
// grabs type definitions from @types on npm behind the scenes
// to provide a better user experience for JavaScript users.

// The playground now has a similar (but a bit more limited) 
// version of the type acquisition process built into
// TypeScript.

// You can use it by creating imports in your code. It works
// either through @types from Definitely Typed or via d.ts
// files inside the dependency itself.

import {danger} from "danger"

// Highlight these identifiers below to see the associated 
// JSDocs from the built-in types:

danger.github

// This handles sub-dependencies also, in this case
// the danger's types depends on @octokit/rest also.

danger.github.api.pulls.createComment()

// the Type Acquisition will also take node's special case 
// dependencies  into account and pull all of the node types 
// when you use any of those dependencies. Note, these
// tend to take a bit longer than the others (because there
// is quite a lot of types to download.)

import {readFileSync} from "fs"

const inputPath = "my/path/file.ts"
readFileSync(inputPath, "utf8")

// The type acquisition doesn't just support modern ES2015 
// module imports, there is support for require too.

const path = require("path")
const outputPath = path.join("my", "path", "file.js")

// This is still beta-y because we've not got dependencies
// like lodash to work with it yet. On the other hand, it
// also supports getting types using deno-style imports:

import {Printer, Config, format} from "https://deno.land/std@v0.3.1/testing/format.ts"


