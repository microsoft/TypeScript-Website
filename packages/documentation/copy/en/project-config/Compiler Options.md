---
title: tsc CLI Options
layout: docs
permalink: /docs/handbook/compiler-options.html
oneline: A very high-level overview of the CLI compiler options for tsc
disable_toc: true
---

## Using the CLI

Running `tsc` locally will compile the closest project defined by a `tsconfig.json`, you can compile a set of TypeScript
files by passing in a glob of files you want.

```sh
# Run a compile based on a backwards look through the fs for a tsconfig.json
tsc

# Emit JS for just the index.ts with the compiler defaults
tsc index.ts

# Emit JS for any .ts files in the folder src, with the default settings
tsc src/*.ts

# Emit files referenced in with the compiler settings from tsconfig.production.json
tsc --project tsconfig.production.json

# Emit d.ts files for a js file with showing compiler options which are booleans
tsc index.js --declaration --emitDeclarationOnly

# Emit a single .js file from two files via compiler options which take string arguments
tsc app.ts util.ts --target esnext --outfile index.js
```

## Compiler Options

**If you're looking for more information about the compiler options in a tsconfig, check out the [TSConfig Reference](/tsconfig)**

<!-- Start of replacement  --><h3>CLI Commands</h3>
<table class="cli-option" width="100%">
  <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr class='odd' name='all'>
  <td><code>--all</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Show all compiler options.</p>
</td></tr>

<tr class='even' name='generateTrace'>
  <td><code>--generateTrace</code></td>
  <td><p><code>string</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Generates an event trace and a list of types.</p>
</td></tr>

<tr class='odd' name='help'>
  <td><code>--help</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Gives local information for help on the CLI.</p>
</td></tr>

<tr class='even' name='init'>
  <td><code>--init</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Initializes a TypeScript project and creates a tsconfig.json file.</p>
</td></tr>

<tr class='odd' name='listFilesOnly'>
  <td><code>--listFilesOnly</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Print names of files that are part of the compilation and then stop processing.</p>
</td></tr>

<tr class='even' name='locale'>
  <td><code>--locale</code></td>
  <td><p><code>string</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Set the language of the messaging from TypeScript. This does not affect emit.</p>
</td></tr>

<tr class='odd' name='project'>
  <td><code>--project</code></td>
  <td><p><code>string</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.</p>
</td></tr>

<tr class='even' name='showConfig'>
  <td><code>--showConfig</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Print the final configuration instead of building.</p>
</td></tr>

<tr class='odd' name='version'>
  <td><code>--version</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Print the compiler's version.</p>
</td></tr>

</tbody></table>

<h3>Build Options</h3>
<table class="cli-option" width="100%">
  <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr class='odd' name='build'>
  <td><code>--build</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Build one or more projects and their dependencies, if out of date</p>
</td></tr>

<tr class='even' name='clean'>
  <td><code>--clean</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Delete the outputs of all projects.</p>
</td></tr>

<tr class='odd' name='dry'>
  <td><code>--dry</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Show what would be built (or deleted, if specified with '--clean')</p>
</td></tr>

<tr class='even' name='force'>
  <td><code><a href='/tsconfig/#force'>--force</a></code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Build all projects, including those that appear to be up to date.</p>
</td></tr>

<tr class='odd' name='verbose'>
  <td><code><a href='/tsconfig/#verbose'>--verbose</a></code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable verbose logging.</p>
</td></tr>

</tbody></table>

<h3>Watch Options</h3>
<table class="cli-option" width="100%">
  <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr class='odd' name='excludeDirectories'>
  <td><code><a href='/tsconfig/#excludeDirectories'>--excludeDirectories</a></code></td>
  <td><p><code>list</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Remove a list of directories from the watch process.</p>
</td></tr>

<tr class='even' name='excludeFiles'>
  <td><code><a href='/tsconfig/#excludeFiles'>--excludeFiles</a></code></td>
  <td><p><code>list</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Remove a list of files from the watch mode's processing.</p>
</td></tr>

