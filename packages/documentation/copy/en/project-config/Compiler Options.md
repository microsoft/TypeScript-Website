---
title: tsc CLI Options
layout: docs
permalink: /docs/handbook/compiler-options.html
oneline: A very high-level overview of the CLI compiler options for tsc
disable_toc: true
---

<!-- This file is auto-generated, see packages/tsconfig-reference/scripts/cli/generateMarkdown.ts -->

## Using the CLI

Running `tsc` locally will compile the closest project defined by a `tsconfig.json`, you can compile a set of TypeScript
files by passing in a glob of files you want.

```sh
# Run a compile based on a backwards look through the fs for a tsconfig.json
tsc

# Transpile just the index.ts with the compiler defaults
tsc index.ts

# Transpile any .ts files in the folder src, with the default settings
tsc src/*.ts

# Transpile any files referenced in with the compiler settings from tsconfig.production.json
tsc --project tsconfig.production.json
```

## Compiler Options

**If you're looking for more information about the compiler options in a tsconfig, check out the [TSConfig Reference](/tsconfig)**

<h3>CLI Commands</h3>

  <table class='cli-option' width="100%">
    <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
      
    </tr>
  </thead>
  <tbody>

<tr class='odd' name='all'>
<td><code>--all</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
Show all compiler options.
</tr></td>
<tr class='even' name='build'>
<td><code>--build</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Build one or more projects and their dependencies, if out of date
</tr></td>
<tr class='odd' name='disableFilenameBasedTypeAcquisition'>
<td><code>--disableFilenameBasedTypeAcquisition</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
undefined
</tr></td>
<tr class='even' name='enable'>
<td><code>--enable</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
undefined
</tr></td>
<tr class='odd' name='enableAutoDiscovery'>
<td><code>--enableAutoDiscovery</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
undefined
</tr></td>
<tr class='even' name='exclude'>
<td><code>--exclude</code></td>
  <td><code>list</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Filters results from the `include` option.
</tr></td>
<tr class='odd' name='generateTrace'>
<td><code>--generateTrace</code></td>
  <td><code>string</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
Generates an event trace and a list of types.
</tr></td>
<tr class='even' name='help'>
<td><code>--help</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Print this message.
</tr></td>
<tr class='odd' name='help'>
<td><code>--help</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
undefined
</tr></td>
<tr class='even' name='include'>
<td><code>--include</code></td>
  <td><code>list</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify a list of glob patterns that match files to be included in compilation.
</tr></td>
<tr class='odd' name='init'>
<td><code>--init</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
Initializes a TypeScript project and creates a tsconfig.json file.
</tr></td>
<tr class='even' name='listFilesOnly'>
<td><code>--listFilesOnly</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Print names of files that are part of the compilation and then stop processing.
</tr></td>
<tr class='odd' name='locale'>
<td><code>--locale</code></td>
  <td><code>string</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
Set the language of the messaging from TypeScript. This does not affect emit.
</tr></td>
<tr class='even' name='project'>
<td><code>--project</code></td>
  <td><code>string</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.
</tr></td>
<tr class='odd' name='showConfig'>
<td><code>--showConfig</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
Print the final configuration instead of building.
</tr></td>
<tr class='even' name='version'>
<td><code>--version</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description even"><td colspan="3">
Print the compiler's version.
</tr></td>
<tr class='odd' name='watch'>
<td><code>--watch</code></td>
  <td><code>boolean</code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
Watch input files.
</tr></td>
</tbody></table>
<h3>Compiler Flags</h3>

  <table class='cli-option' width="100%">
    <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>

<tr class='odd' name='allowJs'>
<td><code>--<a href='/tsconfig/#allowJs'>allowJs</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files.
</tr></td>
<tr class='even' name='allowSyntheticDefaultImports'>
<td><code>--<a href='/tsconfig/#allowSyntheticDefaultImports'>allowSyntheticDefaultImports</a></code></td>
  <td><code>boolean</code></td>
  <td><p>module === "system" or esModuleInterop</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Allow 'import x from y' when a module doesn't have a default export.
