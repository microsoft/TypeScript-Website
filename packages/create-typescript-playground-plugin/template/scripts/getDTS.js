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

  await getFileAndStoreLocally(
    'https://www.typescriptlang.org/v2/js/sandbox/tsWorker.d.ts',
    join(vendor, 'tsWorker.d.ts'),
  )

  await getFileAndStoreLocally(
    'https://www.typescriptlang.org/v2/js/sandbox/index.d.ts',
    join(vendor, 'sandbox.d.ts'),
    text => {
      const removeImports = text.replace(/^import/g, '// import').replace(/\nimport/g, '// import')
      const removedLZ = removeImports.replace('lzstring: typeof lzstring', '// lzstring: typeof lzstring')
      const addedTsWorkerImport = 'import { TypeScriptWorker } from "./tsWorker";' + removedLZ;
      return addedTsWorkerImport;
    }
  )

  await getFileAndStoreLocally(
    'https://www.typescriptlang.org/v2/js/playground/index.d.ts',
    join(vendor, '/playground.d.ts'),
    text => {
      const replaceSandbox = text.replace(/typescript-sandbox/g, './sandbox')
      const removedLZ = replaceSandbox.replace('lzstring: typeof', '// lzstring: typeof')
      const removedWorker = removedLZ.replace('getWorkerProcess', '// getWorkerProcess')
      const removedUI = removedWorker.replace('ui:', '// ui:')
      return removedUI
    }
  )
}

go()
