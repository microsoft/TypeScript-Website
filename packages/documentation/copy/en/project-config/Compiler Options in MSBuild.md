---
title: Compiler Options in MSBuild
layout: docs
permalink: /docs/handbook/compiler-options-in-msbuild.html
oneline: Which compiler options are available in MSBuild projects.
---

## Overview

When you have an MSBuild based project which utilizes TypeScript, you can configure TypeScript via your project editor.

## Example Usage

A common case is stripping comments and sourcemaps in production, here we define a debug and release property group which have different TypeScript configurations:

```XML
<PropertyGroup Condition="'$(Configuration)' == 'Debug'">
  <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
  <TypeScriptSourceMap>true</TypeScriptSourceMap>
</PropertyGroup>

<PropertyGroup Condition="'$(Configuration)' == 'Release'">
  <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
  <TypeScriptSourceMap>false</TypeScriptSourceMap>
</PropertyGroup>

<Import
    Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
    Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
```

There is a series of mappings for common TypeScript settings, these are settings which map directly to [TypeScript cli options](/docs/handbook/compiler-options.html) and are used to help you write a more understandable project file. You can use the [TSConfig reference](/tsconfig) to get more information on what values and defaults are for each mapping.

<!-- Start of replacement  --><h3>CLI Mappings</h3>

  <table class='cli-option' width="100%">
    <thead>
    <tr>
    <th>MSBuild Config Name</th>
    <th>TSC Flag</th>
    </tr>
  </thead>
  <tbody>

<tr class='odd' name='allowJs'>
<td><code>&#x3C;TypeScriptAllowJS&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowJs'>--allowJs</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Allow JavaScript files to be a part of your program. Use the <code>checkJS</code> option to get errors from these files.</p>

</tr></td>
<tr class='even' name='removeComments'>
<td><code>&#x3C;TypeScriptRemoveComments&#x3E;</code></td>
<td><code><a href='/tsconfig/#removeComments'>--removeComments</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable emitting comments.</p>

</tr></td>
<tr class='odd' name='noImplicitAny'>
<td><code>&#x3C;TypeScriptNoImplicitAny&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitAny'>--noImplicitAny</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable error reporting for expressions and declarations with an implied <code>any</code> type..</p>

</tr></td>
<tr class='even' name='declaration'>
<td><code>&#x3C;TypeScriptGeneratesDeclarations&#x3E;</code></td>
<td><code><a href='/tsconfig/#declaration'>--declaration</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Generate .d.ts files from TypeScript and JavaScript files in your project.</p>

</tr></td>
<tr class='odd' name='module'>
<td><code>&#x3C;TypeScriptModuleKind&#x3E;</code></td>
<td><code><a href='/tsconfig/#module'>--module</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify what module code is generated.</p>

</tr></td>
<tr class='even' name='jsx'>
<td><code>&#x3C;TypeScriptJSXEmit&#x3E;</code></td>
<td><code><a href='/tsconfig/#jsx'>--jsx</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify what JSX code is generated.</p>

</tr></td>
<tr class='odd' name='out'>
<td><code>&#x3C;TypeScriptOutFile&#x3E;</code></td>
<td><code><a href='/tsconfig/#out'>--out</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Deprecated setting. Use <code>outFile</code> instead.</p>

</tr></td>
<tr class='even' name='outDir'>
<td><code>&#x3C;TypeScriptOutDir&#x3E;</code></td>
<td><code><a href='/tsconfig/#outDir'>--outDir</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify an output folder for all emitted files.</p>

</tr></td>
<tr class='odd' name='sourcemap'>
<td><code>&#x3C;TypeScriptSourceMap&#x3E;</code></td>
<td><code><a href='/tsconfig/#sourcemap'>--sourcemap</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Create source map files for emitted JavaScript files.</p>

</tr></td>
<tr class='even' name='target'>
<td><code>&#x3C;TypeScriptTarget&#x3E;</code></td>
<td><code><a href='/tsconfig/#target'>--target</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Set the JavaScript language version for emitted JavaScript and include compatible library declarations.</p>

</tr></td>
<tr class='odd' name='noResolve'>
<td><code>&#x3C;TypeScriptNoResolve&#x3E;</code></td>
<td><code><a href='/tsconfig/#noResolve'>--noResolve</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disallow <code>import</code>s, <code>require</code>s or <code>&#x3C;reference></code>s from expanding the number of files TypeScript should add to a project.</p>

</tr></td>
<tr class='even' name='mapRoot'>
<td><code>&#x3C;TypeScriptMapRoot&#x3E;</code></td>
<td><code><a href='/tsconfig/#mapRoot'>--mapRoot</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the location where debugger should locate map files instead of generated locations.</p>

