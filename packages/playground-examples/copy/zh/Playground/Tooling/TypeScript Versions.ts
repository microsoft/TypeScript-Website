// 在新的游乐场中，我们对您代码的运行环境有更强的控制。新的
// 游乐场已经与提供编辑器体验的 monaco-editor 和
// monaco-typescript 解耦。

// https://github.com/microsoft/monaco-editor/
// https://github.com/microsoft/monaco-typescript

// 解耦意味着游乐场支持用户在 monaco-typescript 集成的 TypeScript
// 和已经构建的不同版本的 TypeScript 之间自由切换。

// 我们有为任何版本的 TypeScript 构建 monaco-editor 和 monaco-typescript
// 副本的基础设施。这意味着我们现在可以支持：

// - TypeScript 的 Beta 测试构建
// - TypeScript 的最新（Nightly）构建
// - TypeScript 的某个 Pull Request 对应构建
// - TypeScript 的历史构建

// 由：https://github.com/orta/make-monaco-builds

// 让新的游乐场如何支持不同版本的 TypeScript 的基础架构来自
// 该站点的项目：

// https://github.com/agentcooper/typescript-play
