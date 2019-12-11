---
display: "Root Dirs"
---

Using `rootDirs`, you can inform the compiler that there are many "virtual" directories acting as a single root. 
This allows the compiler to resolve relative module imports within these "virtual" directories, as if they were merged in to one directory.

For example:

```
 src
 └── views
     └── view1.ts (can import "./template1", "./view2`)
     └── view2.ts (can import "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (can import "./view1", "./view2")
```

```json
{
  "compilerOptions": {
    "rootDirs": [
      "src/views",
      "generated/templates/views"
    ]
  }
}
```

This does not affect how TypeScript emits JavaScript, it only emulates the assumption that they will be able to
work via those relative paths at runtime.
