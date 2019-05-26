'use strict'

const DEFAULT_CONTENT_TYPE = 'application/octet-stream'
const extensionContentTypeDictionary = {
  css: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpg',
  jpg: 'image/jpg',
  js: 'text/javascript',
  json: 'application/json',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  woff: 'application/font-woff',
  woff2: 'font/woff2',
  xml: 'application/xml'
}

module.exports = function(ext) {
  return extensionContentTypeDictionary[ext] || DEFAULT_CONTENT_TYPE
}
