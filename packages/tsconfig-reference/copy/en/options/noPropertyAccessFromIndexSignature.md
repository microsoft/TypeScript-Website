---
display: "No Property Access From Index Signature"
oneline: "Enforces using indexed accessors for keys declared using an indexed type."
---

This setting ensures consistency between accessing a field via the "dot" (`obj.key`) syntax, and "indexed" (`obj["key"]`) and the way which the property is declared in the type.

Without this flag, TypeScript will allow you to use the dot syntax to access fields which are not defined:

```ts twoslash
// @errors: 4111
declare function getSettings(): GameSettings;
// ---cut---
interface GameSettings {
  // Known up-front properties
  speed: "fast" | "medium" | "slow";
  quality: "high" | "low";

  // Assume anything unknown to the interface
  // is a string.
  [key: string]: string;
}

const settings = getSettings();
settings.speed;
//       ^?
settings.quality;
//       ^?

// Unknown key accessors are allowed on
// this object, and are `string`
settings.username;
//       ^?
```

Turning the flag on will raise an error because the unknown field uses dot syntax instead of indexed syntax.

```ts twoslash
// @errors: 4111
// @noPropertyAccessFromIndexSignature
declare function getSettings(): GameSettings;
interface GameSettings {
  speed: "fast" | "medium" | "slow";
  quality: "high" | "low";
  [key: string]: string;
}
// ---cut---
const settings = getSettings();
settings.speed;
settings.quality;

// This would need to be settings["username"];
settings.username;
//       ^?
```

The goal of this flag is to signal intent in your calling syntax about how certain you are this property exists.
