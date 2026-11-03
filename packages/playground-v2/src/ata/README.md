# Package type acquisition

`PackageTypeAcquirer.acquire` accepts source files, a parser-backed `discover`
callback, acquisition options, and an abort signal. It returns a complete declaration
snapshot and per-package errors. See [types.ts](types.ts) for the interfaces.

Only declarations and package metadata are downloaded, never package JavaScript.
Packages use their own declarations when available, falling back to
DefinitelyTyped. Node builtins use `@types/node`. Source annotations of the form
`// types: VERSION` select a package version.

The Playground's automatic-types setting disables all acquisition. Otherwise,
the root configuration's `typeAcquisition` options apply; exclusions win.
Inherited acquisition settings and filename-based inference are not supported.
An explicit root `compilerOptions.types` list is preserved.

Only one version of each package can be loaded at a time. DefinitelyTyped
fallback uses its latest version, which may not support historical compilers.
