---
display: "No Implicit Override"
oneline: "Ensure overriding members in derived classes are marked with an override modifier."
---

When working with classes which use inheritance, it's possible for a sub-class to get "out of sync" with the functions it overloads when they are renamed in the base class.

For example, imagine you are modeling a music album syncing system:

```ts twoslash
class Album {
  download() {
    // Default behavior
  }
}

class SharedAlbum extends Album {
  download() {
    // Override to get info from many sources
  }
}
```

Then when you add support for machine-learning generated playlists, you refactor the `Album` class to have a 'setup' function instead:

```ts twoslash
class Album {
  setup() {
    // Default behavior
  }
}

class MLAlbum extends Album {
  setup() {
    // Override to get info from algorithm
  }
}

class SharedAlbum extends Album {
  download() {
    // Override to get info from many sources
  }
}
```

In this case, TypeScript has provided no warning that `download` on `SharedAlbum` _expected_ to override a function in the base class.

Using `noImplicitOverride` you can ensure that the sub-classes never go out of sync, by ensuring that functions which override include the keyword `override`.

The following example has `noImplicitOverride` enabled, and you can see the error received when `override` is missing:

```ts twoslash
// @noImplicitOverride
// @errors: 4114
class Album {
  setup() {}
}

class MLAlbum extends Album {
  override setup() {}
}

class SharedAlbum extends Album {
  setup() {}
}
```