</tr></td>
<tr class='odd' name='sourceRoot'>
<td><code>&#x3C;TypeScriptSourceRoot&#x3E;</code></td>
<td><code><a href='/tsconfig/#sourceRoot'>--sourceRoot</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the root path for debuggers to find the reference source code.</p>

</tr></td>
<tr class='even' name='codepage'>
<td><code>&#x3C;TypeScriptCodePage&#x3E;</code></td>
<td><code><a href='/tsconfig/#codepage'>--codepage</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">

</tr></td>
<tr class='odd' name='charset'>
<td><code>&#x3C;TypeScriptCharset&#x3E;</code></td>
<td><code><a href='/tsconfig/#charset'>--charset</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>No longer supported. In early versions, manually set the text encoding for reading files.</p>

</tr></td>
<tr class='even' name='emitBOM'>
<td><code>&#x3C;TypeScriptEmitBOM&#x3E;</code></td>
<td><code><a href='/tsconfig/#emitBOM'>--emitBOM</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.</p>

</tr></td>
<tr class='odd' name='noLib'>
<td><code>&#x3C;TypeScriptNoLib&#x3E;</code></td>
<td><code><a href='/tsconfig/#noLib'>--noLib</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable including any library files, including the default lib.d.ts.</p>

</tr></td>
<tr class='even' name='preserveConstEnums'>
<td><code>&#x3C;TypeScriptPreserveConstEnums&#x3E;</code></td>
<td><code><a href='/tsconfig/#preserveConstEnums'>--preserveConstEnums</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable erasing <code>const enum</code> declarations in generated code.</p>

</tr></td>
<tr class='odd' name='suppressImplicitAnyIndexErrors'>
<td><code>&#x3C;TypeScriptSuppressImplicitAnyIndexErrors&#x3E;</code></td>
<td><code><a href='/tsconfig/#suppressImplicitAnyIndexErrors'>--suppressImplicitAnyIndexErrors</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Suppress <code>noImplicitAny</code> errors when indexing objects that lack index signatures.</p>

</tr></td>
<tr class='even' name='noEmitHelpers'>
<td><code>&#x3C;TypeScriptNoEmitHelpers&#x3E;</code></td>
<td><code><a href='/tsconfig/#noEmitHelpers'>--noEmitHelpers</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable generating custom helper functions like <code>__extends</code> in compiled output.</p>

</tr></td>
<tr class='odd' name='inlineSourceMap'>
<td><code>&#x3C;TypeScriptInlineSourceMap&#x3E;</code></td>
<td><code><a href='/tsconfig/#inlineSourceMap'>--inlineSourceMap</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Include sourcemap files inside the emitted JavaScript.</p>

</tr></td>
<tr class='even' name='inlineSources'>
<td><code>&#x3C;TypeScriptInlineSources&#x3E;</code></td>
<td><code><a href='/tsconfig/#inlineSources'>--inlineSources</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Include source code in the sourcemaps inside the emitted JavaScript.</p>

</tr></td>
<tr class='odd' name='newLine'>
<td><code>&#x3C;TypeScriptNewLine&#x3E;</code></td>
<td><code><a href='/tsconfig/#newLine'>--newLine</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Set the newline character for emitting files.</p>

</tr></td>
<tr class='even' name='isolatedModules'>
<td><code>&#x3C;TypeScriptIsolatedModules&#x3E;</code></td>
<td><code><a href='/tsconfig/#isolatedModules'>--isolatedModules</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Ensure that each file can be safely transpiled without relying on other imports.</p>

</tr></td>
<tr class='odd' name='emitDecoratorMetadata'>
<td><code>&#x3C;TypeScriptEmitDecoratorMetadata&#x3E;</code></td>
<td><code><a href='/tsconfig/#emitDecoratorMetadata'>--emitDecoratorMetadata</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Emit design-type metadata for decorated declarations in source files.</p>

</tr></td>
<tr class='even' name='rootDir'>
<td><code>&#x3C;TypeScriptRootDir&#x3E;</code></td>
<td><code><a href='/tsconfig/#rootDir'>--rootDir</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the root folder within your source files.</p>

</tr></td>
<tr class='odd' name='experimentalDecorators'>
<td><code>&#x3C;TypeScriptExperimentalDecorators&#x3E;</code></td>
<td><code><a href='/tsconfig/#experimentalDecorators'>--experimentalDecorators</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable experimental support for TC39 stage 2 draft decorators.</p>

