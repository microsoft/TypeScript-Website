import { createFSBackedSystem, createVirtualTypeScriptEnvironment } from "../src"

import path from "path"
import ts from "typescript"

it("can use a FS backed system ", () => {
  const compilerOpts: ts.CompilerOptions = { target: ts.ScriptTarget.ES2016, esModuleInterop: true }
  const fsMap = new Map<string, string>()

  const content = `/// <reference types="node" />\nimport * as path from 'path';\npath.`
  fsMap.set("index.ts", content)

  const monorepoRoot = path.join(__dirname, "..", "..", "..")
  const system = createFSBackedSystem(fsMap, monorepoRoot, ts)
  const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts)

  const completions = env.languageService.getCompletionsAtPosition("index.ts", content.length, {})
  const hasPathJoinFunc = completions?.entries.find(c => c.name === "join")
  expect(hasPathJoinFunc).toBeTruthy()
})

it("can use a FS backed system to extract node modules", () => {
  const compilerOpts: ts.CompilerOptions = { target: ts.ScriptTarget.ES2016, esModuleInterop: true }
  const fsMap = new Map<string, string>()

  const content = `import React from "react"\nReact.Compone`
  fsMap.set("index.ts", content)

  const monorepoRoot = path.join(__dirname, "..", "..", "..")
  const system = createFSBackedSystem(fsMap, monorepoRoot, ts)
  const env = createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOpts)

  const completions = env.languageService.getCompletionsAtPosition("index.ts", content.length, {})

  const hasReactComponentInCompletions = completions?.entries.find(c => c.name === "Component")
  expect(hasReactComponentInCompletions).toBeTruthy()
})

it("can import files in the virtual fs using posix directory seperators", () => {
  const compilerOpts: ts.CompilerOptions = { target: ts.ScriptTarget.ES2016, esModuleInterop: true }
  const fsMap = new Map<string, string>()

  // Have to replace the windows directory seperator in __dirname or else path.join will silently fail
  const monorepoRoot = path.posix.join(__dirname.replace(/\\/g, '/'), "..", "..", "..")
  const fakeFolder = path.posix.join(monorepoRoot, "fake")
  const exporter = path.posix.join(fakeFolder, "file-with-export.ts")
  const index = path.posix.join(fakeFolder, "index.ts")

  fsMap.set(exporter, `export const helloWorld = "Example string";`)
  fsMap.set(index, `import {helloWorld} from "./file-with-export"; console.log(helloWorld)`)

  const system = createFSBackedSystem(fsMap, monorepoRoot, ts)
  const env = createVirtualTypeScriptEnvironment(system, [index, exporter], ts, compilerOpts)

  const errs: import("typescript").Diagnostic[] = []
  errs.push(...env.languageService.getSemanticDiagnostics(index))
  errs.push(...env.languageService.getSyntacticDiagnostics(index))

  expect(errs.map(e => e.messageText)).toEqual([])
})

it("can import files in the virtual fs using windows directory seperators", () => {
  const compilerOpts: ts.CompilerOptions = { target: ts.ScriptTarget.ES2016, esModuleInterop: true }
  const fsMap = new Map<string, string>()

  const monorepoRoot = path.win32.join(__dirname, "..", "..", "..")
  const fakeFolder = path.win32.join(monorepoRoot, "fake")
  const exporter = path.win32.join(fakeFolder, "file-with-export.ts")
  const index = path.win32.join(fakeFolder, "index.ts")

  fsMap.set(exporter, `export const helloWorld = "Example string";`)
  fsMap.set(index, `import {helloWorld} from "./file-with-export"; console.log(helloWorld)`)

  const system = createFSBackedSystem(fsMap, monorepoRoot, ts)
  const env = createVirtualTypeScriptEnvironment(system, [index, exporter], ts, compilerOpts)

  const errs: import("typescript").Diagnostic[] = []
  errs.push(...env.languageService.getSemanticDiagnostics(index))
  errs.push(...env.languageService.getSyntacticDiagnostics(index))

  expect(errs.map(e => e.messageText)).toEqual([])
})
