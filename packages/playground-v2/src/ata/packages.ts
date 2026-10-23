const nodeModules = new Set([
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "sys",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
])

export function packageName(specifier: string): string | undefined {
  if (specifier === "node" || specifier.startsWith("node:") || nodeModules.has(specifier.split("/")[0]))
    return "@types/node"
  if (/^(?:[./#]|[a-z][a-z\d+.-]*:)/i.test(specifier)) return undefined
  const parts = specifier.split("/")
  const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
  if (!/^(?:@[a-z\d._-]+\/)?[a-z\d_][a-z\d._-]*$/i.test(name)) {
    throw new Error(`Invalid package specifier: ${specifier}`)
  }
  return name
}

export function definitelyTypedName(name: string) {
  if (name.startsWith("@types/")) return name
  return `@types/${name.startsWith("@") ? name.slice(1).replace("/", "__") : name}`
}

export function runtimePackageName(typesName: string) {
  const name = typesName.slice("@types/".length)
  return name.includes("__") ? `@${name.replace("__", "/")}` : name
}

export function isDeclaration(path: string) {
  return /\.d\.(?:ts|mts|cts)$/i.test(path)
}

export function safePackagePath(path: string) {
  return (
    path.startsWith("/") &&
    !/[\\%?#\u0000-\u001f]/.test(path) &&
    !path
      .slice(1)
      .split("/")
      .some(part => part === ".." || part === "." || part === "")
  )
}
