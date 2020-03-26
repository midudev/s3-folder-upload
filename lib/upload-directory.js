'use strict'

const LIMIT_CONCURRENT_FILES = 5

const async = require('async')
const globby = require('globby')

const awsClient = require('../lib/aws-client')
const awsInvalidationParameters = require('../lib/aws-invalidation-parameters')
const log = require('../lib/output')

const uploadDirectory = (
  directoryPath,
  credentials,
  options,
  invalidation,
  filesOptions
) => {
  awsClient.init({credentials, options})

  const s3 = awsClient.S3()

  log.info(`[fs] Reading directory...`)

  return new Promise((resolve, reject) => {
    globby([`${directoryPath}/**/*`], {onlyFiles: true})
      .then(files => {
        const filesToUpload = files.map(file =>
          file.replace(`${directoryPath}/`, '')
        )
        log.info(`[fs] Got ${filesToUpload.length} files to upload\n`)
        log.info(`[network] Upload ${filesToUpload.length} files...`)

        return async
          .mapLimit(
            filesToUpload,
            LIMIT_CONCURRENT_FILES,
            s3.uploadFile({directoryPath, options, filesOptions})
          )
          .then(filesUploaded => {
            log.progress('> All files uploaded successfully!', true)
            log.info(
              `\n[result] URLs of uploaded files\n${filesUploaded.join('\n')}`
            )

            if (
              awsInvalidationParameters.checkInvalidationConfig({invalidation})
            ) {
              const cloudfront = awsClient.CloudFront()
              cloudfront
                .createInvalidation({
                  distribution: invalidation.awsDistributionId,
                  paths: [invalidation.awsInvalidationPath]
                })
                .then(result => {
                  log.info(
                    `\n[result] Cloudfront invalidation created: ${result &&
                      result.Invalidation &&
                      result.Invalidation.Id}`
                  )
                  resolve()
                })
                .catch(err => {
                  log.error(err, true)
                  reject(err)
                })
            } else {
              resolve()
            }
          })
          .catch(err => {
            if (err) {
              log.error(err, true)
              reject(err)
            }
          })
      })
      .catch(_ => {
        const errorMsg = `Cannot read directory ${directoryPath} or doesn't exist`
        log.error(errorMsg, true)
        reject(new Error(errorMsg))
      })
  })
}

module.exports = uploadDirectory
