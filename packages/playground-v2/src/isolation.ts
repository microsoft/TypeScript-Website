const reloadKey = "ts7-playground-isolation-reload"

export async function ensureCrossOriginIsolation() {
  if (globalThis.crossOriginIsolated && typeof SharedArrayBuffer !== "undefined") {
    try {
      sessionStorage.removeItem(reloadKey)
    } catch (error) {
      console.warn("Could not clear the isolation reload marker", error)
    }
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "coepCredentialless", value: false })
      void navigator.serviceWorker
        .register(new URL("./coi-serviceworker.min.js", import.meta.url), {
          updateViaCache: "none",
        })
        .catch(error => console.warn("Could not update the TypeScript serviceworker", error))
    }
    return
  }
  const unavailable =
    "This browser cannot enable the TypeScript language service. Open this page in your system browser, or choose TypeScript 6."
  if (!isSecureContext || !navigator.serviceWorker) throw new Error(unavailable)
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(new Error("Timed out enabling the TypeScript language service. Retry to reconnect.")),
    15_000
  )
  try {
    const registration = await Promise.race([
      navigator.serviceWorker.register(new URL("./coi-serviceworker.min.js", import.meta.url), {
        updateViaCache: "none",
      }),
      aborted(controller.signal),
    ])
    const worker = registration.installing ?? registration.waiting ?? registration.active
    if (!worker) throw new Error("The TypeScript serviceworker did not start. Retry to reconnect.")
    if (worker.state !== "activated") {
      await new Promise<void>((resolve, reject) => {
        const change = () => {
          if (worker.state === "activated") resolve()
          else if (worker.state === "redundant")
            reject(new Error("The TypeScript serviceworker could not activate. Retry to reconnect."))
        }
        worker.addEventListener("statechange", change, { signal: controller.signal })
        controller.signal.addEventListener("abort", () => reject(controller.signal.reason), { once: true })
        change()
      })
    }
    if (navigator.serviceWorker.controller !== worker) {
      await new Promise<void>((resolve, reject) => {
        const change = () => {
          if (navigator.serviceWorker.controller === worker) resolve()
        }
        navigator.serviceWorker.addEventListener("controllerchange", change, { signal: controller.signal })
        controller.signal.addEventListener("abort", () => reject(controller.signal.reason), { once: true })
        change()
      })
    }
    // Safari does not reliably support credentialless; all runtime CDNs support CORS.
    worker.postMessage({ type: "coepCredentialless", value: false })
    if (sessionStorage.getItem(reloadKey) === location.href) throw new Error(unavailable)
    sessionStorage.setItem(reloadKey, location.href)
    clearTimeout(timeout)
    location.reload()
    // The next document, not a worker claiming this one, receives COOP/COEP.
    await new Promise<never>(() => {})
  } catch (error) {
    if (error instanceof Error && error.message === unavailable) throw error
    throw new Error(
      `Could not enable the TypeScript language service: ${error instanceof Error ? error.message : String(error)}`
    )
  } finally {
    clearTimeout(timeout)
    controller.abort()
  }
}

function aborted(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }))
}

export function retryStartup() {
  try {
    sessionStorage.removeItem(reloadKey)
  } catch (error) {
    console.warn("Could not clear the isolation reload marker", error)
  }
  location.reload()
}
