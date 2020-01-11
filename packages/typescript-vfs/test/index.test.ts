import {
  createSystem,
  createVirtualTypeScriptEnvironment,
  createDefaultMapFromNodeModules,
  createDefaultMapFromCDN,
  knownLibFilesForCompilerOptions,
} from '../src'

import ts from 'typescript'

it('runs a virtual environment and gets the right results from the LSP', () => {
  const fsMap = createDefaultMapFromNodeModules({})
  fsMap.set('index.ts', "const hello = 'hi'")

  const system = createSystem(fsMap)

  const compilerOpts = {}
  const env = createVirtualTypeScriptEnvironment(system, ['index.ts'], ts, compilerOpts)

  // You can then interact with tqhe languageService to introspect the code
  const definitions = env.languageService.getDefinitionAtPosition('index.ts', 7)
  expect(definitions).toMatchInlineSnapshot(`
    Array [
      Object {
        "containerKind": undefined,
        "containerName": "",
        "contextSpan": Object {
          "length": 18,
          "start": 0,
        },
        "fileName": "index.ts",
        "kind": "const",
        "name": "hello",
        "textSpan": Object {
          "length": 5,
          "start": 6,
        },
      },
    ]
  `)
})

// Previously lib.dom.d.ts was not included
it('runs a virtual environment with the default globals', () => {
  const fsMap = createDefaultMapFromNodeModules({})
  fsMap.set('index.ts', "console.log('Hi!'')")

  const system = createSystem(fsMap)
  const compilerOpts = {}
  const env = createVirtualTypeScriptEnvironment(system, ['index.ts'], ts, compilerOpts)

  const definitions = env.languageService.getDefinitionAtPosition('index.ts', 7)!
  expect(definitions.length).toBeGreaterThan(0)
})

// Ensures that people can include something lib es2015 etc
it("handles 'lib' in compiler options", () => {
  const compilerOpts = {
    lib: ['es2015', 'ES2020'],
  }
  const fsMap = createDefaultMapFromNodeModules(compilerOpts)
  fsMap.set('index.ts', 'Object.keys(console)')

  const system = createSystem(fsMap)
  const env = createVirtualTypeScriptEnvironment(system, ['index.ts'], ts, compilerOpts)

  const definitions = env.languageService.getDefinitionAtPosition('index.ts', 7)!
  expect(definitions.length).toBeGreaterThan(0)
})

it('creates a map from the CDN without cache', async () => {
  const fetcher = jest.fn()
  fetcher.mockResolvedValue({ text: () => Promise.resolve('// Contents of file') })
  const store = jest.fn() as any

  const compilerOpts = { target: ts.ScriptTarget.ES5 }
  const libs = knownLibFilesForCompilerOptions(compilerOpts, ts)
  expect(libs.length).toBeGreaterThan(0)

  const map = await createDefaultMapFromCDN(compilerOpts, '3.7.3', false, ts, undefined, fetcher, store)
  expect(map.size).toBeGreaterThan(0)

  libs.forEach(l => {
    expect(map.get('/' + l)).toBeDefined()
  })
})

it('creates a map from the CDN and stores it in local storage cache', async () => {
  const fetcher = jest.fn()
  fetcher.mockResolvedValue({ text: () => Promise.resolve('// Contents of file') })

  const store: any = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  }

  const compilerOpts = { target: ts.ScriptTarget.ES5 }
  const libs = knownLibFilesForCompilerOptions(compilerOpts, ts)
  expect(libs.length).toBeGreaterThan(0)

  const map = await createDefaultMapFromCDN(compilerOpts, '3.7.3', true, ts, undefined, fetcher, store)
  expect(map.size).toBeGreaterThan(0)

  libs.forEach(l => expect(map.get('/' + l)).toBeDefined())

  expect(store.setItem).toBeCalledTimes(libs.length)
})

it('creates a map from the CDN and uses the existing local storage cache', async () => {
  const fetcher = jest.fn()
  fetcher.mockResolvedValue({ text: () => Promise.resolve('// Contents of file') })

  const store: any = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  }

  // Once return a value from the store
  store.getItem.mockReturnValueOnce('// From Cache')

  const compilerOpts = { target: ts.ScriptTarget.ES5 }
  const libs = knownLibFilesForCompilerOptions(compilerOpts, ts)
  expect(libs.length).toBeGreaterThan(0)

  const map = await createDefaultMapFromCDN(compilerOpts, '3.7.3', true, ts, undefined, fetcher, store)
  expect(map.size).toBeGreaterThan(0)

  libs.forEach(l => expect(map.get('/' + l)).toBeDefined())

  // Should be one less fetch, and the first item would be from the cache instead
  expect(store.setItem).toBeCalledTimes(libs.length - 1)
  expect(map.get('/' + libs[0])).toMatchInlineSnapshot(`"// From Cache"`)
})

describe(knownLibFilesForCompilerOptions, () => {
  it('handles blank', () => {
    const libs = knownLibFilesForCompilerOptions({}, ts)
    expect(libs.length).toBeGreaterThan(0)
  })

  it('handles a target', () => {
    const baseline = knownLibFilesForCompilerOptions({}, ts)
    const libs = knownLibFilesForCompilerOptions({ target: ts.ScriptTarget.ES2017 }, ts)
    expect(libs.length).toBeGreaterThan(baseline.length)
  })

  it('handles lib', () => {
    const baseline = knownLibFilesForCompilerOptions({}, ts)
    const libs = knownLibFilesForCompilerOptions({ lib: ['ES2020'] }, ts)
    expect(libs.length).toBeGreaterThan(baseline.length)
  })

  it('handles both', () => {
    const baseline = knownLibFilesForCompilerOptions({ target: ts.ScriptTarget.ES2016 }, ts)
    const libs = knownLibFilesForCompilerOptions({ lib: ['ES2020'], target: ts.ScriptTarget.ES2016 }, ts)
    expect(libs.length).toBeGreaterThan(baseline.length)
  })
})
