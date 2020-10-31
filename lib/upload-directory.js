'use strict'

const PromisePool = require('@supercharge/promise-pool')
const readFilesFor = require('./read-recursive-folder')

const {initS3Client, uploadFile} = require('../lib/aws-s3')
const log = require('../lib/output')

const uploadDirectory = (directoryPath, credentials, options, filesOptions) => {
  const s3Client = initS3Client({credentials, options})
  const {bucket} = credentials

  log.info(`[fs] Reading directory...`)
  return readFilesFor(directoryPath)
    .then(files => {
      // remove the original directoryPath so we can use the file path as Key later
      const filesToUpload = files.map(file =>
        file.replace(`${directoryPath}/`, '')
      )
      log.info(`[fs] Got ${filesToUpload.length} files to upload\n`)
      log.info(`[network] Upload ${filesToUpload.length} files...`)
      return filesToUpload
    })
    .then(filesToUpload =>
      PromisePool.for(filesToUpload).process(file =>
        uploadFile({
          bucket,
          directoryPath,
          file,
          filesOptions,
          options,
          s3Client
        })
      )
    )
    .then(({errors, results}) => {
      if (errors.length) {
        log.error(
          `\n[s3-folder-upload] Some errors detected: ${errors.join('\n')}`
        )
      } else {
        log.progress('> All files uploaded successfully!', true)
      }
      log.info(`\n[result] URLs of uploaded files\n${results.join('\n')}`)
    })
}

module.exports = uploadDirectory
