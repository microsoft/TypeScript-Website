# TypeScript Playground

This is the JS tooling which powers the https://www.typescriptlang.org/play/

It is more or less vanilla DOM-oriented JavaScript with as few dependencies as possible. Originally based on the
work by [Artem Tyurin](https://github.com/agentcooper/typescript-play) but now it's pretty far from that fork.

## Architecture

The playground library sits above the [TypeScript sandbox](../Sandbox), and provides features like:

- The code samples support
- The navigation bars, and compiler flags UI
- The sidebar plugin infrastructure for showing JS/DTS/etc
- The export to Code Sandbox/TS AST Viewer/etc features

When deciding where to add a feature to the TypeScript playground, consider if it would be useful to anyone showing
TypeScript in a REPL. If yes, add it to the playground and expose a function for this library to use. For example
Automatic Type Acquisition is a feature which lives in the sandbox and not the playground.
