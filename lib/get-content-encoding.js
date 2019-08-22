'use strict'

const extensionContentEncoding = {
  br: 'br',
  gz: 'gzip',
  gzip: 'gzip'
}

module.exports = function(ext) {
  return extensionContentEncoding[ext]
}
