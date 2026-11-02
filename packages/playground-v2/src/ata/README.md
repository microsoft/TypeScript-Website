# Playground v2 package type acquisition

This is an independent browser ATA implementation, not an npm installer.
It downloads declarations and package metadata only. The old Playground's
`@typescript/ata` implementation is unchanged.

`PackageTypeAcquirer.acquire` takes source files, a parser-backed dependency
discovery callback (synchronous or asynchronous), project acquisition options,
and an abort signal. It returns
a complete snapshot of virtual files, ambient type package names, resolved
package versions, and per-package errors. Hosts apply only the current result;
superseded requests cannot publish stale files.

## Discovery

Corsa runs parser-backed discovery in the native compiler worker, using
`API.createSourceFile` and the compiler's imports and type-reference
arrays, plus AST traversal for literal `require` calls. Strada traverses the
selected compiler's parsed AST. Both ignore comments, ordinary strings, local
path references, and standard-library references. Literal dynamic imports,
import types, re-exports, and import-equals are supported. Existing
`// types: VERSION` annotations are preserved.

## Resolution

- Node builtin imports resolve directly to `@types/node`.
- Package subpaths resolve to their npm package; scoped DefinitelyTyped names
  use the `scope__package` convention.
- Packages with declarations supply their own types; otherwise ATA tries
  DefinitelyTyped. Registry absence permits fallback, but a broken declaration
  download or network outage is reported rather than disguised as missing types.
- Package metadata supplies dependency version ranges; runtime implementations
  and installation scripts are never fetched or run.
- All declaration variants and nested package metadata are retained so the
  compiler can interpret exports and `typesVersions`.

This intentionally uses one flat version per package, with project requests
before transitive requests. It is not a full nested npm dependency resolver.
DefinitelyTyped fallback currently uses its latest version; matching historical
compiler/package versions is a separate limitation.

## Lifecycle and policy

The global Playground setting is a network veto. Otherwise the root TSConfig's
`typeAcquisition.enable`, `include`, and `exclude` are honored. Exclusion wins
over inclusion and also filters transitive acquisition. Explicit
`compilerOptions.types` is not acquisition policy and is never overwritten.
There is no filename-based inference, so
`disableFilenameBasedTypeAcquisition` requires no extra behavior.
The host currently reads acquisition policy from the root configuration, not
from inherited configurations; the engine accepts already-resolved options.

Each run computes a new reachable snapshot. Successful packages are reused
within the session; failures are not memoized and can be retried. Exact-version
files/indexes use Cache Storage; tags are not persisted as immutable data.
Downloads use a shared concurrency limit, validate virtual paths, and enforce
package/file/response/project byte limits.

Compiler startup and initial emit do not wait for acquisition.
Diagnostics may initially report missing package types; the host recompiles
after applying the current acquisition snapshot. The host also refreshes LSP
diagnostics after package files or effective options change, so initial missing-package
markers disappear without editing the source. Progress includes pending
package names and completed/total package counts during metadata resolution,
as well as downloaded/total declaration and metadata file counts.
Both totals can increase as transitive dependencies are discovered.
Unchanged declaration packages reuse their discovered dependencies, and an
unchanged acquisition snapshot does not trigger another compilation.

The host batches acquired files into the language server's virtual filesystem
and sends one watched-files notification for the changes. Package declarations
are not opened as language-server documents: read-only Monaco models are
created only when navigating to definitions. This avoids rebuilding inferred
projects hundreds of times for large packages, while preserving completion,
definition navigation, and removal of stale dependencies.

The browser tests and offline fixtures exercise parser parity, Node imports,
DefinitelyTyped fallback, version ranges, config policy, cycles, retries,
partial failures, cancellation, and resource bounds.
