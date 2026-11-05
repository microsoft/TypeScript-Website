export type StradaLibraryProgress = {
  completed: number
  total: number
  fileName?: string
}

export async function loadStradaLibraries(
  roots: readonly string[],
  baseUrl: string,
  libraries: Map<string, string>,
  onProgress: (progress: StradaLibraryProgress) => void
) {
  const queue: string[] = []
  const queued = new Set<string>()
  let completed = 0
  function enqueue(fileName: string) {
    const normalized = fileName.startsWith("lib.") ? fileName : `lib.${fileName}.d.ts`
    if (queued.has(normalized)) return
    queued.add(normalized)
    queue.push(normalized)
  }
  for (const root of roots) enqueue(root)
  onProgress({ completed, total: queue.length })
  for (let next = 0; next < queue.length; ) {
    const batch = queue.slice(next, next + 8)
    next += batch.length
    await Promise.all(
      batch.map(async fileName => {
        const path = `/typescript/lib/${fileName}`
        let text = libraries.get(path)
        if (text === undefined) {
          const response = await fetch(`${baseUrl}${fileName}`)
          if (!response.ok) {
            if (response.status !== 404) throw new Error(`Could not load ${fileName}: ${response.status}`)
          } else {
            text = await response.text()
            libraries.set(path, text)
          }
        }
        if (text !== undefined) {
          for (const match of text.matchAll(/<reference\s+(?:lib|path)="([^"]+)"/g)) {
            const referenced = match[1]
            enqueue(referenced.endsWith(".d.ts") ? referenced.split("/").at(-1)! : `lib.${referenced}.d.ts`)
          }
        }
        completed++
        onProgress({ completed, total: queue.length, fileName })
      })
    )
  }
}
