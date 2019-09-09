# TypeScript Sandbox

The TypeScript Sandbox is the editor part of the TypeScript Playground. It's effectively an opinionated fork of 
monaco-typescript with extra extension points so that projects like the TypeScript Playground can exist.

This project is useful to you if:

- You want to improve the TypeScript Playground
- You want to present users of your library with a JS editor which has a typed API (in JS or TS)

## Goals

- Support multiple versions of TypeScript (via supporting older builds of monaco-typescript)
- Easy to use when trying to replace code inline on a website
- Support extension points required to build Playground
- High level APIs for things like Automatic Type Acquisition or DTS additions

## Builds

CJS, ESModules, and UMD module formats are supported.
