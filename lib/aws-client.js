'use strict'

const AWS = require('aws-sdk')

const log = require('./output')
const errors = require('./errors')
const awsCredentials = require('./aws-credentials')
const awsS3 = require('./aws-s3')
const awsCloudfront = require('./aws-cloudfront')

let awsConfig
let s3
let cloudfront

const init = ({credentials, options}) => {
  log.info('[aws] Initialize AWS Client...')
  log.info('[config] Load config credentials and start AWS Client')
  const {useIAMRoleCredentials} = options

  if (
    awsCredentials.checkCredentialsConfig({
      credentials,
      useIAMRoleCredentials
    })
  ) {
    awsConfig = credentials
    AWS.config.update(awsConfig)
  } else {
    throw new Error(errors.INVALID_CREDENTIALS)
  }

  s3 = undefined
  cloudfront = undefined
}

const S3 = () => {
  if (!s3) {
    s3 = awsS3({
      awsS3: new AWS.S3(),
      bucket: awsConfig.bucket
    })
    log.info('[s3] Amazon S3 initialized')
  }
  return s3
}

const CloudFront = () => {
  if (!cloudfront) {
    cloudfront = awsCloudfront({
      awsCloudfront: new AWS.CloudFront()
    })
    log.info('[cloudfront] Amazon CloudFront initialized')
  }
  return cloudfront
}

module.exports = {
  init,
  S3,
  CloudFront
}
