import lzstring from "./vendor/lzstring.min"

/**
 * Grabs the sourcecode for an example from the query hash or local storage
 * @param fallback if nothing is found return this
 * @param location DI'd copy of document.location
 */
export const getInitialCode = (fallback: string, location: Location) => {
  // Old school support
  if (location.hash.startsWith("#src")) {
    const code = location.hash.replace("#src=", "").trim()
    return decodeURIComponent(code)
  }

  // New school support
  if (location.hash.startsWith("#code")) {
    const code = location.hash.replace("#code/", "").trim()
    let userCode = lzstring.decompressFromEncodedURIComponent(code)
    // Fallback incase there is an extra level of decoding:
    // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
    if (!userCode) userCode = lzstring.decompressFromEncodedURIComponent(decodeURIComponent(code))
    return userCode
  }

  // Local copy fallback
  if (localStorage.getItem("sandbox-history")) {
    return localStorage.getItem("sandbox-history")!
  }

  return fallback
}
