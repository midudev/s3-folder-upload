'use strict'

const FRAMES = ['-', '\\', '|', '/']
let loadingPosition = 0

const logUpdate = require('log-update')

module.exports = {
  error(err, forceExit) {
    console.error('\x1b[31m%s\x1b[0m', err)
    if (forceExit) {
      process.exit(1)
    }
  },

  info(msg) {
    console.log('\x1b[33m%s\x1b[0m', msg)
  },

  progress(msg, clean) {
    const frame = clean ? '' : FRAMES[loadingPosition++ % FRAMES.length]
    logUpdate(`${frame} ${msg}`)
  },

  success(msg) {
    console.log('\x1b[32m%s\x1b[0m', msg)
  }
}
