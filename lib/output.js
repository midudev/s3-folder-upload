'use strict'

const FRAMES = ['-', '\\', '|', '/']
let loadingPosition = 0

const logUpdate = require('log-update')

module.exports = {
  error (err, forceExit) {
    console.error(err)
    if (forceExit) { process.exit(0) }
  },

  info (msg) {
    console.log(msg)
  },

  progress (msg, clean) {
    const frame = clean ? '' : FRAMES[loadingPosition++ % FRAMES.length]
    logUpdate(`${frame} ${msg}`)
  },

  success (msg) {
    console.log(msg || '')
    process.exit(0)
  }
}
