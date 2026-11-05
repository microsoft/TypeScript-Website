export type CompilerAssetMetadata = { size: number; integrity: string }

export class CompilerDownloadError extends Error {
  constructor(url: string, readonly status: number) {
    super(`Unable to load ${url}: HTTP ${status}`)
  }
}

export async function fetchCompilerResource<T>(
  url: URL,
  read: (response: Response) => Promise<T>,
  options: { cache?: RequestCache; timeout?: number; onRetry?(): void } = {}
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    let response: Response | undefined
    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(options.timeout ?? 30_000),
        cache: attempt === 0 ? options.cache : "no-store",
      })
      if (!response.ok) throw new CompilerDownloadError(url.href, response.status)
      return await read(response)
    } catch (error) {
      await response?.body?.cancel().catch(() => {})
      const permanent =
        error instanceof CompilerDownloadError && error.status !== 408 && error.status !== 429 && error.status < 500
      if (attempt === 2 || permanent) throw error
      console.warn(`Retrying compiler download (${attempt + 2}/3): ${url.href}`, error)
      options.onRetry?.()
      await new Promise(resolve => setTimeout(resolve, 300 * 2 ** attempt))
    }
  }
}

export async function readResponseBytes(
  response: Response,
  onProgress: (length: number) => void,
  maximum = Infinity
): Promise<Uint8Array<ArrayBuffer>> {
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.length > maximum) throw new Error("Compiler download is larger than expected")
    onProgress(bytes.length)
    return bytes
  }
  const chunks: Uint8Array[] = []
  const reader = response.body.getReader()
  let length = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.length
      if (length > maximum) throw new Error("Compiler download is larger than expected")
      chunks.push(value)
      onProgress(length)
    }
  } catch (error) {
    await reader.cancel().catch(() => {})
    throw error
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return bytes
}

export async function downloadCompilerAsset(
  url: URL,
  metadata: CompilerAssetMetadata,
  options: {
    cache?: Pick<Cache, "match" | "delete" | "put">
    onProgress(length: number): void
    onSource(cached: boolean): void
    onRetry(): void
  }
) {
  const request = new Request(url)
  const validate = async (response: Response) => {
    if (!response.ok) throw new CompilerDownloadError(url.href, response.status)
    const bytes = await readResponseBytes(response, options.onProgress, metadata.size)
    if (bytes.length !== metadata.size) {
      throw new Error(`Incomplete compiler download: ${url.pathname} (${bytes.length}/${metadata.size} bytes)`)
    }
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))
    const integrity = `sha256-${btoa(String.fromCharCode(...digest))}`
    if (integrity !== metadata.integrity)
      throw new Error(`Compiler download failed integrity validation: ${url.pathname}`)
    return bytes
  }
  let cached: Response | undefined
  try {
    cached = await options.cache?.match(request)
  } catch (error) {
    console.warn("Could not read the TypeScript asset cache", error)
  }
  if (cached) {
    options.onSource(true)
    try {
      return await validate(cached)
    } catch (error) {
      console.warn(`Discarding invalid cached compiler asset: ${url.pathname}`, error)
      try {
        await options.cache?.delete(request)
      } catch (cacheError) {
        console.warn("Could not remove the invalid TypeScript asset", cacheError)
      }
    }
  }
  options.onSource(false)
  const bytes = await fetchCompilerResource(url, validate, {
    // A previous browser HTTP cache entry may be as incomplete as the app cache.
    cache: cached ? "no-store" : "default",
    timeout: 120_000,
    onRetry: options.onRetry,
  })
  try {
    await options.cache?.put(request, new Response(bytes))
  } catch (error) {
    console.warn("Could not cache the validated TypeScript asset", error)
  }
  return bytes
}