</tr></td>
<tr class='odd' name='allowUmdGlobalAccess'>
<td><code>--<a href='/tsconfig/#allowUmdGlobalAccess'>allowUmdGlobalAccess</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Allow accessing UMD globals from modules.
</tr></td>
<tr class='even' name='allowUnreachableCode'>
<td><code>--<a href='/tsconfig/#allowUnreachableCode'>allowUnreachableCode</a></code></td>
  <td><code>boolean</code></td>
  <td><p>undefined</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable error reporting for unreachable code.
</tr></td>
<tr class='odd' name='allowUnusedLabels'>
<td><code>--<a href='/tsconfig/#allowUnusedLabels'>allowUnusedLabels</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable error reporting for unused labels.
</tr></td>
<tr class='even' name='alwaysStrict'>
<td><code>--<a href='/tsconfig/#alwaysStrict'>alwaysStrict</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Ensure 'use strict' is always emitted.
</tr></td>
<tr class='odd' name='assumeChangesOnlyAffectDirectDependencies'>
<td><code>--<a href='/tsconfig/#assumeChangesOnlyAffectDirectDependencies'>assumeChangesOnlyAffectDirectDependencies</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Have recompiles in projects that use `incremental` and `watch` mode assume that changes within a file will only affect files directly depending on it.
</tr></td>
<tr class='even' name='baseUrl'>
<td><code>--<a href='/tsconfig/#baseUrl'>baseUrl</a></code></td>
  <td><code>string</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the base directory to resolve non-relative module names.
</tr></td>
<tr class='odd' name='charset'>
<td><code>--<a href='/tsconfig/#charset'>charset</a></code></td>
  <td><code>string</code></td>
  <td><p>utf8</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
No longer supported. In early versions, manually set the text encoding for reading files.
</tr></td>
<tr class='even' name='checkJs'>
<td><code>--<a href='/tsconfig/#checkJs'>checkJs</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Enable error reporting in type-checked JavaScript files.
</tr></td>
<tr class='odd' name='declaration'>
<td><code>--<a href='/tsconfig/#declaration'>declaration</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Generate .d.ts files from TypeScript and JavaScript files in your project.
</tr></td>
<tr class='even' name='declarationDir'>
<td><code>--<a href='/tsconfig/#declarationDir'>declarationDir</a></code></td>
  <td><code>string</code></td>
  <td><p> n/a</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the output directory for generated declaration files.
</tr></td>
<tr class='odd' name='declarationMap'>
<td><code>--<a href='/tsconfig/#declarationMap'>declarationMap</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Create sourcemaps for d.ts files.
</tr></td>
<tr class='even' name='diagnostics'>
<td><code>--<a href='/tsconfig/#diagnostics'>diagnostics</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Output compiler performance information after building.
</tr></td>
<tr class='odd' name='disableSizeLimit'>
<td><code>--<a href='/tsconfig/#disableSizeLimit'>disableSizeLimit</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Remove the 20mb cap on total source code size for JavaScript files in the TypeScript language server.
</tr></td>
<tr class='even' name='downlevelIteration'>
<td><code>--<a href='/tsconfig/#downlevelIteration'>downlevelIteration</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Emit more compliant, but verbose and less performant JavaScript for iteration.
</tr></td>
<tr class='odd' name='emitBOM'>
<td><code>--<a href='/tsconfig/#emitBOM'>emitBOM</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
</tr></td>
<tr class='even' name='emitDeclarationOnly'>
<td><code>--<a href='/tsconfig/#emitDeclarationOnly'>emitDeclarationOnly</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Only output d.ts files and not JavaScript files.
</tr></td>
<tr class='odd' name='emitDecoratorMetadata'>
<td><code>--<a href='/tsconfig/#emitDecoratorMetadata'>emitDecoratorMetadata</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Emit design-type metadata for decorated declarations in source files.
</tr></td>
<tr class='even' name='esModuleInterop'>
<td><code>--<a href='/tsconfig/#esModuleInterop'>esModuleInterop</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility.
</tr></td>
<tr class='odd' name='excludeDirectories'>
<td><code>--<a href='/tsconfig/#excludeDirectories'>excludeDirectories</a></code></td>
  <td><code>list</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Synchronously call callbacks and update the state of directory watchers on platforms that don't support recursive watching natively.
