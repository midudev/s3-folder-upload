'use strict'

const LIMIT_CONCURRENT_FILES = 5

const async = require('async')
const fs = require('fs')

const s3 = require('../lib/s3')
const º = require('../lib/output')

module.exports = function (directoryPath) {
  s3.init()

  º.info(`[fs] Reading directory...`)
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      const errorMsg = `Cannot read directory ${directoryPath} or doesn't exist`
      return º.error(errorMsg, true)
    }

    º.info(`[fs] Got ${files.length} files to upload\n`)
    º.info(`[network] Upload ${files.length} files...`)

    async.mapLimit(files, LIMIT_CONCURRENT_FILES, s3.uploadFile(directoryPath), (err, filesUploaded) => {
      if (err) { return º.error(err, true) }
      º.progress('> All files uploaded successfully!', true)
      º.info(`\n[result] URLs of uploaded files\n${filesUploaded.join('\n')}`)
    })
  })
}
