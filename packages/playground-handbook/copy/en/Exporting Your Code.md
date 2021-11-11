## Exporting Code

Outside of learning for yourself, you will need to have ways to share the work you've done with others. Throughout this handbook, we've focused on the browser's URL as the way to share the Playground but that's not the only option. All of the export options are available under "Export" in the editor toolbar. There are three main sections:

### Exporting To Markdown

We have ways of generating useful markdown from your playground, either for reporting a bug to the TypeScript or for providing a summary link in a chat.

### Exporting To Similar Tools

You can send the current playground code to another Playground-like system, for example the [TypeScript AST Viewer](https://ts-ast-viewer.com) or the [Bug Workbench](/play#handbook-16).

### Exporting For More Features

Because the Playground has a strong focus, that comes with limitations. There are very good general purpose systems for running a node project in a browser like [CodeSandbox](https://codesandbox.io) and [StackBlitz](https://stackblitz.com/) - the Playground will generate a very close approximation of the current environment with a `package.json`, `tsconfig.json` and corresponding `index.{ts, tsx, js, jsx, .d.ts}`. This gives you the chance to carry on working when you hit a wall with the features in the Playground.

There's also a "Tweet this Playground" because why not?
