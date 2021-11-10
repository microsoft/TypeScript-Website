## Implementation Details

If you want to understand the technical architecture of the playground, you can get the full gist in the first 10 minutes of [this talk](https://www.youtube.com/watch?v=eJWtTl62gy0). There's also an extended dive through the entire TypeScript website source code from when it [was in beta](https://www.youtube.com/watch?v=HOvivt6B7hE).

In rough, the Playground is a DOM app built in TypeScript, it uses no frameworks or external libraries. While the Playground lives inside the TypeScript website which is a React app, it doesn't make any use of the library. This is to keep the required technical know-how low to encourage contributions from TypeScript compiler-team members.

As an abstraction, the Playground is the editor, the sidebar and the tool bars. Different "Playgrounds" exist on the TypeScript website (like the [Bug Workbench](..?)) but the main difference is that they have different sets of default plugins.

Quite a lot of the Playground's features live inside a library called the TypeScript Sandbox, which is a wrapper for Monaco. So, Monaco lives in the Sandbox, the Sandbox lives in the Playground.

- **Monaco**: The editor component in VS Code
- **Sandbox**: A high level wrapper to monaco with TypeScript-specific APIs
- **Playground**: The user interface, plugin system and anything not involved in presenting text
