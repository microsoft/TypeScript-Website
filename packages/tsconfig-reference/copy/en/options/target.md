---
display: "Target"
oneline: "Set the JavaScript language version for emitted JavaScript and include compatible library declarations."
---

Modern browsers support all ES6 features, so `ES6` is a good choice.
You might choose to set a lower target if your code is deployed to older environments, or a higher target if your code is guaranteed to run in newer environments.

The `target` setting changes which JS features are downleveled and which are left intact.
For example, an arrow function `() => this` will be turned into an equivalent `function` expression if `target` is ES5 or lower.

Changing `target` also changes the default value of [`lib`](#lib).
You may "mix and match" `target` and `lib` settings as desired, but you could just set `target` for convenience.

For developer platforms like Node there are baselines for the `target`, depending on the type of platform and its version. You can find a set of community organized TSConfigs at [tsconfig/bases](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases), which has configurations for common platforms and their versions.

The special `ESNext` value refers to the highest version your version of TypeScript supports.
This setting should be used with caution, since it doesn't mean the same thing between different TypeScript versions and can make upgrades less predictable.
