const logUpdate = require('log-update')

const {CONTINUOUS_INTEGRATION, S3_FOLDER_UPLOAD_LOG} = process.env
const FRAMES = ['-', '\\', '|', '/']
const LOG_LEVELS = {
  all: 2,
  only_errors: 1,
  none: 0
}
const DEFAULT_LOG_LEVEL = CONTINUOUS_INTEGRATION
  ? LOG_LEVELS.only_errors
  : LOG_LEVELS.all
const LOG = LOG_LEVELS[S3_FOLDER_UPLOAD_LOG] || DEFAULT_LOG_LEVEL
let loadingPosition = 0

module.exports = {
  error(err, forceExit) {
    LOG > LOG_LEVELS.none && console.error('\x1b[31m%s\x1b[0m', err)
    if (forceExit) {
      process.exit(1)
    }
  },

  info(msg) {
    LOG > LOG_LEVELS.only_errors && console.log('\x1b[33m%s\x1b[0m', msg)
  },

  progress(msg, clean) {
    if (LOG > LOG_LEVELS.only_errors) {
      const frame = clean ? '' : FRAMES[loadingPosition++ % FRAMES.length]
      logUpdate(`${frame} ${msg}`)
    }
  },

  success(msg) {
    LOG > LOG_LEVELS.only_errors && console.log('\x1b[32m%s\x1b[0m', msg)
  }
}
