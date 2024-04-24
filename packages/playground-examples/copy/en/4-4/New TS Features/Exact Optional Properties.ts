//// { "compiler": { "ts": "4.4.2", "exactOptionalPropertyTypes": true } }
// With exactOptionalPropertyTypes enabled, TypeScript
// has stricter rules around what you can set an optional
// property to.

// For example, this interface declares that there is a
// property which can be one of two strings: 'dark' or 'light'
// or it should not be in the object.

interface UserDefaults {
  // The absence of a value represents 'system'
  colorThemeOverride?: "dark" | "light";
}

// Without this flag enabled, there are three values which you can
// set `colorThemeOverride` to be: "dark", "light" and `undefined`.

// Setting the value to `undefined` will allow most JavaScript runtime
// checks for the existence to fail, which is effectively falsy.
// However, there's a fuzziness to this behavior. The definition
// for `colorThemeOverride` _doesn't_ include `undefined`.

// The flag `exactOptionalPropertyTypes` makes TypeScript accurately
// match the definition provided as an optional property.

declare function getUserSettings(): UserDefaults;

const settings = getUserSettings();
settings.colorThemeOverride = "dark";
settings.colorThemeOverride = "light";

// But not:
settings.colorThemeOverride = undefined;

// Prior to the flag `exactOptionalPropertyTypes`, this was not possible.
