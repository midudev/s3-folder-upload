#!/usr/bin/env node --harmony

'use strict'

const s3FolderUpload = require('../')
const directory = process.argv[2]

if (!directory) {
  console.log(`[warn] You need to specify a directory located on the root.
  For example: s3-folder-upload statics`)
  process.exit(1)
} else {
  s3FolderUpload(directory)
}
