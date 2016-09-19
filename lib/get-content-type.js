'use strict'

const DEFAULT_CONTENT_TYPE = 'application/octet-stream'
const extensionContentTypeDictionary = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpg',
  'jpg': 'image/jpg',
  'js': 'application/x-javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain',
  'xml': 'application/xml'
}

module.exports = function (ext) {
  return extensionContentTypeDictionary[ext] || DEFAULT_CONTENT_TYPE
}