</tr></td>
<tr class='even' name='moduleResolution'>
<td><code>&#x3C;TypeScriptModuleResolution&#x3E;</code></td>
<td><code><a href='/tsconfig/#moduleResolution'>--moduleResolution</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify how TypeScript looks up a file from a given module specifier.</p>

</tr></td>
<tr class='odd' name='experimentalAsyncFunctions'>
<td><code>&#x3C;TypeScriptExperimentalAsyncFunctions&#x3E;</code></td>
<td><code><a href='/tsconfig/#experimentalAsyncFunctions'>--experimentalAsyncFunctions</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">

</tr></td>
<tr class='even' name='suppressExcessPropertyErrors'>
<td><code>&#x3C;TypeScriptSuppressExcessPropertyErrors&#x3E;</code></td>
<td><code><a href='/tsconfig/#suppressExcessPropertyErrors'>--suppressExcessPropertyErrors</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable reporting of excess property errors during the creation of object literals.</p>

</tr></td>
<tr class='odd' name='reactNamespace'>
<td><code>&#x3C;TypeScriptReactNamespace&#x3E;</code></td>
<td><code><a href='/tsconfig/#reactNamespace'>--reactNamespace</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the object invoked for <code>createElement</code>. This only applies when targeting <code>react</code> JSX emit.</p>

</tr></td>
<tr class='even' name='skipDefaultLibCheck'>
<td><code>&#x3C;TypeScriptSkipDefaultLibCheck&#x3E;</code></td>
<td><code><a href='/tsconfig/#skipDefaultLibCheck'>--skipDefaultLibCheck</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Skip type checking .d.ts files that are included with TypeScript.</p>

</tr></td>
<tr class='odd' name='allowUnusedLabels'>
<td><code>&#x3C;TypeScriptAllowUnusedLabels&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowUnusedLabels'>--allowUnusedLabels</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable error reporting for unused labels.</p>

</tr></td>
<tr class='even' name='noImplicitReturns'>
<td><code>&#x3C;TypeScriptNoImplicitReturns&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitReturns'>--noImplicitReturns</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable error reporting for codepaths that do not explicitly return in a function.</p>

</tr></td>
<tr class='odd' name='noFallthroughCasesInSwitch'>
<td><code>&#x3C;TypeScriptNoFallthroughCasesInSwitch&#x3E;</code></td>
<td><code><a href='/tsconfig/#noFallthroughCasesInSwitch'>--noFallthroughCasesInSwitch</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable error reporting for fallthrough cases in switch statements.</p>

</tr></td>
<tr class='even' name='allowUnreachableCode'>
<td><code>&#x3C;TypeScriptAllowUnreachableCode&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowUnreachableCode'>--allowUnreachableCode</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable error reporting for unreachable code.</p>

</tr></td>
<tr class='odd' name='forceConsistentCasingInFileNames'>
<td><code>&#x3C;TypeScriptForceConsistentCasingInFileNames&#x3E;</code></td>
<td><code><a href='/tsconfig/#forceConsistentCasingInFileNames'>--forceConsistentCasingInFileNames</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Ensure that casing is correct in imports.</p>

</tr></td>
<tr class='even' name='allowSyntheticDefaultImports'>
<td><code>&#x3C;TypeScriptAllowSyntheticDefaultImports&#x3E;</code></td>
<td><code><a href='/tsconfig/#allowSyntheticDefaultImports'>--allowSyntheticDefaultImports</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Allow 'import x from y' when a module doesn't have a default export.</p>

</tr></td>
<tr class='odd' name='noImplicitUseStrict'>
<td><code>&#x3C;TypeScriptNoImplicitUseStrict&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitUseStrict'>--noImplicitUseStrict</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable adding 'use strict' directives in emitted JavaScript files.</p>

</tr></td>
<tr class='even' name='lib'>
<td><code>&#x3C;TypeScriptLib&#x3E;</code></td>
<td><code><a href='/tsconfig/#lib'>--lib</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify a set of bundled library declaration files that describe the target runtime environment.</p>

</tr></td>
<tr class='odd' name='baseUrl'>
<td><code>&#x3C;TypeScriptBaseUrl&#x3E;</code></td>
<td><code><a href='/tsconfig/#baseUrl'>--baseUrl</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Specify the base directory to resolve non-relative module names.</p>

</tr></td>
<tr class='even' name='declarationDir'>
<td><code>&#x3C;TypeScriptDeclarationDir&#x3E;</code></td>
<td><code><a href='/tsconfig/#declarationDir'>--declarationDir</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the output directory for generated declaration files.</p>

