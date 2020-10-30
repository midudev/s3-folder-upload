'use strict'

const LIMIT_CONCURRENT_FILES = 10

const async = require('async')
const globby = require('globby')

const {initS3Client, uploadFile} = require('../lib/aws-s3')
const log = require('../lib/output')

const uploadDirectory = (directoryPath, credentials, options, filesOptions) => {
  const s3Client = initS3Client({credentials, options})
  const {bucket} = credentials

  log.info(`[fs] Reading directory...`)
  return globby([`${directoryPath}/**/*`], {onlyFiles: true})
    .then(files => {
      const filesToUpload = files.map(file =>
        file.replace(`${directoryPath}/`, '')
      )
      log.info(`[fs] Got ${filesToUpload.length} files to upload\n`)
      log.info(`[network] Upload ${filesToUpload.length} files...`)
      return filesToUpload
    })
    .then(filesToUpload =>
      async.mapLimit(filesToUpload, LIMIT_CONCURRENT_FILES, file =>
        uploadFile({
          bucket,
          directoryPath,
          file,
          options,
          filesOptions,
          s3Client
        })
      )
    )
    .then(filesUploaded => {
      log.progress('> All files uploaded successfully!', true)
      log.info(`\n[result] URLs of uploaded files\n${filesUploaded.join('\n')}`)
    })
}

module.exports = uploadDirectory
