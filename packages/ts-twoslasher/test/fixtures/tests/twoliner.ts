// @filename: getStringLength.ts
export const getStringLength = (str: string) => str.length
// @filename: index.ts
import { getStringLength } from './getStringLength'
const b = getStringLength('string')
