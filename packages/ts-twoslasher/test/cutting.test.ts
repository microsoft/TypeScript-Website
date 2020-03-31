import { twoslasher } from '../src/index'

describe('supports hiding the example code', () => {
  const file = `
const a = "123"
// ---cut---
const b = "345"
`
  const result = twoslasher(file, 'ts')

  it('hides the right code', () => {
    // Has the right code shipped
    expect(result.code).not.toContain('const a')
    expect(result.code).toContain('const b')
  })

  it.skip('shows the right LSP results', () => {
    expect(result.staticQuickInfos.find(info => info.text.includes('const a'))).toBeUndefined()

    const bLSPResult = result.staticQuickInfos.find(info => info.text.includes('const b'))
    expect(bLSPResult).toBeTruthy()

    // b is one char long
    expect(bLSPResult!.length).toEqual(1)
    // Should be at char 6
    expect(bLSPResult!.start).toEqual(6)
  })
})

describe.skip('supports hiding the example code with multi-files', () => {
  const file = `
// @filename: main-file.ts
const a = "123"
// @filename: file-with-export.ts
// ---cut---
const b = "345"
`
  const result = twoslasher(file, 'ts')

  it('shows the right LSP results', () => {
    expect(result.staticQuickInfos.find(info => info.text.includes('const a'))).toBeUndefined()

    const bLSPResult = result.staticQuickInfos.find(info => info.text.includes('const b'))
    expect(bLSPResult).toBeTruthy()

    // b is one char long
    expect(bLSPResult!.length).toEqual(1)
    // Should be at char 6
    expect(bLSPResult!.start).toEqual(6)
  })
})

describe.skip('supports handling queries in cut code', () => {
  const file = `
const a = "123"
// ---cut---
const b = "345"
//    ^?
`
  const result = twoslasher(file, 'ts')

  it('shows the right query results', () => {
    const bLSPResult = result.queries.find(info => info.start === 6)
    expect(bLSPResult).toBeTruthy()
  })
})

describe('supports handling many queries in cut multi-file code', () => {
  const file = `
// @filename: index.ts
const a = "123"
// @filename: main-file-queries.ts
const b = "345"
// ---cut---
const c = "678"
//    ^?
`
  const result = twoslasher(file, 'ts')

  it.skip('shows the right query results', () => {
    // 6 = `const ` length
    const bQueryResult = result.queries.find(info => info.start === 6)
    console.log(result.queries)
    expect(bQueryResult).toBeTruthy()
    expect(bQueryResult!.text).toContain('const b')

    // 22 = "const b = "345"\nconst "
    const cQueryResult = result.queries.find(info => info.start === 22)
    expect(cQueryResult).toBeTruthy()
    // You can only get one query per file, hard-coding this limitation in for now
    // but open to folks (or me) fixing this.
    expect(cQueryResult!.text).toContain('Could not get LSP')
  })
})