</tr></td>
<tr class='even' name='excludeFiles'>
<td><code>--<a href='/tsconfig/#excludeFiles'>excludeFiles</a></code></td>
  <td><code>list</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Synchronously call callbacks and update the state of directory watchers on platforms that don't support recursive watching natively.
</tr></td>
<tr class='odd' name='experimentalDecorators'>
<td><code>--<a href='/tsconfig/#experimentalDecorators'>experimentalDecorators</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Enable experimental support for TC39 stage 2 draft decorators.
</tr></td>
<tr class='even' name='explainFiles'>
<td><code>--<a href='/tsconfig/#explainFiles'>explainFiles</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Print files read during the compilation including why it was included.
</tr></td>
<tr class='odd' name='extendedDiagnostics'>
<td><code>--<a href='/tsconfig/#extendedDiagnostics'>extendedDiagnostics</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Output more detailed compiler performance information after building.
</tr></td>
<tr class='even' name='fallbackPolling'>
<td><code>--<a href='/tsconfig/#fallbackPolling'>fallbackPolling</a></code></td>
  <td><code><code>fixedPollingInterval</code>, <code>priorityPollingInterval</code>, <code>dynamicPriorityPolling</code></code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify what approach the watcher should use if the system runs out of native file watchers.
</tr></td>
<tr class='odd' name='forceConsistentCasingInFileNames'>
<td><code>--<a href='/tsconfig/#forceConsistentCasingInFileNames'>forceConsistentCasingInFileNames</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Ensure that casing is correct in imports.
</tr></td>
<tr class='even' name='generateCpuProfile'>
<td><code>--<a href='/tsconfig/#generateCpuProfile'>generateCpuProfile</a></code></td>
  <td><code>string</code></td>
  <td><p> profile.cpuprofile</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Emit a v8 CPU profile of the compiler run for debugging.
</tr></td>
<tr class='odd' name='importHelpers'>
<td><code>--<a href='/tsconfig/#importHelpers'>importHelpers</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Allow importing helper functions from tslib once per project, instead of including them per-file.
</tr></td>
<tr class='even' name='importsNotUsedAsValues'>
<td><code>--<a href='/tsconfig/#importsNotUsedAsValues'>importsNotUsedAsValues</a></code></td>
  <td><code><code>remove</code>, <code>preserve</code>, <code>error</code></code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify emit/checking behavior for imports that are only used for types.
</tr></td>
<tr class='odd' name='incremental'>
<td><code>--<a href='/tsconfig/#incremental'>incremental</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>true</code> if <code>composite</code>, <code>false</code> otherwise</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Save .tsbuildinfo files to allow for incremental compilation of projects.
</tr></td>
<tr class='even' name='inlineSourceMap'>
<td><code>--<a href='/tsconfig/#inlineSourceMap'>inlineSourceMap</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Include sourcemap files inside the emitted JavaScript.
</tr></td>
<tr class='odd' name='inlineSources'>
<td><code>--<a href='/tsconfig/#inlineSources'>inlineSources</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Include source code in the sourcemaps inside the emitted JavaScript.
</tr></td>
<tr class='even' name='isolatedModules'>
<td><code>--<a href='/tsconfig/#isolatedModules'>isolatedModules</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Ensure that each file can be safely transpiled without relying on other imports.
</tr></td>
<tr class='odd' name='jsx'>
<td><code>--<a href='/tsconfig/#jsx'>jsx</a></code></td>
  <td><code><code>`react`</code>, <code>`react-jsx`</code>, <code>`react-jsxdev`</code>, <code>`react-native`</code>, <code>`preserve`</code></code></td>
  <td><p>undefined</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify what JSX code is generated.
