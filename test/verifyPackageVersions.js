// @ts-check
const glob = require("glob")
const { readFileSync, writeFileSync } = require("fs")
const { format } = require("prettier")

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
    const [major, minor, patch] = p.version.split(".")
    if (major !== "0" && minor !== "0" && patch !== "0") {
      p.version = `${major}.${minor}.${Number(patch) + 1}`
    }
    writeFileSync(d.path, format(JSON.stringify(p), { filepath: d.path }))
  }
})

if (process.exitCode) {
  console.log("You can automatically fix these fails by running `node test/verifyPackageVersions.js`")
}
