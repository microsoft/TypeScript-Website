// With the new Playground, we have a lot more control over
// the environment in which your code runs. The new Playground
// is now loosely coupled to both monaco-editor and
// monaco-typescript which provide the editing experience.

// https://github.com/microsoft/monaco-editor/
// https://github.com/microsoft/monaco-typescript

// Loosely coupling means the playground supports letting
// users choose between many different versions of the
// TypeScript build which monaco-typescript has integrated.

// We have infrastructure to build a copy of both monaco-editor
// and monaco-typescript for any version of TypeScript. This
// means we can now support:

// - Beta builds of TypeScript
// - Nightly builds of TypeScript
// - Pull Request builds of TypeScript
// - Older builds of TypeScript

// via https://github.com/orta/make-monaco-builds

// The foundational architecture for how the new playground
// supports different versions of TypeScript came from the
// project which this site is a fork of:

// https://github.com/agentcooper/typescript-play
