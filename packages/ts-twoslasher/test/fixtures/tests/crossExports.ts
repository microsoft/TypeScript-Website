// @filename: utilFunctions.js
const getStringLength = str => str.length
module.exports = {
  getStringLength,
}

// @filename: index.ts
import utils from './utilFunctions'
const count = utils.getStringLength('Check JS')