</tr></td>
<tr class='odd' name='noImplicitThis'>
<td><code>&#x3C;TypeScriptNoImplicitThis&#x3E;</code></td>
<td><code><a href='/tsconfig/#noImplicitThis'>--noImplicitThis</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Enable error reporting when <code>this</code> is given the type <code>any</code>.</p>

</tr></td>
<tr class='even' name='skipLibCheck'>
<td><code>&#x3C;TypeScriptSkipLibCheck&#x3E;</code></td>
<td><code><a href='/tsconfig/#skipLibCheck'>--skipLibCheck</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Skip type checking all .d.ts files.</p>

</tr></td>
<tr class='odd' name='strictNullChecks'>
<td><code>&#x3C;TypeScriptStrictNullChecks&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictNullChecks'>--strictNullChecks</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>When type checking, take into account <code>null</code> and <code>undefined</code>.</p>

</tr></td>
<tr class='even' name='noUnusedLocals'>
<td><code>&#x3C;TypeScriptNoUnusedLocals&#x3E;</code></td>
<td><code><a href='/tsconfig/#noUnusedLocals'>--noUnusedLocals</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable error reporting when a local variables aren't read.</p>

</tr></td>
<tr class='odd' name='noUnusedParameters'>
<td><code>&#x3C;TypeScriptNoUnusedParameters&#x3E;</code></td>
<td><code><a href='/tsconfig/#noUnusedParameters'>--noUnusedParameters</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Raise an error when a function parameter isn't read</p>

</tr></td>
<tr class='even' name='alwaysStrict'>
<td><code>&#x3C;TypeScriptAlwaysStrict&#x3E;</code></td>
<td><code><a href='/tsconfig/#alwaysStrict'>--alwaysStrict</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Ensure 'use strict' is always emitted.</p>

</tr></td>
<tr class='odd' name='importHelpers'>
<td><code>&#x3C;TypeScriptImportHelpers&#x3E;</code></td>
<td><code><a href='/tsconfig/#importHelpers'>--importHelpers</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Allow importing helper functions from tslib once per project, instead of including them per-file.</p>

</tr></td>
<tr class='even' name='jsxFactory'>
<td><code>&#x3C;TypeScriptJSXFactory&#x3E;</code></td>
<td><code><a href='/tsconfig/#jsxFactory'>--jsxFactory</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'</p>

</tr></td>
<tr class='odd' name='stripInternal'>
<td><code>&#x3C;TypeScriptStripInternal&#x3E;</code></td>
<td><code><a href='/tsconfig/#stripInternal'>--stripInternal</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable emitting declarations that have <code>@internal</code> in their JSDoc comments.</p>

</tr></td>
<tr class='even' name='checkJs'>
<td><code>&#x3C;TypeScriptCheckJs&#x3E;</code></td>
<td><code><a href='/tsconfig/#checkJs'>--checkJs</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable error reporting in type-checked JavaScript files.</p>

</tr></td>
<tr class='odd' name='downlevelIteration'>
<td><code>&#x3C;TypeScriptDownlevelIteration&#x3E;</code></td>
<td><code><a href='/tsconfig/#downlevelIteration'>--downlevelIteration</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Emit more compliant, but verbose and less performant JavaScript for iteration.</p>

</tr></td>
<tr class='even' name='strict'>
<td><code>&#x3C;TypeScriptStrict&#x3E;</code></td>
<td><code><a href='/tsconfig/#strict'>--strict</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable all strict type checking options.</p>

</tr></td>
<tr class='odd' name='noStrictGenericChecks'>
<td><code>&#x3C;TypeScriptNoStrictGenericChecks&#x3E;</code></td>
<td><code><a href='/tsconfig/#noStrictGenericChecks'>--noStrictGenericChecks</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Disable strict checking of generic signatures in function types.</p>

</tr></td>
<tr class='even' name='preserveSymlinks'>
<td><code>&#x3C;TypeScriptPreserveSymlinks&#x3E;</code></td>
<td><code><a href='/tsconfig/#preserveSymlinks'>--preserveSymlinks</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable resolving symlinks to their realpath. This correlates to the same flag in node.</p>

</tr></td>
<tr class='odd' name='strictFunctionTypes'>
<td><code>&#x3C;TypeScriptStrictFunctionTypes&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictFunctionTypes'>--strictFunctionTypes</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>When assigning functions, check to ensure parameters and the return values are subtype-compatible.</p>

</tr></td>
<tr class='even' name='strictPropertyInitialization'>
<td><code>&#x3C;TypeScriptStrictPropertyInitialization&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictPropertyInitialization'>--strictPropertyInitialization</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Check for class properties that are declared but not set in the constructor.</p>

