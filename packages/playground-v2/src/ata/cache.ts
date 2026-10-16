const cacheName = "playground-v2-package-types-v2"

export class PackageTypeCache {
  private cachePromise: Promise<Cache | undefined> | undefined

  private getCache() {
    this.cachePromise ??= (async () => {
      if (!("caches" in globalThis)) return undefined
      try {
        return await caches.open(cacheName)
      } catch (error) {
        console.warn("Could not open the package type cache", error)
        return undefined
      }
    })()
    return this.cachePromise
  }

  private immutable(url: string) {
    return !url.includes("/resolve/") && /@[^/]+\//.test(new URL(url).pathname)
  }

  async read(url: string, signal: AbortSignal) {
    const cache = this.immutable(url) ? await this.getCache() : undefined
    if (cache) {
      try {
        const cached = await cache.match(url)
        signal.throwIfAborted()
        return cached ? await cached.text() : undefined
      } catch (error) {
        signal.throwIfAborted()
        console.warn("Could not read the package type cache", error)
      }
    }
    return undefined
  }

  async write(url: string, text: string, signal: AbortSignal) {
    const cache = this.immutable(url) ? await this.getCache() : undefined
    signal.throwIfAborted()
    if (cache) {
      try {
        await cache.put(url, new Response(text))
      } catch (error) {
        signal.throwIfAborted()
        console.warn("Could not cache package types", error)
      }
    }
  }
}
