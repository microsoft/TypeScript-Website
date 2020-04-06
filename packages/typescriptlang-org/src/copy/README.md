### Website App Locales

These folders contain the language files used by the website in JSX and in JS, today they are just JS objects
built up from a bunch of smaller scoped modules.

For now, they are not automatically applied, but I'm thinking about ways to do that so it matches the rest of the localization effort.

### Creating a New Language Root

Add a new file next to the `en.ts`, and `ja.ts` - it should look something like:

```ts
import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"

// Now your imports, which overwrite the English copy
import { playCopy } from "./ja/playground"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...playCopy,
})
```

### Adding a New File

Drop the new file into your defineMessages function:

```diff
import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"

// Now your imports, which overwrite the English copy
import { playCopy } from "./ja/playground"
+ import { navCopy } from "./ja/nav"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...playCopy,
+  ...navCopy
})
```