</tr></td>
<tr class='even' name='jsxFactory'>
<td><code>--<a href='/tsconfig/#jsxFactory'>jsxFactory</a></code></td>
  <td><code>string</code></td>
  <td><p><code>React.createElement</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'
</tr></td>
<tr class='odd' name='jsxFragmentFactory'>
<td><code>--<a href='/tsconfig/#jsxFragmentFactory'>jsxFragmentFactory</a></code></td>
  <td><code>string</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.
</tr></td>
<tr class='even' name='jsxImportSource'>
<td><code>--<a href='/tsconfig/#jsxImportSource'>jsxImportSource</a></code></td>
  <td><code>string</code></td>
  <td><p>react</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.`
</tr></td>
<tr class='odd' name='keyofStringsOnly'>
<td><code>--<a href='/tsconfig/#keyofStringsOnly'>keyofStringsOnly</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Make keyof only return strings instead of string, numbers or symbols. Legacy option.
</tr></td>
<tr class='even' name='lib'>
<td><code>--<a href='/tsconfig/#lib'>lib</a></code></td>
  <td><code>list</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify a set of bundled library declaration files that describe the target runtime environment.
</tr></td>
<tr class='odd' name='listEmittedFiles'>
<td><code>--<a href='/tsconfig/#listEmittedFiles'>listEmittedFiles</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Print the names of emitted files after a compilation.
</tr></td>
<tr class='even' name='listFiles'>
<td><code>--<a href='/tsconfig/#listFiles'>listFiles</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Print all of the files read during the compilation.
</tr></td>
<tr class='odd' name='mapRoot'>
<td><code>--<a href='/tsconfig/#mapRoot'>mapRoot</a></code></td>
  <td><code>string</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify the location where debugger should locate map files instead of generated locations.
</tr></td>
<tr class='even' name='maxNodeModuleJsDepth'>
<td><code>--<a href='/tsconfig/#maxNodeModuleJsDepth'>maxNodeModuleJsDepth</a></code></td>
  <td><code>number</code></td>
  <td><p>0</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with `allowJs`.
</tr></td>
<tr class='odd' name='module'>
<td><code>--<a href='/tsconfig/#module'>module</a></code></td>
  <td><code><code>`CommonJS` (default if `target` is `ES3` or `ES5`)</code>, <code></code>, <code>`ES6`/`ES2015` (synonymous, default for `target` `ES6` and higher)</code>, <code></code>, <code>`ES2020`</code>, <code>`None`</code>, <code>`UMD`</code>, <code>`AMD`</code>, <code>`System`</code>, <code>`ESNext`</code></code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify what module code is generated.
</tr></td>
<tr class='even' name='moduleResolution'>
<td><code>--<a href='/tsconfig/#moduleResolution'>moduleResolution</a></code></td>
  <td><code></code></td>
  <td><p>module === <code>AMD</code> or <code>UMD</code> or <code>System</code> or <code>ES6</code>, then <code>Classic</code><br/><br/>Otherwise <code>Node</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify how TypeScript looks up a file from a given module specifier.
</tr></td>
<tr class='odd' name='newLine'>
<td><code>--<a href='/tsconfig/#newLine'>newLine</a></code></td>
  <td><code></code></td>
  <td><p>Platform specific</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Set the newline character for emitting files.
</tr></td>
<tr class='even' name='noEmit'>
<td><code>--<a href='/tsconfig/#noEmit'>noEmit</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable emitting file from a compilation.
</tr></td>
<tr class='odd' name='noEmitHelpers'>
<td><code>--<a href='/tsconfig/#noEmitHelpers'>noEmitHelpers</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable generating custom helper functions like `__extends` in compiled output.
</tr></td>
<tr class='even' name='noEmitOnError'>
<td><code>--<a href='/tsconfig/#noEmitOnError'>noEmitOnError</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable emitting files if any type checking errors are reported.
</tr></td>
<tr class='odd' name='noErrorTruncation'>
<td><code>--<a href='/tsconfig/#noErrorTruncation'>noErrorTruncation</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable truncating types in error messages.
</tr></td>
<tr class='even' name='noFallthroughCasesInSwitch'>
<td><code>--<a href='/tsconfig/#noFallthroughCasesInSwitch'>noFallthroughCasesInSwitch</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Enable error reporting for fallthrough cases in switch statements.
</tr></td>
<tr class='odd' name='noImplicitAny'>
<td><code>--<a href='/tsconfig/#noImplicitAny'>noImplicitAny</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Enable error reporting for expressions and declarations with an implied `any` type..
</tr></td>
<tr class='even' name='noImplicitReturns'>
<td><code>--<a href='/tsconfig/#noImplicitReturns'>noImplicitReturns</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Enable error reporting for codepaths that do not explicitly return in a function.
</tr></td>
<tr class='odd' name='noImplicitThis'>
<td><code>--<a href='/tsconfig/#noImplicitThis'>noImplicitThis</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Enable error reporting when `this` is given the type `any`.
</tr></td>
<tr class='even' name='noImplicitUseStrict'>
<td><code>--<a href='/tsconfig/#noImplicitUseStrict'>noImplicitUseStrict</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable adding 'use strict' directives in emitted JavaScript files.
</tr></td>
<tr class='odd' name='noLib'>
<td><code>--<a href='/tsconfig/#noLib'>noLib</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable including any library files, including the default lib.d.ts.
</tr></td>
<tr class='even' name='noPropertyAccessFromIndexSignature'>
<td><code>--<a href='/tsconfig/#noPropertyAccessFromIndexSignature'>noPropertyAccessFromIndexSignature</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Enforces using indexed accessors for keys declared using an indexed type
</tr></td>
<tr class='odd' name='noResolve'>
<td><code>--<a href='/tsconfig/#noResolve'>noResolve</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project.
</tr></td>
<tr class='even' name='noStrictGenericChecks'>
<td><code>--<a href='/tsconfig/#noStrictGenericChecks'>noStrictGenericChecks</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable strict checking of generic signatures in function types.
</tr></td>
<tr class='odd' name='noUncheckedIndexedAccess'>
<td><code>--<a href='/tsconfig/#noUncheckedIndexedAccess'>noUncheckedIndexedAccess</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Add `undefined` to a type when accessed using an index.
</tr></td>
<tr class='even' name='noUnusedLocals'>
<td><code>--<a href='/tsconfig/#noUnusedLocals'>noUnusedLocals</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Enable error reporting when a local variables aren't read.
</tr></td>
<tr class='odd' name='noUnusedParameters'>
<td><code>--<a href='/tsconfig/#noUnusedParameters'>noUnusedParameters</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Raise an error when a function parameter isn't read
</tr></td>
<tr class='even' name='out'>
<td><code>--<a href='/tsconfig/#out'>out</a></code></td>
  <td><code>string</code></td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Deprecated setting. Use `outFile` instead.
</tr></td>
<tr class='odd' name='outDir'>
<td><code>--<a href='/tsconfig/#outDir'>outDir</a></code></td>
  <td><code>string</code></td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify an output folder for all emitted files.
</tr></td>
<tr class='even' name='outFile'>
<td><code>--<a href='/tsconfig/#outFile'>outFile</a></code></td>
  <td><code>string</code></td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output.
</tr></td>
<tr class='odd' name='preserveConstEnums'>
<td><code>--<a href='/tsconfig/#preserveConstEnums'>preserveConstEnums</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable erasing `const enum` declarations in generated code.
</tr></td>
<tr class='even' name='preserveSymlinks'>
<td><code>--<a href='/tsconfig/#preserveSymlinks'>preserveSymlinks</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable resolving symlinks to their realpath. This correlates to the same flag in node.
</tr></td>
<tr class='odd' name='preserveWatchOutput'>
<td><code>--<a href='/tsconfig/#preserveWatchOutput'>preserveWatchOutput</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable wiping the console in watch mode
</tr></td>
<tr class='even' name='pretty'>
<td><code>--<a href='/tsconfig/#pretty'>pretty</a></code></td>
  <td><code>boolean</code></td>
  <td><p>true</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Enable color and formatting in output to make compiler errors easier to read
</tr></td>
<tr class='odd' name='reactNamespace'>
<td><code>--<a href='/tsconfig/#reactNamespace'>reactNamespace</a></code></td>
  <td><code>string</code></td>
  <td><p>"React"</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit.
</tr></td>
<tr class='even' name='removeComments'>
<td><code>--<a href='/tsconfig/#removeComments'>removeComments</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable emitting comments.
</tr></td>
<tr class='odd' name='resolveJsonModule'>
<td><code>--<a href='/tsconfig/#resolveJsonModule'>resolveJsonModule</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Enable importing .json files
</tr></td>
<tr class='even' name='rootDir'>
<td><code>--<a href='/tsconfig/#rootDir'>rootDir</a></code></td>
  <td><code>string</code></td>
  <td><p>Computed from the list of input files</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the root folder within your source files.
</tr></td>
<tr class='odd' name='skipDefaultLibCheck'>
<td><code>--<a href='/tsconfig/#skipDefaultLibCheck'>skipDefaultLibCheck</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Skip type checking .d.ts files that are included with TypeScript.
</tr></td>
<tr class='even' name='skipLibCheck'>
<td><code>--<a href='/tsconfig/#skipLibCheck'>skipLibCheck</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Skip type checking all .d.ts files.
</tr></td>
<tr class='odd' name='sourceMap'>
<td><code>--<a href='/tsconfig/#sourceMap'>sourceMap</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Create source map files for emitted JavaScript files.
</tr></td>
<tr class='even' name='sourceRoot'>
<td><code>--<a href='/tsconfig/#sourceRoot'>sourceRoot</a></code></td>
  <td><code>string</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the root path for debuggers to find the reference source code.
</tr></td>
<tr class='odd' name='strict'>
<td><code>--<a href='/tsconfig/#strict'>strict</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Enable all strict type checking options.
</tr></td>
<tr class='even' name='strictBindCallApply'>
<td><code>--<a href='/tsconfig/#strictBindCallApply'>strictBindCallApply</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Check that the arguments for `bind`, `call`, and `apply` methods match the original function.
</tr></td>
<tr class='odd' name='strictFunctionTypes'>
<td><code>--<a href='/tsconfig/#strictFunctionTypes'>strictFunctionTypes</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
When assigning functions, check to ensure parameters and the return values are subtype-compatible.
</tr></td>
<tr class='even' name='strictNullChecks'>
<td><code>--<a href='/tsconfig/#strictNullChecks'>strictNullChecks</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
When type checking, take into account `null` and `undefined`.
</tr></td>
<tr class='odd' name='strictPropertyInitialization'>
<td><code>--<a href='/tsconfig/#strictPropertyInitialization'>strictPropertyInitialization</a></code></td>
  <td><code>boolean</code></td>
  <td><p><code>false</code>, unless <code>strict</code> is set</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Check for class properties that are declared but not set in the constructor.
</tr></td>
<tr class='even' name='stripInternal'>
<td><code>--<a href='/tsconfig/#stripInternal'>stripInternal</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Disable emitting declarations that have `@internal` in their JSDoc comments.
</tr></td>
<tr class='odd' name='suppressExcessPropertyErrors'>
<td><code>--<a href='/tsconfig/#suppressExcessPropertyErrors'>suppressExcessPropertyErrors</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Disable reporting of excess property errors during the creation of object literals.
</tr></td>
<tr class='even' name='suppressImplicitAnyIndexErrors'>
<td><code>--<a href='/tsconfig/#suppressImplicitAnyIndexErrors'>suppressImplicitAnyIndexErrors</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Suppress `noImplicitAny` errors when indexing objects that lack index signatures.
</tr></td>
<tr class='odd' name='synchronousWatchDirectory'>
<td><code>--<a href='/tsconfig/#synchronousWatchDirectory'>synchronousWatchDirectory</a></code></td>
  <td><code>boolean</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Synchronously call callbacks and update the state of directory watchers on platforms that don't support recursive watching natively.
</tr></td>
<tr class='even' name='target'>
<td><code>--<a href='/tsconfig/#target'>target</a></code></td>
  <td><code><code>`ES3` (default)</code>, <code>`ES5`</code>, <code>`ES6`/`ES2015` (synonymous)</code>, <code>`ES7`/`ES2016`</code>, <code>`ES2017`</code>, <code>`ES2018`</code>, <code>`ES2019`</code>, <code>`ES2020`</code>, <code>`ESNext`</code></code></td>
  <td><p>ES3</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Set the JavaScript language version for emitted JavaScript and include compatible library declarations.
</tr></td>
<tr class='odd' name='traceResolution'>
<td><code>--<a href='/tsconfig/#traceResolution'>traceResolution</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Log paths used during the `moduleResolution` process.
</tr></td>
<tr class='even' name='tsBuildInfoFile'>
<td><code>--<a href='/tsconfig/#tsBuildInfoFile'>tsBuildInfoFile</a></code></td>
  <td><code>string</code></td>
  <td><p>.tsbuildinfo</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify the folder for .tsbuildinfo incremental compilation files.
</tr></td>
<tr class='odd' name='typeRoots'>
<td><code>--<a href='/tsconfig/#typeRoots'>typeRoots</a></code></td>
  <td><code>list</code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify multiple folders that act like `./node_modules/@types`.
</tr></td>
<tr class='even' name='types'>
<td><code>--<a href='/tsconfig/#types'>types</a></code></td>
  <td><code>list</code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify type package names to be included without being referenced in a source file.
</tr></td>
<tr class='odd' name='useDefineForClassFields'>
<td><code>--<a href='/tsconfig/#useDefineForClassFields'>useDefineForClassFields</a></code></td>
  <td><code>boolean</code></td>
  <td><p>false</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Emit ECMAScript-standard-compliant class fields.
</tr></td>
<tr class='even' name='watchDirectory'>
<td><code>--<a href='/tsconfig/#watchDirectory'>watchDirectory</a></code></td>
  <td><code><code>fixedPollingInterval</code>, <code>dynamicPriorityPolling</code>, <code>useFsEvents</code></code></td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
Specify how directories are watched on systems that lack recursive file-watching functionality.
</tr></td>
<tr class='odd' name='watchFile'>
<td><code>--<a href='/tsconfig/#watchFile'>watchFile</a></code></td>
  <td><code><code>fixedPollingInterval</code>, <code>priorityPollingInterval</code>, <code>dynamicPriorityPolling</code>, <code>useFsEvents</code>, <code>useFsEventsOnParentDirectory</code></code></td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
Specify how the TypeScript watch mode works.
</tr></td>
</tbody></table>

## Related

- Every option is fully explained in the [TSConfig Reference](/tsconfig).
- Learn how to use a [`tsconfig.json`](/docs/handbook/tsconfig-json.html) files.
- Learn how to work in an [MSBuild project](/docs/handbook/compiler-options-in-msbuild.html).
