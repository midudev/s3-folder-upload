'use strict'

const path = require('path')
const log = require('./output')
const errors = require('./errors')
const extractParameters = require('./extract-parameters')

const ENV_AWS_CREDENTIALS_PATH = 'AWS_CREDENTIALS_PATH'
const FIELDS_FOR_AWS_CREDENTIALS = [
  'accessKeyId',
  'bucket',
  'region',
  'secretAccessKey'
]

const checkCredentialsConfig = ({credentials = {}} = {}) =>
  FIELDS_FOR_AWS_CREDENTIALS.every(key => credentials[key])

const createCredentialsFromJson = jsonPath => {
  let credentials = {}
  console.log(jsonPath)
  try {
    const envAwsCredentials = require(jsonPath)
    console.log(envAwsCredentials)
    log.info(`[config] Got awsConfig from ${jsonPath}`)
    credentials = createCredentialsFromObject(envAwsCredentials)
    console.log(credentials)
  } catch (ex) {
    log.error(`[warn] Impossible load credentials from ${jsonPath}`)
    throw new Error(errors.INVALID_CREDENTIALS)
  }
  return credentials
}

const createCredentialsFromObject = obj =>
  extractParameters({allowedKeys: FIELDS_FOR_AWS_CREDENTIALS, parameters: obj})

const createCredentials = ({
  credentialsData = {},
  processArgs = {},
  processEnv = {},
  useIAMRoleCredentials
} = {}) => {
  // if we want to use IAMRole Credentials, we just ignore the rest of options
  if (useIAMRoleCredentials) return undefined

  let credentials = credentialsData
  if (checkCredentialsConfig({credentials})) {
    return credentials
  }

  credentials = createCredentialsFromObject(processArgs)
  if (checkCredentialsConfig({credentials})) {
    return credentials
  }

  const credentialsPath =
    processEnv[ENV_AWS_CREDENTIALS_PATH] ||
    path.resolve(process.cwd(), 'aws-credentials.json')

  credentials = createCredentialsFromJson(credentialsPath)
  if (checkCredentialsConfig({credentials})) {
    return credentials
  }

  throw new Error(errors.INVALID_CREDENTIALS)
}

module.exports = {
  checkCredentialsConfig,
  createCredentials
}
