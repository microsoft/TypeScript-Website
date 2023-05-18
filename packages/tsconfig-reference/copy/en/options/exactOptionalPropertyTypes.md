---
display: "Exact Optional Property Types"
oneline: "Interpret optional property types as written, rather than adding `undefined`."
---

With exactOptionalPropertyTypes enabled, TypeScript applies stricter rules around how it handles properties on `type` or `interfaces` which have a `?` prefix.

For example, this interface declares that there is a property which can be one of two strings: 'dark' or 'light' or it should not be in the object.

```ts
interface UserDefaults {
  // The absence of a value represents 'system'
  colorThemeOverride?: "dark" | "light";
}
```

Without this flag enabled, there are three values which you can set `colorThemeOverride` to be: "dark", "light" and `undefined`.

Setting the value to `undefined` will allow most JavaScript runtime checks for the existence to fail, which is effectively falsy. However, this isn't quite accurate `colorThemeOverride: undefined` is not the same as `colorThemeOverride` not being defined. For example `"colorThemeOverride" in settings` would have different behavior with `undefined` as the key compared to not being defined.

`exactOptionalPropertyTypes` makes TypeScript truly enforce the definition provided as an optional property:

```ts twoslash
// @exactOptionalPropertyTypes
// @errors: 2322 2412
interface UserDefaults {
  colorThemeOverride?: "dark" | "light";
}
declare function getUserSettings(): UserDefaults;
// ---cut---
const settings = getUserSettings();
settings.colorThemeOverride = "dark";
settings.colorThemeOverride = "light";

// But not:
settings.colorThemeOverride = undefined;
```
