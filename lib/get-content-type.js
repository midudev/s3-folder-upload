'use strict'

const DEFAULT_CONTENT_TYPE = 'application/octet-stream'
const extensionContentTypeDictionary = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpg': 'image/jpg',
  'js': 'application/x-javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml'
}

module.exports = function (ext) {
  return extensionContentTypeDictionary[ext] || DEFAULT_CONTENT_TYPE
}
