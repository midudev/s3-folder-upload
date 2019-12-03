#!/usr/bin/env node

'use strict'

const s3FolderUpload = require('../')
const buildParameters = require('../lib/build-cli-parameters')
const log = require('../lib/output')

try {
  const parameters = buildParameters({
    args: process.argv.slice(2),
    env: process.env
  })
  parameters.directories.forEach(directory =>
    s3FolderUpload(
      directory,
      parameters.credentials,
      parameters.options,
      parameters.invalidation
    )
  )
} catch (e) {
  log.error('[error] ' + e.message, true)
}
