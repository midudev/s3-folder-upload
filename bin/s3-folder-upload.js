#!/usr/bin/env node

'use strict'

const s3FolderUpload = require('../')
const buildParameters = require('../lib/build-cli-parameters')
const log = require('../lib/output')

try {
  const {directories, credentials, options} = buildParameters({
    args: process.argv.slice(2),
    env: process.env
  })
  directories.forEach(directory =>
    s3FolderUpload(directory, credentials, options)
  )
} catch (e) {
  log.error('[error] ' + e.message, true)
}
