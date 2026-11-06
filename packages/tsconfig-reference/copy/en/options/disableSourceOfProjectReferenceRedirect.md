---
display: "Disable Redirections to Project Reference Source Files"
oneline: "When editing code, only consult declaration files from referenced projects."
---

When editing a project with [project references](/docs/handbook/project-references.html), the TypeScript language service does not require us to build all dependencies so that generated declaration files are available.
This is subtle, because this behavior means things usually "just work" in the editor, but differs from how project reference builds work, and warrants explanation.

When building project references, the compiler always expects declaration files to be generated so that less code can be held in memory at once.
This behavior works for performing a full build, but is often confusing when editing code.
When referencing code from another project, most people expect the changes to be available immediately in the editor.

For example, imagine making the following change to `projectB/src/setColor.ts`

```diff ts
  export Options {
      hue: number;
      saturation: number;
-     value: number;
+     lightness: number;
  }

  export function setColor(options: Options): void {
      // ...
  }
```

If we want to update `projectA/src/draw.ts` to call `setColor` with `lightness` instead of `value` as so:

```diff ts
  function draw() {
      // ...
      setColor({
          hue: getUserSetting("hue"),
          saturation: getUserSetting("saturation"),
-         value: getUserSetting("value"),
+         lightness: getUserSetting("lightness"),
      })
  }
```

we don't want to stop what we're doing and build `projectB` before we can get accurate errors in `projectA`, so TypeScript prefers reading source `.ts` files instead of generated `.d.ts` files if they're around.

This behavior makes editing easier, but comes at a cost.
Each file has to be resolved back to its source, and that source will likely take longer to parse and type-check than the expected declaration files.
In larger codebases, this extra work can feel very slow.

The `disableSourceOfProjectReferenceRedirect` option allows developers to opt out of loading source files over declaration files in the editor ([just as it worked before TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#build-free-editing-with-project-references)).
As a result, dependencies will need to be build with declaration files in order to get accurate error-checking, code completion, and other editor features in a project with references.
