'use strict'

const path = require('path')
const º = require('./lib/output')
const uploadDirectory = require('./lib/upload-directory')

const DEFAULT_DIRECTORY_NAME = 'statics'

module.exports = function (directoryToUpload) {
  directoryToUpload = directoryToUpload || DEFAULT_DIRECTORY_NAME
  const directoryPath = path.resolve(directoryToUpload)
  º.info(`[config] Directory to upload:\n\t ${directoryPath}`)
  uploadDirectory(directoryPath)
}
