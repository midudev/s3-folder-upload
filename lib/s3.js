'use strict'

const FIELDS_FOR_CREDENTIALS = [ 'accessKeyId', 'bucket', 'region', 'secretAccessKey' ]

const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const º = require('./output')
const getContentType = require('./get-content-type')
const getDirectoryPrefix = require('./get-directory-prefix')
const getFileExtension = require('./get-file-extension')

let awsConfig
let S3

function checkConfigIsCorrect (credentials) {
  return Object
          .keys(credentials)
          .every(field => FIELDS_FOR_CREDENTIALS.indexOf(field) >= 0)
}

module.exports = {
  init (credentials) {
    º.info('[s3] Initialize Amazon S3...')
    º.info('[config] Load config credentials and start AWS S3 Client')

    if (credentials && checkConfigIsCorrect(credentials)) {
      awsConfig = credentials
    } else {
      º.info('[warn] Credentials missing or incorrect. Trying to get from ENV variable AWS_CREDENTIALS_PATH')
      try {
        awsConfig = require(process.env.AWS_CREDENTIALS_PATH)
        º.info(`[config] Got awsConfig from ${process.env.AWS_CREDENTIALS_PATH}`)
      } catch (ex) {
        º.error('[error] Impossible to set config. Are you sure to have a AWS_CREDENTIALS_PATH environment variable with the path to the credentials?', true)
      }
    }

    AWS.config.update(awsConfig)
    S3 = new AWS.S3()
    º.info('[s3] Amazon S3 initialized')
  },

  uploadFile (directoryPath) {
    return (file, done) => {
      const filePath = path.resolve(directoryPath, file)
      const fileBuffer = fs.readFileSync(filePath)
      const fileExtension = getFileExtension(file)
      const metaData = getContentType(fileExtension)
      º.progress(`Uploading ${file}...`)

      const onUpload = (err, data) => {
        if (err) { done(err) }
        º.progress(`Uploaded ${file}...`)
        done(null, data.Location)
      }

      S3.upload({
        ACL: 'public-read',
        ContentType: metaData,
        Body: fileBuffer,
        Bucket: awsConfig.bucket,
        Key: `${getDirectoryPrefix(fileExtension)}/${file}`
      }, onUpload)
    }
  }
}