</tr></td>
<tr class='odd' name='esModuleInterop'>
<td><code>&#x3C;TypeScriptESModuleInterop&#x3E;</code></td>
<td><code><a href='/tsconfig/#esModuleInterop'>--esModuleInterop</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Emit additional JavaScript to ease support for importing CommonJS modules. This enables <code>allowSyntheticDefaultImports</code> for type compatibility.</p>

</tr></td>
<tr class='even' name='emitDeclarationOnly'>
<td><code>&#x3C;TypeScriptEmitDeclarationOnly&#x3E;</code></td>
<td><code><a href='/tsconfig/#emitDeclarationOnly'>--emitDeclarationOnly</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Only output d.ts files and not JavaScript files.</p>

</tr></td>
<tr class='odd' name='keyofStringsOnly'>
<td><code>&#x3C;TypeScriptKeyofStringsOnly&#x3E;</code></td>
<td><code><a href='/tsconfig/#keyofStringsOnly'>--keyofStringsOnly</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Make keyof only return strings instead of string, numbers or symbols. Legacy option.</p>

</tr></td>
<tr class='even' name='useDefineForClassFields'>
<td><code>&#x3C;TypeScriptUseDefineForClassFields&#x3E;</code></td>
<td><code><a href='/tsconfig/#useDefineForClassFields'>--useDefineForClassFields</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Emit ECMAScript-standard-compliant class fields.</p>

</tr></td>
<tr class='odd' name='declarationMap'>
<td><code>&#x3C;TypeScriptDeclarationMap&#x3E;</code></td>
<td><code><a href='/tsconfig/#declarationMap'>--declarationMap</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Create sourcemaps for d.ts files.</p>

</tr></td>
<tr class='even' name='resolveJsonModule'>
<td><code>&#x3C;TypeScriptResolveJsonModule&#x3E;</code></td>
<td><code><a href='/tsconfig/#resolveJsonModule'>--resolveJsonModule</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Enable importing .json files</p>

</tr></td>
<tr class='odd' name='strictBindCallApply'>
<td><code>&#x3C;TypeScriptStrictBindCallApply&#x3E;</code></td>
<td><code><a href='/tsconfig/#strictBindCallApply'>--strictBindCallApply</a></code></td>
</tr>
<tr class="option-description odd"><td colspan="3">
<p>Check that the arguments for <code>bind</code>, <code>call</code>, and <code>apply</code> methods match the original function.</p>

</tr></td>
<tr class='even' name='noEmitOnError'>
<td><code>&#x3C;TypeScriptNoEmitOnError&#x3E;</code></td>
<td><code><a href='/tsconfig/#noEmitOnError'>--noEmitOnError</a></code></td>
</tr>
<tr class="option-description even"><td colspan="3">
<p>Disable emitting files if any type checking errors are reported.</p>

</tr></td>
</tbody></table>
<!-- End of replacement  -->

### Additional Flags

Because the MSBuild system passes arguments directly to the TypeScript CLI, you can use the option `TypeScriptAdditionalFlags` to provide specific flags which don't have a mapping above.

For example, this would turn on [`noPropertyAccessFromIndexSignature`](/tsconfig#noPropertyAccessFromIndexSignature):

```xml
<TypeScriptAdditionalFlags> $(TypeScriptAdditionalFlags) --noPropertyAccessFromIndexSignature</TypeScriptAdditionalFlags>
```

### What is supported in my version of Visual Studio?

Look in your `C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets` file.
The authoritative mappings between MSBuild XML tags and `tsc` compiler options live in there.

### ToolsVersion

The value of `<TypeScriptToolsVersion>1.7</TypeScriptToolsVersion>` property in the project file identifies the compiler version to use to build (1.7 in this example).
This allows a project to build against the same versions of the compiler on different machines.

If `TypeScriptToolsVersion` is not specified, the latest compiler version installed on the machine will be used to build.

Users using newer versions of TS, will see a prompt to upgrade their project on first load.

### TypeScriptCompileBlocked

If you are using a different build tool to build your project (e.g. gulp, grunt , etc.) and VS for the development and debugging experience, set `<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>` in your project.
This should give you all the editing support, but not the build when you hit F5.

### TypeScriptEnableIncrementalMSBuild (TypeScript 4.2 Beta and later)

By default, MSBuild will attempt to only run the TypeScript compiler when the project's source files have been updated since the last compilation.
However, if this behavior is causing issues, such as when TypeScript's `incremental` option is enabled, set `<TypeScriptEnableIncrementalMSBuild>false</TypeScriptEnableIncrementalMSBuild>` to ensure the TypeScript compiler is invoked with every run of MSBuild.
