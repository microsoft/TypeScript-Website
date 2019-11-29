// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/generateJSON.ts
     yarn ts-node packages/tsconfig-reference/scripts/generateJSON.ts
*/

import * as ts from 'typescript'

import { CommandLineOptionBase } from './types'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { format } from 'prettier'
import {
  denyList,
  relatedTo,
  deprecated,
  internal,
  defaultsForOptions,
  recommended,
  allowedValues,
  configToRelease,
} from './tsconfigRules'
import { CompilerOptionName } from '../data/_types'

const toJSONString = obj => format(JSON.stringify(obj, null, '  '), { filepath: 'thing.json' })
const writeJSON = (name, obj) => writeFileSync(join(__dirname, '..', 'data', name), toJSONString(obj))
const writeString = (name, text) => writeFileSync(join(__dirname, '..', 'data', name), format(text, { filepath: name }))

export interface CompilerOptionJSON extends CommandLineOptionBase {
  releaseVersion?: string
  allowedValues?: string[]
  categoryCode?: number
  related?: string[]
  deprecated?: string
  internal?: true
  recommended?: true
  defaultValue?: string
}

// @ts-ignore because this is private
const options = ts.optionDeclarations as CompilerOptionJSON[]
const categories = new Set<ts.DiagnosticMessage>()

// Cut down the list
const filteredOptions = options
  .filter(o => !denyList.includes(o.name as CompilerOptionName))
  .filter(o => !o.isCommandLineOnly)

filteredOptions.forEach(option => {
  const name = option.name as CompilerOptionName

  // Convert JS Map types to a JSONable obj
  if ('type' in option && typeof option.type === 'object' && 'get' in option.type) {
    // Option definitely has a map obj, need to resolve it
    const newOptions = {}
    option.type.forEach((v, k) => (newOptions[k] = v))
    // @ts-ignore
    option.type = newOptions
  }

  // Convert categories to be something which can be looked up
  if ('category' in option) {
    categories.add(option.category)
    option.categoryCode = option.category.code
    option.category = undefined
  }

  // If it's got related fields, set them
  const relatedMetadata = relatedTo.find(a => a[0] == name)
  if (relatedMetadata) {
    option.related = relatedMetadata[1]
  }

  if (deprecated.includes(name)) {
    option.deprecated = 'Deprecated'
  }

  if (internal.includes(name)) {
    option.internal = true
  }

  if (recommended.includes(name)) {
    option.recommended = true
  }

  if (name in allowedValues) {
    option.allowedValues = allowedValues[name]
  }

  if (name in configToRelease) {
    option.releaseVersion = configToRelease[name]
  }

  if (name in defaultsForOptions) {
    option.defaultValue = defaultsForOptions[name]
  }

  // Remove irrelevant properties
  delete option.shortName
  delete option.showInSimplifiedHelpView
})

const topLevelTSConfigOptions: CompilerOptionJSON[] = [
  {
    name: 'files',
    type: 'list',
    categoryCode: 0,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
  {
    name: 'include',
    type: 'list',
    categoryCode: 0,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
  {
    name: 'exclude',
    type: 'list',
    categoryCode: 0,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
  {
    name: 'extends',
    type: 'string',
    categoryCode: 0,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
  {
    name: 'typeAcquisition',
    type: 'string',
    categoryCode: 0,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
  {
    name: 'references',
    type: 'string',
    categoryCode: 0,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
  {
    name: 'importHelpers',
    type: 'string',
    categoryCode: 6178,
    // @ts-ignore
    description: {
      message: 'Print names of files part of the compilation.',
    },
    defaultValue: 'false',
  },
]

writeJSON('tsconfigOpts.json', { options: [...topLevelTSConfigOptions, ...filteredOptions] })

// Improve the typing for the rules
writeString(
  '_types.ts',
  `// __auto-generated__ \n\n export type CompilerOptionName = '${options.map(o => o.name).join("' | '")}'`
)

const categoryMap = {}
categories.forEach(c => (categoryMap[c.code] = c))

// Add custom categories, for custom compiler flags

categoryMap['0'] = {
  code: 0,
  category: 3,
  key: 'Project_Files_0',
  message: 'Project File Management',
}

writeJSON('tsconfigCategories.json', categoryMap)

// @ts-ignore - Print the defaults for a TS Config file
const defaults = ts.defaultInitCompilerOptions
writeJSON('tsconfigDefaults.json', defaults)
