const expect = require('chai').expect

const awsInvalidationParameters = require('../../lib/aws-invalidation-parameters')

describe('AWS Invalidation Parameters', () => {
  describe('checkInvalidationConfig method', () => {
    it('Should return true if given args are complete', () => {
      const givenInvalidation = {
        awsDistributionId: 'whatever',
        awsInvalidationPath: '/*'
      }
      const check = awsInvalidationParameters.checkInvalidationConfig({
        invalidation: givenInvalidation
      })
      expect(check, 'The check should be satisfied').to.be.true
    })
    it('Should return false if given args are incomplete', () => {
      const givenInvalidation = {
        awsDistributionId: 'whatever'
      }
      const check = awsInvalidationParameters.checkInvalidationConfig({
        invalidation: givenInvalidation
      })
      expect(check, 'The check should not be satisfied').to.be.false
    })
    it('Should return false no args are given', () => {
      const check = awsInvalidationParameters.checkInvalidationConfig()
      expect(check, 'The check should not be satisfied').to.be.false
    })
  })
  describe('createInvalidationConfig method', () => {
    it('Should return invalidationData if its data is complete', () => {
      const givenInvalidationData = {
        awsDistributionId: 'fromData',
        awsInvalidationPath: '/*'
      }
      const givenProcessArgs = {
        awsDistributionId: 'fromProcess',
        awsInvalidationPath: '/*'
      }
      const invalidation = awsInvalidationParameters.createInvalidationConfig({
        invalidationData: givenInvalidationData,
        processArgs: givenProcessArgs
      })
      expect(
        invalidation,
        'The invalidation data should be taken from given data object'
      ).to.deep.equal(givenInvalidationData)
    })
    it('Should return data from process args if invalidation data is incomplete', () => {
      const givenInvalidationData = {}
      const givenProcessArgs = {
        aKey: 'value',
        awsDistributionId: 'fromProcess',
        awsInvalidationPath: '/*',
        someOtherKey: 'value'
      }
      const invalidation = awsInvalidationParameters.createInvalidationConfig({
        invalidationData: givenInvalidationData,
        processArgs: givenProcessArgs
      })
      const expectedInvalidation = {
        awsDistributionId: 'fromProcess',
        awsInvalidationPath: '/*'
      }
      expect(
        invalidation,
        'The invalidation data should be extracted from process args'
      ).to.deep.equal(expectedInvalidation)
    })
    it('Should return undefined if no valid data is given', () => {
      const givenInvalidationData = {}
      const givenProcessArgs = {}
      const invalidation = awsInvalidationParameters.createInvalidationConfig({
        invalidationData: givenInvalidationData,
        processArgs: givenProcessArgs
      })
      expect(invalidation, 'The invalidation data should be undefined').to
        .undefined
    })
  })
})
