'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const log = require('./output')
const getContentType = require('./get-content-type')
const getDirectoryPrefix = require('./get-directory-prefix')
const getFileExtension = require('./get-file-extension')

const CACHE_CONTROL = 'public, max-age=31536000'
const EXPIRES = 31536000 // 1 year
const FIELDS_FOR_CREDENTIALS = [
  'accessKeyId', 'bucket',
  'region', 'secretAccessKey'
]

let awsConfig
let S3

function checkConfigIsCorrect (credentials) {
  return Object
          .keys(credentials)
          .every(field => FIELDS_FOR_CREDENTIALS.indexOf(field) >= 0)
}

module.exports = {
  init (credentials) {
    log.info('[s3] Initialize Amazon S3...')
    log.info('[config] Load config credentials and start AWS S3 Client')

    if (credentials && checkConfigIsCorrect(credentials)) {
      awsConfig = credentials
    } else {
      log.info('[warn] Credentials missing or incorrect. Trying to get from ENV variable AWS_CREDENTIALS_PATH')
      try {
        awsConfig = require(process.env.AWS_CREDENTIALS_PATH)
        log.info(`[config] Got awsConfig from ${process.env.AWS_CREDENTIALS_PATH}`)
      } catch (ex) {
        log.error('[error] Impossible to set config. Are you sure to have a AWS_CREDENTIALS_PATH environment variable with the path to the credentials?', true)
      }
    }

    AWS.config.update(awsConfig)
    S3 = new AWS.S3()
    log.info('[s3] Amazon S3 initialized')
  },

  uploadFile (directoryPath) {
    return (file, done) => {
      const filePath = path.resolve(directoryPath, file)
      const fileBuffer = fs.readFileSync(filePath)
      const fileExtension = getFileExtension(file)
      const metaData = getContentType(fileExtension)
      log.progress(`Uploading ${file}...`)

      const onUpload = (err, data) => {
        if (err) { done(err) }
        log.progress(`Uploaded ${file}...`)
        done(null, data.Location)
      }

      S3.upload({
        ACL: 'public-read',
        Body: fileBuffer,
        Bucket: awsConfig.bucket,
        CacheControl: CACHE_CONTROL,
        ContentType: metaData,
        Expires: EXPIRES,
        Key: `${getDirectoryPrefix(fileExtension)}/${file}`
      }, onUpload)
    }
  }
}
