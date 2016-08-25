'use strict'

const DEFAULT_DIRECTORY_NAME = 'statics'
const LIMIT_CONCURRENT_FILES = 5

const async = require('async')
const fs = require('fs')
const path = require('path')

const s3 = require('../lib/s3')
const º = require('../lib/output')

const directoryPath = path.resolve(DEFAULT_DIRECTORY_NAME)
º.info(`[config] Directory to upload:\n\t ${directoryPath}`)

s3.init()

º.info(`[fs] Reading directory...`)
fs.readdir(directoryPath, (err, files) => {
  if (err) { return º.error(err, true) }
  º.info(`[fs] Got ${files.length} files to upload\n`)
  º.progress(`Uploading ${files.length} files...`)

  async.mapLimit(files, LIMIT_CONCURRENT_FILES, s3.uploadFile(directoryPath), (err, filesUploaded) => {
    if (err) { return º.error(err, true) }
    º.progress('> All files uploaded successfully!', true)
    º.info(`\nList of Uploaded files:\n${filesUploaded.join('\n')}`)
  })
})
