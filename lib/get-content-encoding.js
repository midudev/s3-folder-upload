'use strict'

const extensionContentEncoding = {
  br: 'br',
  gz: 'gzip',
  gzip: 'gzip'
}

module.exports = ext => extensionContentEncoding[ext]
