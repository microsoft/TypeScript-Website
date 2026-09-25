import { setupTypeAcquisition } from "@typescript/ata"

type TypeAcquisitionOptions = {
  onFile(fileName: string, text: string): void
  onProgress(downloaded: number, total: number): void
  onStart(): void
  typescript: typeof import("typescript")
}

const cacheName = "ts7-playground-package-types-v1"

export function createTypeAcquisition(options: TypeAcquisitionOptions) {
  let receivedFiles = 0
  const acquire = setupTypeAcquisition({
    delegate: {
      progress: options.onProgress,
      receivedFile(text, fileName) {
        receivedFiles++
        options.onFile(`/workspace${fileName}`, text)
      },
      started: options.onStart,
    },
    fetcher: cachedFetch,
    logger: console,
    projectName: "TypeScript Playground",
    typescript: options.typescript,
  })

  return async (source: string) => {
    const before = receivedFiles
    await acquire(source)
    return receivedFiles - before
  }
}

export function hasPackageImports(source: string) {
  const patterns = [
    /\b(?:import|export)\b[^"'`]*\bfrom\s*["']([^"']+)["']/g,
    /\b(?:import|require)\s*\(\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /<reference\s+types=["']([^"']+)["']/g,
  ]
  for (const pattern of patterns) {
    let match: RegExpExecArray | null
    while ((match = pattern.exec(source))) {
      if (!match[1].startsWith(".") && !match[1].startsWith("/")) return true
    }
  }
  return false
}

async function cachedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const request = new Request(input, init)
  if (request.method !== "GET" || init?.cache === "no-store") return fetch(request)

  let cache: Cache | undefined
  try {
    cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    if (cached) return cached
  } catch (error) {
    console.warn("Could not read the package type cache", error)
  }

  const response = await fetch(request)
  if (!response.ok) {
    throw new Error(`Could not download package types from ${request.url}: ${response.status} ${response.statusText}`)
  }
  if (cache) {
    try {
      await cache.put(request, response.clone())
    } catch (error) {
      console.warn("Could not cache package types", error)
    }
  }
  return response
}
