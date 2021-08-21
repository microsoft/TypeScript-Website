const unpkgURL = (name: string, path: string) => {
  if (!name) {
    const actualName = path.substring(0, path.indexOf("/"))
    const actualPath = path.substring(path.indexOf("/") + 1)
    return `https://www.unpkg.com/${encodeURIComponent(actualName)}/${encodeURIComponent(actualPath)}`
  }
  return `https://www.unpkg.com/${encodeURIComponent(name)}/${encodeURIComponent(path)}`
}
