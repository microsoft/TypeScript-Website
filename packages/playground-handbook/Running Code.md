## Running Code

The TypeScript playground has an obvious focus on TypeScript - I mean it's in the name (right?), and types in TypeScript are ephemeral (they don't affect the running code) so earlier versions of the Playground did not have support for running the code in your browser.

This turned out to be an oversight, because the TypeScript types and JavaScript runtime are not always perfectly in sync and `eval`ing that code can sometimes be a great way to understand whether the types you have written match the runtime results of your code.

In the editor toolbar, the one which is not visible because you're reading this handbook, is a "Run" button. Hitting this run button will:

- Take the code in the editor and convert it to JS
- Remove references to `"reflect-metadata"` if you are using decorators
- Run that code within the context of your current browser session
- Capture any `console.log`, `.error`, `.warn` and `.debug` calls and show them in the sidebar "Logs" tab.

You can also use the key command <kbd>ctrl/</kbd>/<kbd>cmd</kbd> + <kbd>enter</kbd> to trigger running your code.

Your code running in your browser means that you can experiment with the DOM APIs inside a TypeScript environment. The Playground includes examples for working with [the DOM](https://www.typescriptlang.org/play?useJavaScript=trueq=185#example/typescript-with-web) and with [WebGL](https://www.typescriptlang.org/play/?useJavaScript=trueq=461#example/typescript-with-webgl) which are good showcases of how that can work.

Convenient, that's kind of the perfect segue to the [Examples section of the handbook]()
