'use strict'
const util = require('util')

module.exports = createFormatter()
module.exports.create = createFormatter

function createFormatter (options = {}) {
  const colors = typeof options.colors !== 'undefined' ? options.colors : process.stdout.isTTY
  const depth = typeof options.depth !== 'undefined' ? options.depth : 2
  const errorLevels = options.errorLevels || [
    'error',
    'critical',
    'alert',
    'emergency'
  ]

  return (date, level, data) => {
    let err
    if (errorLevels.includes(level)) {
      err = data.err
    }

    // format details
    const details = Object.keys(data).reduce((d, key) => {
      // dont display the message or error in details
      if (key !== 'msg' && key !== 'err') {
        d = d || {}
        d[key] = data[key]
      }
      return d
    }, null)

    return `${err ? err.stack : data.msg}\n${details ? util.inspect(details, { colors, depth }) + '\n' : ''}`
  }
}
