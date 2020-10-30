'use strict'

const fs = require('fs')
const path = require('path')
const {PutObjectCommand, S3Client} = require('@aws-sdk/client-s3')

const awsCredentials = require('./aws-credentials')
const errors = require('./errors')
const getContentEncoding = require('./get-content-encoding')
const getContentType = require('./get-content-type')
const getDirectoryPrefix = require('./get-directory-prefix')
const getFileExtension = require('./get-file-extension')
const log = require('./output')

const DEFAULT_ACL = 'public-read'
const CACHE_CONTROL = 'public, max-age=31536000'

exports.initS3Client = ({credentials, options}) => {
  log.info('[aws] Initialize AWS S3 Client...')
  log.info('[config] Load config credentials and start AWS Client')
  const {useIAMRoleCredentials} = options

  const areCredentialsOK = awsCredentials.checkCredentialsConfig({
    credentials,
    useIAMRoleCredentials
  })

  if (areCredentialsOK) {
    const {region} = credentials
    return new S3Client({region})
  } else {
    throw new Error(errors.INVALID_CREDENTIALS)
  }
}

exports.uploadFile = ({
  bucket,
  file,
  directoryPath = '',
  options = {},
  filesOptions = {},
  s3Client
}) => {
  const filePath = path.resolve(directoryPath, file)
  const fileBuffer = fs.readFileSync(filePath)
  let fileExtension = getFileExtension(file)

  const contentEncoding = getContentEncoding(fileExtension)
  fileExtension = contentEncoding
    ? getFileExtension(file, {previous: true})
    : fileExtension

  const metaData = getContentType(fileExtension)
  log.progress(`Uploading ${file}...`)

  const fileOptions = Object.assign({}, options, filesOptions[file])

  const uploadKey = fileOptions.useFoldersForFileTypes
    ? `${getDirectoryPrefix(fileExtension)}/${file}`
    : file

  const key = fileOptions.uploadFolder
    ? `${fileOptions.uploadFolder}/${uploadKey}`
    : uploadKey

  const putObjectCommand = new PutObjectCommand({
    ACL: fileOptions.ACL || DEFAULT_ACL,
    Body: fileBuffer,
    Bucket: bucket,
    CacheControl: fileOptions.CacheControl || CACHE_CONTROL,
    ContentEncoding: contentEncoding,
    ContentType: metaData,
    Key: key
  })

  return s3Client.send(putObjectCommand).then(() => {
    log.progress(`Uploaded ${file}...`)
    return `${uploadParams.Bucket}/${uploadParams.Key}`
  })
}
