'use strict'

const path = require('path')

const POSITION_STRING_AVOID_DOT = 1
const REGEX_HASH_QUERYSTRING = /[#\\?]/g

module.exports = function (fileName) {
  const extname = path.extname(fileName)
  const endOfExt = extname.search(REGEX_HASH_QUERYSTRING)
  return endOfExt > -1
        ? extname.substring(POSITION_STRING_AVOID_DOT, endOfExt)
        : extname.substring(POSITION_STRING_AVOID_DOT)
}
