'use strict'

const extractParameters = require('./extract-parameters')

const FIELDS_INVALIDATION_PARAMETERS = [
  'awsDistributionId',
  'awsInvalidationPath'
]

const checkInvalidationConfig = ({invalidation = {}} = {}) =>
  FIELDS_INVALIDATION_PARAMETERS.every(key => invalidation[key])

const createInvalidationFromObject = obj =>
  extractParameters({
    allowedKeys: FIELDS_INVALIDATION_PARAMETERS,
    parameters: obj
  })

const createInvalidationConfig = ({
  invalidationData = {},
  processArgs = {}
} = {}) => {
  let config = invalidationData
  if (checkInvalidationConfig({invalidation: config})) {
    return config
  }
  config = createInvalidationFromObject(processArgs)
  if (checkInvalidationConfig({invalidation: config})) {
    return config
  }
  return undefined
}

module.exports = {
  checkInvalidationConfig,
  createInvalidationConfig
}
