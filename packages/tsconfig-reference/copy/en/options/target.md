---
display: "Target"
---


All modern browsers support all ES6 features, so `ES6` is a good choice.
You might choose to set a lower target if your code is deployed to older environments, or a higher target if your code only runs on newer environments.

The `target` setting changes which JS features are downleveled or left intact.
For example, an arrow function `() => this` will be turned into an equivalent `function` expression if `target` is ES5 or lower.

`target` also changes the default value of [[`lib`]].
You may "mix and match" `target` and `lib` settings as desired.

The value `ESNext` refers to whatever the highest version TypeScript supports at the time is.
This setting should be used with caution, since it doesn't mean the same thing between TypeScript versions and can make upgrades less predictable.
