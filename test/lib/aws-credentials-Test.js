const expect = require('chai').expect

const errors = require('../../lib/errors')
const awsCredentials = require('../../lib/aws-credentials')

describe('AWS Credentials', () => {
  describe('checkCredentialsConfig method', () => {
    it('Should return true if given args are complete', () => {
      const givenCredentials = {
        accessKeyId: 'aAccessKeyId',
        bucket: 'aBucket',
        region: 'aRegion',
        secretAccessKey: 'aSecretAccessKey'
      }
      const check = awsCredentials.checkCredentialsConfig({
        credentials: givenCredentials
      })
      expect(check, 'The check should be satisfied').to.be.true
    })
    it('Should return false if given args are incomplete', () => {
      const givenCredentials = {
        accessKeyId: 'aAccessKeyId',
        bucket: 'aBucket',
        region: 'aRegion'
      }
      const check = awsCredentials.checkCredentialsConfig({
        credentials: givenCredentials
      })
      expect(check, 'The check should not be satisfied').to.be.false
    })
    it('Should return false if no args are given', () => {
      const check = awsCredentials.checkCredentialsConfig()
      expect(check, 'The check should not be satisfied').to.be.false
    })
  })
  describe('createCredentials method', () => {
    it('Should return credentials if its data is complete', () => {
      const givenCredentialsData = {
        accessKeyId: 'aAccessKeyId',
        bucket: 'aBucket',
        region: 'aRegion',
        secretAccessKey: 'aSecretAccessKey'
      }
      const credentials = awsCredentials.createCredentials({
        credentialsData: givenCredentialsData
      })
      expect(
        credentials,
        'The credentials data should be taken from given data object'
      ).to.deep.equal(givenCredentialsData)
    })
    it('Should return data from process args if credentials data object is incomplete', () => {
      const givenCredentialsData = {}
      const givenProcessArgs = {
        aKey: 'value',
        accessKeyId: 'aAccessKeyId',
        bucket: 'aBucket',
        region: 'aRegion',
        secretAccessKey: 'aSecretAccessKey',
        someOtherKey: 'value'
      }
      const credentials = awsCredentials.createCredentials({
        credentialsData: givenCredentialsData,
        processArgs: givenProcessArgs
      })
      const expectedCredentials = {
        accessKeyId: 'aAccessKeyId',
        bucket: 'aBucket',
        region: 'aRegion',
        secretAccessKey: 'aSecretAccessKey'
      }
      expect(
        credentials,
        'The credentials data should be extracted from process args'
      ).to.deep.equal(expectedCredentials)
    })
    it('Should return data from process env if credentials data object is incomplete', () => {
      const givenCredentialsData = {}
      const givenProcessArgs = {}
      const givenProcessEnv = {
        aKey: 'value',
        AWS_CREDENTIALS_PATH: '../test/resources/valid-aws-credentials.json',
        someOtherKey: 'value'
      }
      const credentials = awsCredentials.createCredentials({
        credentialsData: givenCredentialsData,
        processArgs: givenProcessArgs,
        processEnv: givenProcessEnv
      })

      const expectedCredentials = require('../resources/valid-aws-credentials.json')

      expect(
        credentials,
        'The credentials data should be extracted from process env'
      ).to.deep.equal(expectedCredentials)
    })
    it('Should throw an error if no credentials could be created', () => {
      const givenCredentialsData = {}
      const givenProcessArgs = {}
      const givenProcessEnv = {
        aKey: 'value',
        AWS_CREDENTIALS_PATH:
          '../test/resources/incomplete-aws-credentials.json',
        someOtherKey: 'value'
      }
      expect(
        () =>
          awsCredentials.createCredentials({
            credentialsData: givenCredentialsData,
            processArgs: givenProcessArgs,
            processEnv: givenProcessEnv
          }),
        'The credentials creation should throw an error'
      ).to.throw(errors.INVALID_CREDENTIALS)
    })
    it('Should throw an invalid credentials error if credentials data is sent with all the keys but not all the values', () => {
      const givenCredentialsData = {
        bucket: 'aBucket',
        region: 'aRegion',
        accessKeyId: undefined,
        secretAccessKey: undefined
      }
      expect(
        () =>
          awsCredentials.createCredentials({
            credentialsData: givenCredentialsData
          }),
        'The credentials creation should throw an error'
      ).to.throw(errors.INVALID_CREDENTIALS)
    })

    it('Should create an undefined credentials when useIAMRoleCredentials is provided', () => {
      const credentialsData = {
        bucket: 'aBucket',
        region: 'aRegion',
        accessKeyId: undefined,
        secretAccessKey: undefined
      }

      expect(
        awsCredentials.createCredentials({
          credentialsData,
          useIAMRoleCredentials: true
        }),
        'The credentials creation should be undefined as it will be extracted from the IAMRole'
      ).to.deep.equal({
        bucket: 'aBucket',
        region: 'aRegion'
      })
    })
  })
})
