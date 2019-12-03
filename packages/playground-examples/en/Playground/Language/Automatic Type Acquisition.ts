// Automatic Type Acquisition is the term for how TypeScript
// grabs type definitions from @types on npm behind the scenes
// to provide a better user experience for JavaScript users.

// The playground now has a similar (but a bit more limited)
// version of the type acquisition process built into
// TypeScript.

// You can use it by creating imports in your code. It works
// either through @types from DefinitelyTyped or via d.ts
// files inside the dependency itself.

import {danger} from "danger"

// Highlight these identifiers below to see the associated
// JSDocs from the built-in types:

danger.github

// This handles transitive dependencies also, so in this case,
// danger depends on @octokit/rest also.

danger.github.api.pulls.createComment()

// Type acquisition will also take Node's built-in modules
// into account and pull in Node's type declarations
// when you use any of those dependencies. Note, these
// tend to take a bit longer than the others since there's
// quite a lot of types to download!

import {readFileSync} from "fs"

const inputPath = "my/path/file.ts"
readFileSync(inputPath, "utf8")
