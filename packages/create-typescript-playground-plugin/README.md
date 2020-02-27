## create-typescript-playground-plugin

A template for creating new plugins for the TypeScript playground.

<h2>Quick Tutorial</h2>
<p>You need about 5 minutes, Node.js, yarn and a Chromium based browser.</p>
<p><b>Step 1</b>: Use the template to bootstrap: <code>npm init typescript-playground-plugin MyPlugin</code></p>
<p><b>Step 2</b>: Run <code>yarn start</code> in the new repo, to start up the local dev server</p>
<p><b>Step 3</b>: Open the <a href={withPrefix("/play")}>playground</a> in your Chromium browser, click "Options" and enable <code>"Connect to localhost:5000/index.js"</code></p>
<p><b>Step 4</b>: Refresh, and see the new tab. That's your plugin up and running</p>
<p>&nbsp;</p>
<p>That's all the pieces working in tandem, now you can make changes to the template and build out your plugin. The plugin in dev mode will always become forefront when connected, so you can re-load without a lot off clicks. To understand the template's technology, read the <a href='https://github.com/microsoft/TypeScript-Website/blob/v2/packages/create-playground-plugin/template/CONTRIBUTING.md'>CONTRIBUTING.md</a></p>
