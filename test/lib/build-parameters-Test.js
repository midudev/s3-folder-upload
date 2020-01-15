const expect = require('chai').expect
const sinon = require('sinon')
const errors = require('../../lib/errors')

const buildParameters = require('../../lib/build-cli-parameters')
const awsCredentials = require('../../lib/aws-credentials')
const awsInvalidationParameters = require('../../lib/aws-invalidation-parameters')

const validCredentials = require('../resources/valid-aws-credentials.json')

let awsCredentialsStub
let awsInvalidationParametersStub

describe('Build Parameters', () => {
  beforeEach('Cleaning stubs', () => {
    if (awsCredentialsStub) {
      awsCredentialsStub.restore()
      awsCredentialsStub = undefined
    }
    if (awsInvalidationParametersStub) {
      awsInvalidationParametersStub.restore()
      awsInvalidationParametersStub = undefined
    }
  })

  it('Should return unnamed parameters as an array of directories', () => {
    const givenArgs = [
      '--namedArg1=value1',
      'dist/css',
      'dist/js',
      '--namedArg2=value2'
    ]

    awsCredentialsStub = sinon
      .stub(awsCredentials, 'createCredentials')
      .returns(validCredentials)
    awsInvalidationParametersStub = sinon
      .stub(awsInvalidationParameters, 'createInvalidationConfig')
      .returns(undefined)

    const parameters = buildParameters({args: givenArgs})

    expect(parameters.directories, 'directories should be an array').to.be.a(
      'array'
    )
    expect(
      parameters.directories,
      'directories should contain the given unnamed args'
    ).to.deep.equal(['dist/css', 'dist/js'])
  })
  it('Should create credentials giving the process and env data to be extracted', () => {
    const givenArgs = [
      'dist',
      '--accessKeyId=aKeyId',
      '--bucket=aBucket',
      '--region=aRegion',
      '--secretAccessKey=aSecret'
    ]
    const givenEnv = {
      AWS_CREDENTIALS_PATH: '../whatever.json'
    }

    awsCredentialsStub = sinon
      .stub(awsCredentials, 'createCredentials')
      .returns(validCredentials)
    awsInvalidationParametersStub = sinon
      .stub(awsInvalidationParameters, 'createInvalidationConfig')
      .returns(undefined)

    const parameters = buildParameters({args: givenArgs, env: givenEnv})

    expect(
      parameters.credentials,
      'credentials are not as expected'
    ).to.deep.equal(validCredentials)
    expect(
      [
        awsCredentialsStub.lastCall.args[0].processArgs.accessKeyId,
        awsCredentialsStub.lastCall.args[0].processEnv.AWS_CREDENTIALS_PATH
      ],
      'credentials were not created with expected args'
    ).to.deep.equal(['aKeyId', '../whatever.json'])
  })
  it('Should extract options from named parameters', () => {
    const givenArgs = ['dist', '--useFoldersForFileTypes=false']
    const givenEnv = {}

    awsCredentialsStub = sinon
      .stub(awsCredentials, 'createCredentials')
      .returns(validCredentials)
    awsInvalidationParametersStub = sinon
      .stub(awsInvalidationParameters, 'createInvalidationConfig')
      .returns(undefined)

    const parameters = buildParameters({args: givenArgs, env: givenEnv})

    const expectedOptions = {
      useFoldersForFileTypes: false,
      useIAMRoleCredentials: false
    }
    expect(parameters.options, 'options are not as expected').to.deep.equal(
      expectedOptions
    )
  })
  it('Should create cloudfront invalidation data from process args', () => {
    const givenArgs = [
      'dist',
      '--awsDistributionId=aDistributionId',
      '--awsInvalidationPath=aPath'
    ]

    const expectedInvalidation = {
      distribution: 'aDistributionId',
      path: 'aPath'
    }

    awsCredentialsStub = sinon
      .stub(awsCredentials, 'createCredentials')
      .returns(validCredentials)
    awsInvalidationParametersStub = sinon
      .stub(awsInvalidationParameters, 'createInvalidationConfig')
      .returns(expectedInvalidation)

    const parameters = buildParameters({args: givenArgs})

    expect(
      parameters.invalidation,
      'invalidation is not as expected'
    ).to.deep.equal(expectedInvalidation)
    expect(
      [
        awsInvalidationParametersStub.lastCall.args[0].processArgs
          .awsDistributionId,
        awsInvalidationParametersStub.lastCall.args[0].processArgs
          .awsInvalidationPath
      ],
      'data was not created with expected args'
    ).to.deep.equal([
      expectedInvalidation.distribution,
      expectedInvalidation.path
    ])
  })
  it('Should fail if no directories are defined', () => {
    const givenArgs = []
    const givenEnv = {}

    expect(() => buildParameters({args: givenArgs, env: givenEnv})).to.throw(
      errors.NO_DIRECTORIES_TO_UPLOAD
    )
  })
})
