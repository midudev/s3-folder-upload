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

  globby([`${directoryPath}/**/*`], {onlyFiles: true})
    .then(files => {
      files = files.map(file => file.replace(`${directoryPath}/`, ''))
      log.info(`[fs] Got ${files.length} files to upload\n`)
      log.info(`[network] Upload ${files.length} files...`)

      async.mapLimit(
        files,
        LIMIT_CONCURRENT_FILES,
        s3.uploadFile({directoryPath, options, filesOptions}),
        (err, filesUploaded) => {
          if (err) {
            return log.error(err, true)
          }
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
              })
              .catch(err => log.error(err, true))
          }
        }
      )
    })
    .catch(_ => {
      const errorMsg = `Cannot read directory ${directoryPath} or doesn't exist`
      return log.error(errorMsg, true)
    })
}

module.exports = uploadDirectory