<tr class='odd' name='fallbackPolling'>
  <td><code><a href='/tsconfig/#fallbackPolling'>--fallbackPolling</a></code></td>
  <td><p><code>fixedinterval</code>, <code>priorityinterval</code>, <code>dynamicpriority</code>, or <code>fixedchunksize</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify what approach the watcher should use if the system runs out of native file watchers.</p>
</td></tr>

<tr class='even' name='synchronousWatchDirectory'>
  <td><code><a href='/tsconfig/#synchronousWatchDirectory'>--synchronousWatchDirectory</a></code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Synchronously call callbacks and update the state of directory watchers on platforms that don`t support recursive watching natively.</p>
</td></tr>

<tr class='odd' name='watch'>
  <td><code>--watch</code></td>
  <td><p><code>boolean</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Watch input files.</p>
</td></tr>

<tr class='even' name='watchDirectory'>
  <td><code><a href='/tsconfig/#watchDirectory'>--watchDirectory</a></code></td>
  <td><p><code>usefsevents</code>, <code>fixedpollinginterval</code>, <code>dynamicprioritypolling</code>, or <code>fixedchunksizepolling</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify how directories are watched on systems that lack recursive file-watching functionality.</p>
</td></tr>

<tr class='odd' name='watchFile'>
  <td><code><a href='/tsconfig/#watchFile'>--watchFile</a></code></td>
  <td><p><code>fixedpollinginterval</code>, <code>prioritypollinginterval</code>, <code>dynamicprioritypolling</code>, <code>fixedchunksizepolling</code>, <code>usefsevents</code>, or <code>usefseventsonparentdirectory</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify how the TypeScript watch mode works.</p>
</td></tr>

</tbody></table>

<h3>Compiler Flags</h3>
<table class="cli-option" width="100%">
  <thead>
    <tr>
      <th>Flag</th>
      <th>Type</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr class='odd' name='allowJs'>
  <td><code><a href='/tsconfig/#allowJs'>--allowJs</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Allow JavaScript files to be a part of your program. Use the <code>checkJS</code> option to get errors from these files.</p>
</td></tr>

<tr class='even' name='allowSyntheticDefaultImports'>
  <td><code><a href='/tsconfig/#allowSyntheticDefaultImports'>--allowSyntheticDefaultImports</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#module"><code>module</code></a> is <code>system</code>, or <a href="#esModuleInterop"><code>esModuleInterop</code></a> and <a href="#module"><code>module</code></a> is not <code>es6</code>/<code>es2015</code> or <code>esnext</code>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Allow 'import x from y' when a module doesn't have a default export.</p>
</td></tr>

<tr class='odd' name='allowUmdGlobalAccess'>
  <td><code><a href='/tsconfig/#allowUmdGlobalAccess'>--allowUmdGlobalAccess</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Allow accessing UMD globals from modules.</p>
</td></tr>

<tr class='even' name='allowUnreachableCode'>
  <td><code><a href='/tsconfig/#allowUnreachableCode'>--allowUnreachableCode</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>undefined</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable error reporting for unreachable code.</p>
</td></tr>

<tr class='odd' name='allowUnusedLabels'>
  <td><code><a href='/tsconfig/#allowUnusedLabels'>--allowUnusedLabels</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>undefined</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable error reporting for unused labels.</p>
</td></tr>

<tr class='even' name='alwaysStrict'>
  <td><code><a href='/tsconfig/#alwaysStrict'>--alwaysStrict</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Ensure 'use strict' is always emitted.</p>
</td></tr>

<tr class='odd' name='assumeChangesOnlyAffectDirectDependencies'>
  <td><code><a href='/tsconfig/#assumeChangesOnlyAffectDirectDependencies'>--assumeChangesOnlyAffectDirectDependencies</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Have recompiles in projects that use <a href="#incremental"><code>incremental</code></a> and <code>watch</code> mode assume that changes within a file will only affect files directly depending on it.</p>
</td></tr>

<tr class='even' name='baseUrl'>
  <td><code><a href='/tsconfig/#baseUrl'>--baseUrl</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the base directory to resolve non-relative module names.</p>
</td></tr>

<tr class='odd' name='charset'>
  <td><code><a href='/tsconfig/#charset'>--charset</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p><code>utf8</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>No longer supported. In early versions, manually set the text encoding for reading files.</p>
</td></tr>

<tr class='even' name='checkJs'>
  <td><code><a href='/tsconfig/#checkJs'>--checkJs</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable error reporting in type-checked JavaScript files.</p>
</td></tr>

<tr class='odd' name='composite'>
  <td><code><a href='/tsconfig/#composite'>--composite</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable constraints that allow a TypeScript project to be used with project references.</p>
</td></tr>

<tr class='even' name='declaration'>
  <td><code><a href='/tsconfig/#declaration'>--declaration</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#composite"><code>composite</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Generate .d.ts files from TypeScript and JavaScript files in your project.</p>
</td></tr>

<tr class='odd' name='declarationDir'>
  <td><code><a href='/tsconfig/#declarationDir'>--declarationDir</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the output directory for generated declaration files.</p>
</td></tr>

<tr class='even' name='declarationMap'>
  <td><code><a href='/tsconfig/#declarationMap'>--declarationMap</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Create sourcemaps for d.ts files.</p>
</td></tr>

<tr class='odd' name='diagnostics'>
  <td><code><a href='/tsconfig/#diagnostics'>--diagnostics</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Output compiler performance information after building.</p>
</td></tr>

<tr class='even' name='disableReferencedProjectLoad'>
  <td><code><a href='/tsconfig/#disableReferencedProjectLoad'>--disableReferencedProjectLoad</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Reduce the number of projects loaded automatically by TypeScript.</p>
</td></tr>

<tr class='odd' name='disableSizeLimit'>
  <td><code><a href='/tsconfig/#disableSizeLimit'>--disableSizeLimit</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Remove the 20mb cap on total source code size for JavaScript files in the TypeScript language server.</p>
</td></tr>

<tr class='even' name='disableSolutionSearching'>
  <td><code><a href='/tsconfig/#disableSolutionSearching'>--disableSolutionSearching</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Opt a project out of multi-project reference checking when editing.</p>
</td></tr>

<tr class='odd' name='disableSourceOfProjectReferenceRedirect'>
  <td><code><a href='/tsconfig/#disableSourceOfProjectReferenceRedirect'>--disableSourceOfProjectReferenceRedirect</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable preferring source files instead of declaration files when referencing composite projects.</p>
</td></tr>

<tr class='even' name='downlevelIteration'>
  <td><code><a href='/tsconfig/#downlevelIteration'>--downlevelIteration</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Emit more compliant, but verbose and less performant JavaScript for iteration.</p>
</td></tr>

<tr class='odd' name='emitBOM'>
  <td><code><a href='/tsconfig/#emitBOM'>--emitBOM</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.</p>
</td></tr>

<tr class='even' name='emitDeclarationOnly'>
  <td><code><a href='/tsconfig/#emitDeclarationOnly'>--emitDeclarationOnly</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Only output d.ts files and not JavaScript files.</p>
</td></tr>

<tr class='odd' name='emitDecoratorMetadata'>
  <td><code><a href='/tsconfig/#emitDecoratorMetadata'>--emitDecoratorMetadata</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Emit design-type metadata for decorated declarations in source files.</p>
</td></tr>

<tr class='even' name='esModuleInterop'>
  <td><code><a href='/tsconfig/#esModuleInterop'>--esModuleInterop</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Emit additional JavaScript to ease support for importing CommonJS modules. This enables <a href="#allowSyntheticDefaultImports"><code>allowSyntheticDefaultImports</code></a> for type compatibility.</p>
</td></tr>

<tr class='odd' name='exactOptionalPropertyTypes'>
  <td><code><a href='/tsconfig/#exactOptionalPropertyTypes'>--exactOptionalPropertyTypes</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Differentiate between undefined and not present when type checking.</p>
</td></tr>

<tr class='even' name='experimentalDecorators'>
  <td><code><a href='/tsconfig/#experimentalDecorators'>--experimentalDecorators</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable experimental support for TC39 stage 2 draft decorators.</p>
</td></tr>

<tr class='odd' name='explainFiles'>
  <td><code><a href='/tsconfig/#explainFiles'>--explainFiles</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Print files read during the compilation including why it was included.</p>
</td></tr>

<tr class='even' name='extendedDiagnostics'>
  <td><code><a href='/tsconfig/#extendedDiagnostics'>--extendedDiagnostics</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Output more detailed compiler performance information after building.</p>
</td></tr>

<tr class='odd' name='forceConsistentCasingInFileNames'>
  <td><code><a href='/tsconfig/#forceConsistentCasingInFileNames'>--forceConsistentCasingInFileNames</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Ensure that casing is correct in imports.</p>
</td></tr>

<tr class='even' name='generateCpuProfile'>
  <td><code><a href='/tsconfig/#generateCpuProfile'>--generateCpuProfile</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p><code>profile.cpuprofile</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Emit a v8 CPU profile of the compiler run for debugging.</p>
</td></tr>

<tr class='odd' name='importHelpers'>
  <td><code><a href='/tsconfig/#importHelpers'>--importHelpers</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Allow importing helper functions from tslib once per project, instead of including them per-file.</p>
</td></tr>

<tr class='even' name='importsNotUsedAsValues'>
  <td><code><a href='/tsconfig/#importsNotUsedAsValues'>--importsNotUsedAsValues</a></code></td>
  <td><p><code>remove</code>, <code>preserve</code>, or <code>error</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify emit/checking behavior for imports that are only used for types.</p>
</td></tr>

<tr class='odd' name='incremental'>
  <td><code><a href='/tsconfig/#incremental'>--incremental</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#composite"><code>composite</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Save .tsbuildinfo files to allow for incremental compilation of projects.</p>
</td></tr>

<tr class='even' name='inlineSourceMap'>
  <td><code><a href='/tsconfig/#inlineSourceMap'>--inlineSourceMap</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Include sourcemap files inside the emitted JavaScript.</p>
</td></tr>

<tr class='odd' name='inlineSources'>
  <td><code><a href='/tsconfig/#inlineSources'>--inlineSources</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Include source code in the sourcemaps inside the emitted JavaScript.</p>
</td></tr>

<tr class='even' name='isolatedModules'>
  <td><code><a href='/tsconfig/#isolatedModules'>--isolatedModules</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Ensure that each file can be safely transpiled without relying on other imports.</p>
</td></tr>

<tr class='odd' name='jsx'>
  <td><code><a href='/tsconfig/#jsx'>--jsx</a></code></td>
  <td><p><code>preserve</code>, <code>react</code>, <code>react-native</code>, <code>react-jsx</code>, or <code>react-jsxdev</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify what JSX code is generated.</p>
</td></tr>

<tr class='even' name='jsxFactory'>
  <td><code><a href='/tsconfig/#jsxFactory'>--jsxFactory</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p><code>React.createElement</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'.</p>
</td></tr>

<tr class='odd' name='jsxFragmentFactory'>
  <td><code><a href='/tsconfig/#jsxFragmentFactory'>--jsxFragmentFactory</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.</p>
</td></tr>

<tr class='even' name='jsxImportSource'>
  <td><code><a href='/tsconfig/#jsxImportSource'>--jsxImportSource</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p><code>react</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify module specifier used to import the JSX factory functions when using <code>jsx: react-jsx*</code>.</p>
</td></tr>

<tr class='odd' name='keyofStringsOnly'>
  <td><code><a href='/tsconfig/#keyofStringsOnly'>--keyofStringsOnly</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Make keyof only return strings instead of string, numbers or symbols. Legacy option.</p>
</td></tr>

<tr class='even' name='lib'>
  <td><code><a href='/tsconfig/#lib'>--lib</a></code></td>
  <td><p><code>list</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify a set of bundled library declaration files that describe the target runtime environment.</p>
</td></tr>

<tr class='odd' name='listEmittedFiles'>
  <td><code><a href='/tsconfig/#listEmittedFiles'>--listEmittedFiles</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Print the names of emitted files after a compilation.</p>
</td></tr>

<tr class='even' name='listFiles'>
  <td><code><a href='/tsconfig/#listFiles'>--listFiles</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Print all of the files read during the compilation.</p>
</td></tr>

<tr class='odd' name='mapRoot'>
  <td><code><a href='/tsconfig/#mapRoot'>--mapRoot</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the location where debugger should locate map files instead of generated locations.</p>
</td></tr>

<tr class='even' name='maxNodeModuleJsDepth'>
  <td><code><a href='/tsconfig/#maxNodeModuleJsDepth'>--maxNodeModuleJsDepth</a></code></td>
  <td><p><code>number</code></p>
</td>
  <td><p><code>0</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the maximum folder depth used for checking JavaScript files from <code>node_modules</code>. Only applicable with <a href="#allowJs"><code>allowJs</code></a>.</p>
</td></tr>

<tr class='odd' name='module'>
  <td><code><a href='/tsconfig/#module'>--module</a></code></td>
  <td><p><code>none</code>, <code>commonjs</code>, <code>amd</code>, <code>umd</code>, <code>system</code>, <code>es6</code>/<code>es2015</code>, <code>es2020</code>, <code>es2022</code>, <code>esnext</code>, <code>node12</code>, or <code>nodenext</code></p>
</td>
  <td><ul><li><p><code>CommonJS</code> if <a href="#target"><code>target</code></a> is <code>ES3</code> or <code>ES5</code>,</p>
</li><li><p><code>ES6</code>/<code>ES2015</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify what module code is generated.</p>
</td></tr>

<tr class='even' name='moduleResolution'>
  <td><code><a href='/tsconfig/#moduleResolution'>--moduleResolution</a></code></td>
  <td><p><code>classic</code> or <code>node</code></p>
</td>
  <td><ul><li><p><code>Classic</code> if <a href="#module"><code>module</code></a> is <code>AMD</code>, <code>UMD</code>, <code>System</code> or <code>ES6</code>/<code>ES2015</code>,</p>
</li><li><p>Matches if <a href="#module"><code>module</code></a> is <code>node12</code> or <code>nodenext</code>,</p>
</li><li><p><code>Node</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify how TypeScript looks up a file from a given module specifier.</p>
</td></tr>

<tr class='odd' name='newLine'>
  <td><code><a href='/tsconfig/#newLine'>--newLine</a></code></td>
  <td><p><code>crlf</code> or <code>lf</code></p>
</td>
  <td><p>Platform specific.</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Set the newline character for emitting files.</p>
</td></tr>

<tr class='even' name='noEmit'>
  <td><code><a href='/tsconfig/#noEmit'>--noEmit</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable emitting files from a compilation.</p>
</td></tr>

<tr class='odd' name='noEmitHelpers'>
  <td><code><a href='/tsconfig/#noEmitHelpers'>--noEmitHelpers</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable generating custom helper functions like <code>__extends</code> in compiled output.</p>
</td></tr>

<tr class='even' name='noEmitOnError'>
  <td><code><a href='/tsconfig/#noEmitOnError'>--noEmitOnError</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable emitting files if any type checking errors are reported.</p>
</td></tr>

<tr class='odd' name='noErrorTruncation'>
  <td><code><a href='/tsconfig/#noErrorTruncation'>--noErrorTruncation</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable truncating types in error messages.</p>
</td></tr>

<tr class='even' name='noFallthroughCasesInSwitch'>
  <td><code><a href='/tsconfig/#noFallthroughCasesInSwitch'>--noFallthroughCasesInSwitch</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable error reporting for fallthrough cases in switch statements.</p>
</td></tr>

<tr class='odd' name='noImplicitAny'>
  <td><code><a href='/tsconfig/#noImplicitAny'>--noImplicitAny</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable error reporting for expressions and declarations with an implied <code>any</code> type..</p>
</td></tr>

<tr class='even' name='noImplicitOverride'>
  <td><code><a href='/tsconfig/#noImplicitOverride'>--noImplicitOverride</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Ensure overriding members in derived classes are marked with an override modifier.</p>
</td></tr>

<tr class='odd' name='noImplicitReturns'>
  <td><code><a href='/tsconfig/#noImplicitReturns'>--noImplicitReturns</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable error reporting for codepaths that do not explicitly return in a function.</p>
</td></tr>

<tr class='even' name='noImplicitThis'>
  <td><code><a href='/tsconfig/#noImplicitThis'>--noImplicitThis</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable error reporting when <code>this</code> is given the type <code>any</code>.</p>
</td></tr>

<tr class='odd' name='noImplicitUseStrict'>
  <td><code><a href='/tsconfig/#noImplicitUseStrict'>--noImplicitUseStrict</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable adding 'use strict' directives in emitted JavaScript files.</p>
</td></tr>

<tr class='even' name='noLib'>
  <td><code><a href='/tsconfig/#noLib'>--noLib</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable including any library files, including the default lib.d.ts.</p>
</td></tr>

<tr class='odd' name='noPropertyAccessFromIndexSignature'>
  <td><code><a href='/tsconfig/#noPropertyAccessFromIndexSignature'>--noPropertyAccessFromIndexSignature</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enforces using indexed accessors for keys declared using an indexed type.</p>
</td></tr>

<tr class='even' name='noResolve'>
  <td><code><a href='/tsconfig/#noResolve'>--noResolve</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disallow <code>import</code>s, <code>require</code>s or <code>&#x3C;reference></code>s from expanding the number of files TypeScript should add to a project.</p>
</td></tr>

<tr class='odd' name='noStrictGenericChecks'>
  <td><code><a href='/tsconfig/#noStrictGenericChecks'>--noStrictGenericChecks</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable strict checking of generic signatures in function types.</p>
</td></tr>

<tr class='even' name='noUncheckedIndexedAccess'>
  <td><code><a href='/tsconfig/#noUncheckedIndexedAccess'>--noUncheckedIndexedAccess</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Add <code>undefined</code> to a type when accessed using an index.</p>
</td></tr>

<tr class='odd' name='noUnusedLocals'>
  <td><code><a href='/tsconfig/#noUnusedLocals'>--noUnusedLocals</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable error reporting when a local variables aren't read.</p>
</td></tr>

<tr class='even' name='noUnusedParameters'>
  <td><code><a href='/tsconfig/#noUnusedParameters'>--noUnusedParameters</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Raise an error when a function parameter isn't read.</p>
</td></tr>

<tr class='odd' name='out'>
  <td><code><a href='/tsconfig/#out'>--out</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Deprecated setting. Use <a href="#outFile"><code>outFile</code></a> instead.</p>
</td></tr>

<tr class='even' name='outDir'>
  <td><code><a href='/tsconfig/#outDir'>--outDir</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify an output folder for all emitted files.</p>
</td></tr>

<tr class='odd' name='outFile'>
  <td><code><a href='/tsconfig/#outFile'>--outFile</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify a file that bundles all outputs into one JavaScript file. If <a href="#declaration"><code>declaration</code></a> is true, also designates a file that bundles all .d.ts output.</p>
</td></tr>

<tr class='even' name='paths'>
  <td><code><a href='/tsconfig/#paths'>--paths</a></code></td>
  <td><p><code>object</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify a set of entries that re-map imports to additional lookup locations.</p>
</td></tr>

<tr class='odd' name='plugins'>
  <td><code><a href='/tsconfig/#plugins'>--plugins</a></code></td>
  <td><p><code>list</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify a list of language service plugins to include.</p>
</td></tr>

<tr class='even' name='preserveConstEnums'>
  <td><code><a href='/tsconfig/#preserveConstEnums'>--preserveConstEnums</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#isolatedModules"><code>isolatedModules</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable erasing <code>const enum</code> declarations in generated code.</p>
</td></tr>

<tr class='odd' name='preserveSymlinks'>
  <td><code><a href='/tsconfig/#preserveSymlinks'>--preserveSymlinks</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable resolving symlinks to their realpath. This correlates to the same flag in node.</p>
</td></tr>

<tr class='even' name='preserveValueImports'>
  <td><code><a href='/tsconfig/#preserveValueImports'>--preserveValueImports</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Preserve unused imported values in the JavaScript output that would otherwise be removed.</p>
</td></tr>

<tr class='odd' name='preserveWatchOutput'>
  <td><code><a href='/tsconfig/#preserveWatchOutput'>--preserveWatchOutput</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p>n/a</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable wiping the console in watch mode.</p>
</td></tr>

<tr class='even' name='pretty'>
  <td><code><a href='/tsconfig/#pretty'>--pretty</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>true</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable color and formatting in TypeScript's output to make compiler errors easier to read.</p>
</td></tr>

<tr class='odd' name='reactNamespace'>
  <td><code><a href='/tsconfig/#reactNamespace'>--reactNamespace</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p><code>React</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the object invoked for <code>createElement</code>. This only applies when targeting <code>react</code> JSX emit.</p>
</td></tr>

<tr class='even' name='removeComments'>
  <td><code><a href='/tsconfig/#removeComments'>--removeComments</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable emitting comments.</p>
</td></tr>

<tr class='odd' name='resolveJsonModule'>
  <td><code><a href='/tsconfig/#resolveJsonModule'>--resolveJsonModule</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable importing .json files.</p>
</td></tr>

<tr class='even' name='rootDir'>
  <td><code><a href='/tsconfig/#rootDir'>--rootDir</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p>Computed from the list of input files.</p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the root folder within your source files.</p>
</td></tr>

<tr class='odd' name='rootDirs'>
  <td><code><a href='/tsconfig/#rootDirs'>--rootDirs</a></code></td>
  <td><p><code>list</code></p>
</td>
  <td><p>Computed from the list of input files.</p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Allow multiple folders to be treated as one when resolving modules.</p>
</td></tr>

<tr class='even' name='skipDefaultLibCheck'>
  <td><code><a href='/tsconfig/#skipDefaultLibCheck'>--skipDefaultLibCheck</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Skip type checking .d.ts files that are included with TypeScript.</p>
</td></tr>

<tr class='odd' name='skipLibCheck'>
  <td><code><a href='/tsconfig/#skipLibCheck'>--skipLibCheck</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Skip type checking all .d.ts files.</p>
</td></tr>

<tr class='even' name='sourceMap'>
  <td><code><a href='/tsconfig/#sourceMap'>--sourceMap</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Create source map files for emitted JavaScript files.</p>
</td></tr>

<tr class='odd' name='sourceRoot'>
  <td><code><a href='/tsconfig/#sourceRoot'>--sourceRoot</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the root path for debuggers to find the reference source code.</p>
</td></tr>

<tr class='even' name='strict'>
  <td><code><a href='/tsconfig/#strict'>--strict</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable all strict type-checking options.</p>
</td></tr>

<tr class='odd' name='strictBindCallApply'>
  <td><code><a href='/tsconfig/#strictBindCallApply'>--strictBindCallApply</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Check that the arguments for <code>bind</code>, <code>call</code>, and <code>apply</code> methods match the original function.</p>
</td></tr>

<tr class='even' name='strictFunctionTypes'>
  <td><code><a href='/tsconfig/#strictFunctionTypes'>--strictFunctionTypes</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>When assigning functions, check to ensure parameters and the return values are subtype-compatible.</p>
</td></tr>

<tr class='odd' name='strictNullChecks'>
  <td><code><a href='/tsconfig/#strictNullChecks'>--strictNullChecks</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>When type checking, take into account <code>null</code> and <code>undefined</code>.</p>
</td></tr>

<tr class='even' name='strictPropertyInitialization'>
  <td><code><a href='/tsconfig/#strictPropertyInitialization'>--strictPropertyInitialization</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Check for class properties that are declared but not set in the constructor.</p>
</td></tr>

<tr class='odd' name='stripInternal'>
  <td><code><a href='/tsconfig/#stripInternal'>--stripInternal</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable emitting declarations that have <code>@internal</code> in their JSDoc comments.</p>
</td></tr>

<tr class='even' name='suppressExcessPropertyErrors'>
  <td><code><a href='/tsconfig/#suppressExcessPropertyErrors'>--suppressExcessPropertyErrors</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable reporting of excess property errors during the creation of object literals.</p>
</td></tr>

<tr class='odd' name='suppressImplicitAnyIndexErrors'>
  <td><code><a href='/tsconfig/#suppressImplicitAnyIndexErrors'>--suppressImplicitAnyIndexErrors</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Suppress <a href="#noImplicitAny"><code>noImplicitAny</code></a> errors when indexing objects that lack index signatures.</p>
</td></tr>

<tr class='even' name='target'>
  <td><code><a href='/tsconfig/#target'>--target</a></code></td>
  <td><p><code>es3</code>, <code>es5</code>, <code>es6</code>/<code>es2015</code>, <code>es2016</code>, <code>es2017</code>, <code>es2018</code>, <code>es2019</code>, <code>es2020</code>, <code>es2021</code>, or <code>esnext</code></p>
</td>
  <td><p><code>ES3</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Set the JavaScript language version for emitted JavaScript and include compatible library declarations.</p>
</td></tr>

<tr class='odd' name='traceResolution'>
  <td><code><a href='/tsconfig/#traceResolution'>--traceResolution</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><p><code>false</code></p>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Log paths used during the <a href="#moduleResolution"><code>moduleResolution</code></a> process.</p>
</td></tr>

<tr class='even' name='tsBuildInfoFile'>
  <td><code><a href='/tsconfig/#tsBuildInfoFile'>--tsBuildInfoFile</a></code></td>
  <td><p><code>string</code></p>
</td>
  <td><p><code>.tsbuildinfo</code></p>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the folder for .tsbuildinfo incremental compilation files.</p>
</td></tr>

<tr class='odd' name='typeRoots'>
  <td><code><a href='/tsconfig/#typeRoots'>--typeRoots</a></code></td>
  <td><p><code>list</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify multiple folders that act like <code>./node_modules/@types</code>.</p>
</td></tr>

<tr class='even' name='types'>
  <td><code><a href='/tsconfig/#types'>--types</a></code></td>
  <td><p><code>list</code></p>
</td>
  <td>
</td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify type package names to be included without being referenced in a source file.</p>
</td></tr>

<tr class='odd' name='useDefineForClassFields'>
  <td><code><a href='/tsconfig/#useDefineForClassFields'>--useDefineForClassFields</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#target"><code>target</code></a> is <code>ES2022</code> or higher, including <code>ESNext</code>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Emit ECMAScript-standard-compliant class fields.</p>
</td></tr>

<tr class='even' name='useUnknownInCatchVariables'>
  <td><code><a href='/tsconfig/#useUnknownInCatchVariables'>--useUnknownInCatchVariables</a></code></td>
  <td><p><code>boolean</code></p>
</td>
  <td><ul><li><p><code>true</code> if <a href="#strict"><code>strict</code></a>,</p>
</li><li><p><code>false</code> otherwise.</p>
</li></ul></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Default catch clause variables as <code>unknown</code> instead of <code>any</code>.</p>
</td></tr>

</tbody></table>
<!-- End of replacement  -->

## Related

- Every option is fully explained in the [TSConfig Reference](/tsconfig).
- Learn how to use a [`tsconfig.json`](/docs/handbook/tsconfig-json.html) files.
- Learn how to work in an [MSBuild project](/docs/handbook/compiler-options-in-msbuild.html).
