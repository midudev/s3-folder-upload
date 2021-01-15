'use strict'

const DEFAULT_DIRECTORY = 'other'
const extensionDirectoryDictionary = {
  avif: 'img',
  css: 'css',
  gif: 'img',
  html: 'html',
  ico: 'img',
  jpeg: 'img',
  jpg: 'img',
  js: 'js',
  json: 'json',
  png: 'img',
  svg: 'img',
  webp: 'img',
  woff: 'font',
  woff2: 'font'
}

module.exports = function(ext) {
  return extensionDirectoryDictionary[ext] || DEFAULT_DIRECTORY
}
