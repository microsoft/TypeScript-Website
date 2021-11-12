## Writing a Plugin

The TypeScript Playground allows people to hook into the Playground and extend it in ways in which we don't expect. As shown in the [Plugins](/play#handbook-11) page of this handbook, there's quite a lot of plugins already covering unique ecosystem niches.

To get started you need about 5 minutes, Node.js, yarn and Firefox/Edge or Chrome.

- **Step 1**: Use the template to bootstrap: `yarn create typescript-playground-plugin playground-my-plugin`
- **Step 2**: Run `yarn start` in the new repo, to start up the local plugin dev server
- **Step 3**: Open the "Settings" sidebar tab,and enable the setting `"Connect to localhost:5000/index.js"`
- **Step 4**: Refresh, and see the new tab. That's your plugin up and running.

If you want to jump straight in, you can read the `.d.ts` files in `vendor` which describes the Playground and Sandbox APIs.

To get a deeper understanding of how plugins work, and a guided walk-through of creating a Plugin which runs [`prettier`](http://prettier.io/) you can watch Orta Therox's TSConf 2020 talk on ["Owning the Playground"](https://www.youtube.com/watch?v=eJWtTl62gy0).
