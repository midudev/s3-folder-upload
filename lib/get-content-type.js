'use strict'

const DEFAULT_CONTENT_TYPE = 'application/octet-stream'
const extensionContentTypeDictionary = {
  avif: 'image/avif',
  css: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpg',
  jpg: 'image/jpg',
  js: 'application/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  webp: 'image/webp',
  woff: 'application/font-woff',
  woff2: 'font/woff2',
  xml: 'application/xml'
}

module.exports = ext =>
  extensionContentTypeDictionary[ext] || DEFAULT_CONTENT_TYPE
