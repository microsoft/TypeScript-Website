### Hexo Shiki Twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting mixed with the twoslash JavaScript tooling from the TypeScript website.

#### Setup

1. **Install the dependency**: `yarn add hexo-shiki-twoslash`
1. **Disable `highlight`** in `./config.yml`:

   ```diff
   highlight:
   -  enable: true
   +  enable: false
   ```

1. **Configure the plugin** via `./config.yml`:

   ```yml
   shiki_twoslash:
     theme: "nord"
   ```

1. **Follow the steps in [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to add the CSS and JS requirements.
1. **Learn in [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to see what is available, this package leaves all the heavy work to that module.
