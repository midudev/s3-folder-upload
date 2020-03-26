'use strict'

const path = require('path')
const log = require('./output')
const errors = require('./errors')
const extractParameters = require('./extract-parameters')

const ENV_AWS_CREDENTIALS_PATH = 'AWS_CREDENTIALS_PATH'
// these are the fields needed when NOT using IAM Role Credentials
const FULL_FIELDS_FOR_AWS_CREDENTIALS = [
  'accessKeyId',
  'bucket',
  'region',
  'secretAccessKey'
]
// these are the fields needed when using the IAM Role Credentials
const MINIMUM_FIELDS_FOR_AWS_CREDENTIALS = ['bucket', 'region']

const checkCredentialsConfig = ({
  credentials = {},
  useIAMRoleCredentials = false
} = {}) => {
  const fields = useIAMRoleCredentials
    ? MINIMUM_FIELDS_FOR_AWS_CREDENTIALS
    : FULL_FIELDS_FOR_AWS_CREDENTIALS

  const missingFields = fields.filter(key => !credentials[key])
  if (missingFields.length > 0) {
    log.info(`[credentials] Missing fields: ${missingFields.join(', ')}`)
    return false
  }

  return true
}

const createCredentialsFromJson = jsonPath => {
  try {
    const envAwsCredentials = require(jsonPath)

    log.info(`[credentials] Reading from ${jsonPath}`)
    return createCredentialsFromObject(envAwsCredentials)
  } catch (ex) {
    log.info(`[credentials] Impossible load credentials from ${jsonPath}`)
    return false
  }
}

const createCredentialsFromObject = obj =>
  extractParameters({
    allowedKeys: FULL_FIELDS_FOR_AWS_CREDENTIALS,
    parameters: obj
  })

const createCredentials = ({
  credentialsData = {},
  processArgs = {},
  processEnv = {},
  useIAMRoleCredentials = false
} = {}) => {
  let credentials = credentialsData
  // 1. if we want to use IAMRole Credentials, we just ignore the rest of options
  if (useIAMRoleCredentials) {
    log.info('[credentials] Using IAMRole Credentials...')
    // 1.1 Get bucket and region from credentials
    const {
      bucket: bucketFromCredentials,
      region: regionFromCredentials
    } = credentials
    // 1.2. Get bucket and region from args if available and overwrite
    const {
      bucket = bucketFromCredentials,
      region = regionFromCredentials
    } = processArgs
    // return the bucket and region, rest of credentials are automatically retrieved from instance
    return {bucket, region}
  }
  log.info('[credentials] Checking credentials from parameters...')
  // 2. Check credentials passed by config
  if (checkCredentialsConfig({credentials})) {
    log.success('[credentials] Using credentials passed by parameters')
    return credentials
  }

  log.info('[credentials] Checking credentials from CLI arguments...')
  // 3. Check credentials passed by arguments
  credentials = createCredentialsFromObject(processArgs)
  if (checkCredentialsConfig({credentials})) {
    log.success('[credentials] Using credentials from CLI arguments...')
    return credentials
  }

  const credentialsPath =
    processEnv[ENV_AWS_CREDENTIALS_PATH] ||
    path.resolve(process.cwd(), 'aws-credentials.json')
  log.info(`[credentials] Checking credentials from ${credentialsPath}...`)

  // 4. Check credentials passed by json file
  credentials = createCredentialsFromJson(credentialsPath)
  if (credentials && checkCredentialsConfig({credentials})) {
    return credentials
  }

  log.error('[credentials] ERROR: No credentials provided')
  // If none worked, then throw an error
  throw new Error(errors.INVALID_CREDENTIALS)
}

module.exports = {
  checkCredentialsConfig,
  createCredentials
}
