'use strict'

module.exports = function(fileName, {previous} = {}) {
  const splittedFileName = fileName.split('.')
  const ext = splittedFileName.pop()
  return previous ? splittedFileName.pop() : ext
}
