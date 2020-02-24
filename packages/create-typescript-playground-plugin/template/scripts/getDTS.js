// @ts-check

// Grab the DTS files from the TypeScript website
// then do a bit of string manipulation in order to make it
// compile without _all_ of the dependencies

const nodeFetch = require('node-fetch').default
const { writeFileSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')

const getFileAndStoreLocally = async (url, path, editFunc) => {
  const editingFunc = editFunc ? editFunc : text => text
  const packageJSON = await nodeFetch(url)
  const contents = await packageJSON.text()
  writeFileSync(join(__dirname, '..', path), editingFunc(contents), 'utf8')
}

const go = async () => {
  const vendor = join('src', 'vendor')
  if (!existsSync(vendor)) {
    mkdirSync(vendor)
  }

  const host = 'https://www.typescriptlang.org/v2'
  // const host = "http://localhost:8000";

  await getFileAndStoreLocally(host + '/js/sandbox/tsWorker.d.ts', join(vendor, 'tsWorker.d.ts'))

  await getFileAndStoreLocally(host + '/js/playground/pluginUtils.d.ts', join(vendor, 'pluginUtils.d.ts'))

  await getFileAndStoreLocally(
    host + '/js/sandbox/vendor/typescript-vfs.d.ts',
    join(vendor, 'typescript-vfs.d.ts'),
    text => {
      const removeImports = text.replace('/// <reference types="lz-string" />', '')
      const removedLZ = removeImports.replace('import("lz-string").LZStringStatic', 'any')
      return removedLZ
    }
  )

  await getFileAndStoreLocally(host + '/js/sandbox/index.d.ts', join(vendor, 'sandbox.d.ts'), text => {
    const removeImports = text.replace(/^import/g, '// import').replace(/\nimport/g, '\n// import')
    const replaceTSVFS = removeImports.replace(
      "// import * as tsvfs from './vendor/typescript-vfs'",
      "\nimport * as tsvfs from './typescript-vfs'"
    )
    const removedLZ = replaceTSVFS.replace('lzstring: typeof lzstring', '// lzstring: typeof lzstring')
    const addedTsWorkerImport = 'import { TypeScriptWorker } from "./tsWorker";' + removedLZ
    return addedTsWorkerImport
  })

  await getFileAndStoreLocally(host + '/js/playground/index.d.ts', join(vendor, '/playground.d.ts'), text => {
    const replaceSandbox = text.replace(/typescript-sandbox/g, './sandbox')
    const replaceTSVFS = replaceSandbox.replace(
      /typescriptlang-org\/static\/js\/sandbox\/vendor\/typescript-vfs/g,
      './typescript-vfs'
    )
    const removedLZ = replaceTSVFS.replace('lzstring: typeof', '// lzstring: typeof')
    const removedWorker = removedLZ.replace('getWorkerProcess', '// getWorkerProcess')
    const removedUI = removedWorker.replace('ui:', '// ui:')
    return removedUI
  })
}

go()
