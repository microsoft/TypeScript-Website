/**
 * @jest-environment node
 */

// Regression coverage for the import-time `localStorage` feature detect.
//
// Node >= 26 exposes `localStorage` as a global accessor which emits an
// ExperimentalWarning when it is read - `typeof` included - unless the process was
// started with `--localstorage-file`. The probe therefore must not touch the global
// in a bare Node process. Installing a counting accessor lets us assert that
// directly, on whichever Node version CI happens to run.

const globals = globalThis as any

/** Defines `localStorage` as an accessor and reports how many times it was read. */
const installLocalStorageAccessor = () => {
  let reads = 0
  Object.defineProperty(globals, "localStorage", {
    configurable: true,
    get() {
      reads++
      return { getItem: () => null, setItem: () => { }, removeItem: () => { } }
    },
  })
  return () => reads
}

/** Evaluates the module fresh, so the import-time probe runs again. */
const importModule = () => {
  jest.resetModules()
  require("../src")
}

afterEach(() => {
  delete globals.localStorage
  delete globals.window
})

it("does not read the localStorage global when evaluated in a bare Node process", () => {
  const reads = installLocalStorageAccessor()

  importModule()

  expect(reads()).toBe(0)
})

it("still reads the localStorage global when a DOM is present", () => {
  globals.window = {}
  const reads = installLocalStorageAccessor()

  importModule()

  expect(reads()).toBeGreaterThan(0)
})
