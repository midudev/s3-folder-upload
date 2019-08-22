'use strict'

const extractParameters = ({allowedKeys = [], parameters = {}} = {}) => {
  let extractedParameters = {}
  allowedKeys.forEach(key => {
    if (parameters.hasOwnProperty(key)) {
      extractedParameters[key] = parameters[key]
    }
  })
  return extractedParameters
}

module.exports = extractParameters
