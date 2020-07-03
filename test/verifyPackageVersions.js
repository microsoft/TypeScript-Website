// @ts-check
const glob = require("glob")
const { readFileSync, writeFileSync } = require("fs")

// Make sure that all the versioning is accurate across the packages
const pgkPaths = glob.sync("packages/*/package.json")
const packages = pgkPaths.map(p => ({ path: p, pkg: JSON.parse(readFileSync(p, "utf8")) }))
const inWorkspace = dep => {
  return packages.find(p => p.pkg.name === dep)
}

packages.forEach(d => {
  const p = d.pkg
  const deps = [p.devDependencies || {}, p.dependencies || {}]
  let write = false
  deps.forEach(d => {
    const keysInWorkSpace = Object.keys(d).filter(dep => inWorkspace(dep))
    keysInWorkSpace.forEach(key => {
      const version = packages.find(p => p.pkg.name === key).pkg.version
      if (d[key] !== version) {
        console.error(`${p.name} has the wrong dependency for: ${key}. Expected ${version} got ${d[key]}`)
        process.exitCode = 1
        d[key] = version
        write = true
      }
    })
  })
  if (write) {
    writeFileSync(d.path, JSON.stringify(p))
  }
})
