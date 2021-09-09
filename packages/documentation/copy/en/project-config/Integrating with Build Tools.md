---
title: Integrating with Build Tools
layout: docs
permalink: /docs/handbook/integrating-with-build-tools.html
oneline: How to use TypeScript with other build tools
---

## Babel

### Install

```sh
npm install @babel/cli @babel/core @babel/preset-typescript --save-dev
```

### .babelrc

```js
{
  "presets": ["@babel/preset-typescript"]
}
```

### Using Command Line Interface

```sh
./node_modules/.bin/babel --out-file bundle.js src/index.ts
```

### package.json

```js
{
  "scripts": {
    "build": "babel --out-file bundle.js main.ts"
  },
}
```

### Execute Babel from the command line

```sh
npm run build
```

## Browserify

### Install

```sh
npm install tsify
```

### Using Command Line Interface

```sh
browserify main.ts -p [ tsify --noImplicitAny ] > bundle.js
```

### Using API

```js
var browserify = require("browserify");
var tsify = require("tsify");

browserify()
  .add("main.ts")
  .plugin("tsify", { noImplicitAny: true })
  .bundle()
  .pipe(process.stdout);
```

More details: [smrq/tsify](https://github.com/smrq/tsify)

## Grunt

### Install

```sh
npm install grunt-ts
```

### Basic Gruntfile.js

```js
module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      default: {
        src: ["**/*.ts", "!node_modules/**/*.ts"],
      },
    },
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
```

More details: [TypeStrong/grunt-ts](https://github.com/TypeStrong/grunt-ts)

## Gulp

### Install

```sh
npm install gulp-typescript
```

### Basic gulpfile.js

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("default", function () {
  var tsResult = gulp.src("src/*.ts").pipe(
    ts({
      noImplicitAny: true,
      out: "output.js",
    })
  );
  return tsResult.js.pipe(gulp.dest("built/local"));
});
```

More details: [ivogabe/gulp-typescript](https://github.com/ivogabe/gulp-typescript)

## Jspm

### Install

```sh
npm install -g jspm@beta
```

_Note: Currently TypeScript support in jspm is in 0.16beta_

More details: [TypeScriptSamples/jspm](https://github.com/Microsoft/TypeScriptSamples/tree/master/jspm)

## Webpack

### Install

```sh
npm install ts-loader --save-dev
```

### Basic webpack.config.js when using Webpack 5 or 4

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

See [more details on ts-loader here](https://www.npmjs.com/package/ts-loader).

Alternatives:

- [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)

## MSBuild

Update project file to include locally installed `Microsoft.TypeScript.Default.props` (at the top) and `Microsoft.TypeScript.targets` (at the bottom) files:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <!-- Include default props at the top -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props')" />

  <!-- TypeScript configurations go here -->
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
    <TypeScriptSourceMap>false</TypeScriptSourceMap>
  </PropertyGroup>

  <!-- Include default targets at the bottom -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
</Project>
```

More details about defining MSBuild compiler options: [Setting Compiler Options in MSBuild projects](/docs/handbook/compiler-options-in-msbuild.html)

## NuGet

- Right-Click -> Manage NuGet Packages
- Search for `Microsoft.TypeScript.MSBuild`
- Hit `Install`
- When install is complete, rebuild!

More details can be found at [Package Manager Dialog](http://docs.nuget.org/Consume/Package-Manager-Dialog) and [using nightly builds with NuGet](https://github.com/Microsoft/TypeScript/wiki/Nightly-drops#using-nuget-with-msbuild)
