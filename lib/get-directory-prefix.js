'use strict'

const DEFAULT_DIRECTORY = 'other'
const extensionDirectoryDictionary = {
  'css': 'css',
  'gif': 'img',
  'html': 'html',
  'ico': 'img',
  'jpg': 'img',
  'js': 'js',
  'json': 'json',
  'png': 'img',
  'svg': 'img'
}

module.exports = function (ext) {
  return extensionDirectoryDictionary[ext] || DEFAULT_DIRECTORY
}
