import {
  createSystem,
  createVirtualTypeScriptEnvironment,
  createDefaultMapFromNodeModules,
  createDefaultMapFromCDN,
  knownLibFilesForTarget,
} from '../src'
import ts from 'typescript'

it('runs a virtual environment and gets the right results from the LSP', () => {
  const fsMap = createDefaultMapFromNodeModules(ts.ScriptTarget.ES2015)
  fsMap.set('index.ts', "const hello = 'hi'")

  const system = createSystem(fsMap)

  const compilerOpts = {}
  const env = createVirtualTypeScriptEnvironment(system, ['index.ts'], ts, compilerOpts)

  // You can then interact with the languageService to introspect the code
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

it('creates a map from the CDN without cache', async () => {
  const fetcher = jest.fn()
  fetcher.mockResolvedValue({ text: () => Promise.resolve('// Contents of file') })
  const store = jest.fn() as any

  const libs = knownLibFilesForTarget(ts.ScriptTarget.ES5, ts)
  expect(libs.length).toBeGreaterThan(0)

  const map = await createDefaultMapFromCDN(ts.ScriptTarget.ES5, '3.7.3', false, ts, undefined, fetcher, store)
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

  const libs = knownLibFilesForTarget(ts.ScriptTarget.ES5, ts)
  expect(libs.length).toBeGreaterThan(0)

  const map = await createDefaultMapFromCDN(ts.ScriptTarget.ES5, '3.7.3', true, ts, undefined, fetcher, store)
  expect(map.size).toBeGreaterThan(0)

  libs.forEach(l => expect(map.get('/' + l)).toBeDefined())

  expect(store.setItem).toBeCalledTimes(4)
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

  const libs = knownLibFilesForTarget(ts.ScriptTarget.ES5, ts)
  expect(libs.length).toBeGreaterThan(0)

  const map = await createDefaultMapFromCDN(ts.ScriptTarget.ES5, '3.7.3', true, ts, undefined, fetcher, store)
  expect(map.size).toBeGreaterThan(0)

  libs.forEach(l => expect(map.get('/' + l)).toBeDefined())

  // Should be one less fetch, and the first item would be from the cache instead
  expect(store.setItem).toBeCalledTimes(libs.length - 1)
  expect(map.get('/' + libs[0])).toMatchInlineSnapshot(`"// From Cache"`)
})
