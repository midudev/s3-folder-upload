'use strict'

const argsParser = require('minimist')
const log = require('./output')
const errors = require('./errors')

const awsCredentials = require('./aws-credentials')
const awsInvalidationParameters = require('./aws-invalidation-parameters')
const extractParameters = require('./extract-parameters')

const BOOLEAN_FIELDS_FOR_OPTIONS = ['useFoldersForFileTypes', 'useIAMRoleCredentials']
const STRING_FIELDS_FOR_OPTIONS = ['uploadFolder']

const ARG_PARSER_OPTIONS = {
  boolean: BOOLEAN_FIELDS_FOR_OPTIONS,
  string: STRING_FIELDS_FOR_OPTIONS,
}

const buildParameters = ({args = [], env = {}} = {}) => {
  const parsedArgs = argsParser(args, ARG_PARSER_OPTIONS)
  const {useIAMRoleCredentials} = parsedArgs

  const directories = parsedArgs._
  if (directories.length === 0) {
    log.error(`[warn] You need to specify a directory located on the root.
      For example: s3-folder-upload statics`)
    throw new Error(errors.NO_DIRECTORIES_TO_UPLOAD)
  }

  const credentials = awsCredentials.createCredentials({
    processArgs: parsedArgs,
    processEnv: env,
    useIAMRoleCredentials
  })

  const options = extractParameters({
    allowedKeys: BOOLEAN_FIELDS_FOR_OPTIONS.concat(STRING_FIELDS_FOR_OPTIONS),
    parameters: parsedArgs
  })

  const invalidation = awsInvalidationParameters.createInvalidationConfig({
    processArgs: parsedArgs
  })

  return {directories, credentials, options, invalidation}
}

module.exports = buildParameters
