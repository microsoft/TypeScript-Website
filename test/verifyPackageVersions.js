const glob = require("glob")
const { readFileSync } = require("fs")

// Make sure that all the versioning is accurate across the packages
const pgkPaths = glob.sync("packages/*/package.json")
const packages = pgkPaths.map(p => JSON.parse(readFileSync(p, "utf8")))
const inWorkspace = dep => {
  return packages.find(p => p.name === dep)
}

packages.forEach(p => {
  const deps = [p.devDependencies || {}, p.dependencies || {}]
  deps.forEach(d => {
    const keysInWorkSpace = Object.keys(d).filter(dep => inWorkspace(dep))
    keysInWorkSpace.forEach(key => {
      const version = packages.find(p => p.name === key).version
      if (d[key] !== version) {
        console.error(`${p.name} has the wrong dependency for: ${key}. Expected ${version} got ${d[key]}`)
        process.exitCode = 1
      }
    })
  })
})
