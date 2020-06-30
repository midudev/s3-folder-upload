'use strict'

const argsParser = require('minimist')
const path = require('path')
const log = require('./lib/output')
const uploadDirectory = require('./lib/upload-directory')
const awsCredentials = require('./lib/aws-credentials')
const awsInvalidationParamenters = require('./lib/aws-invalidation-parameters')

const DEFAULT_DIRECTORY_NAME = 'statics'
const DEFAULT_OPTIONS = {
  useFoldersForFileTypes: true,
  useIAMRoleCredentials: false
}

module.exports = function(
  directoryToUpload = DEFAULT_DIRECTORY_NAME,
  credentials,
  options,
  invalidation,
  filesOptions
) {
  // initialize options object with defaults and parameters
  options = Object.assign({}, DEFAULT_OPTIONS, options)
  const {useIAMRoleCredentials} = options
  const processArgs = argsParser(process.argv.slice(2))
  // create credentials according from the object passed and
  const awsCredentialsSanitized = awsCredentials.createCredentials({
    useIAMRoleCredentials,
    processArgs,
    credentialsData: credentials,
    processEnv: process.env
  })

  const invalidationConfig = awsInvalidationParamenters.createInvalidationConfig(
    {
      invalidationData: invalidation,
      processArgs
    }
  )

  const directoryPath = path.resolve(directoryToUpload)
  log.info(`[config] Directory to upload:\n\t ${directoryPath}`)

  return uploadDirectory(
    directoryPath,
    awsCredentialsSanitized,
    options,
    invalidationConfig,
    filesOptions
  )
}
