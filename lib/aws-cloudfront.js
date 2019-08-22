'use strict'

const log = require('./output')

const init = ({awsCloudfront}) => ({
  createInvalidation: createInvalidation({awsCloudfront})
})

const createInvalidation = ({awsCloudfront}) => ({
  distribution,
  paths = []
} = {}) => {
  return new Promise((resolve, reject) => {
    const reference = _createReference()
    const invalidation = {
      DistributionId: distribution,
      InvalidationBatch: {
        CallerReference: reference,
        Paths: {
          Quantity: paths.length,
          Items: paths
        }
      }
    }
    log.info(`[cloudfront] Invalidating paths on ${distribution} distribution`)
    awsCloudfront.createInvalidation(invalidation, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const _createReference = () => Date.now().toString()

module.exports = init
