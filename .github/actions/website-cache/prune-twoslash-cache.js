const fs = require("fs")
const path = require("path")

const MAX_BYTES = 64 * 1024 * 1024

function pruneTwoslashCache(directory) {
  let entries
  try {
    if (!fs.lstatSync(directory).isDirectory()) {
      throw new Error(`Expected a Twoslash cache directory: ${directory}`)
    }
    entries = fs.readdirSync(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code !== "ENOENT") throw error
    return { bytes: 0, removed: 0, removedBytes: 0 }
  }

  const files = entries.map(entry => {
    if (!entry.isFile() || !/^[a-f0-9]{40}\.json$/.test(entry.name)) {
      throw new Error(`Unexpected Twoslash cache entry: ${entry.name}`)
    }
    const filename = path.join(directory, entry.name)
    const { size, mtimeMs } = fs.statSync(filename)
    return { filename, size, mtimeMs }
  })
  files.sort((a, b) => a.mtimeMs - b.mtimeMs || a.filename.localeCompare(b.filename))

  let bytes = files.reduce((total, file) => total + file.size, 0)
  let removed = 0
  let removedBytes = 0
  for (const file of files) {
    if (bytes <= MAX_BYTES) break
    fs.unlinkSync(file.filename)
    bytes -= file.size
    removedBytes += file.size
    removed++
  }
  return { bytes, removed, removedBytes }
}

module.exports = { MAX_BYTES, pruneTwoslashCache }

if (require.main === module) {
  const directory = path.resolve(__dirname, "../../../node_modules/.cache/twoslash")
  const { bytes, removed, removedBytes } = pruneTwoslashCache(directory)
  console.log(
    `Twoslash cache: ${(bytes / 1024 / 1024).toFixed(2)} MiB retained; ` +
      `removed ${removed} entries (${(removedBytes / 1024 / 1024).toFixed(2)} MiB). ` +
      `Limit: ${MAX_BYTES / 1024 / 1024} MiB.`
  )
}
