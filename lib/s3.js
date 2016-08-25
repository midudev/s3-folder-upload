'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const º = require('./output')
const getContentType = require('./get-content-type')
const getDirectoryPrefix = require('./get-directory-prefix')
const getFileExtension = require('./get-file-extension')

let awsConfig = require('../aws-credentials.json')
let S3

module.exports = {
  init () {
    º.info('[s3] Initialize Amazon S3...')
    º.info('[config] Load config credentials and start AWS S3 Client')

    try {
      awsConfig = require('../aws-credentials.json')
      AWS.config.update(awsConfig)
    } catch (ex) {
      º.error('[error] Impossible to set config. Do you have the aws-credentials.json in the root?')
    }
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
