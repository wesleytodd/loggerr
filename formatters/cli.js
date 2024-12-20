'use strict'
const util = require('util')
const chalk = require('chalk')
const stringLen = require('string-length')

module.exports = createFormatter()
module.exports.create = createFormatter

function createFormatter (options) {
  const opts = Object.assign({
    colors: true,
    levels: {
      emergency: 'red',
      alert: 'red',
      critical: 'red',
      error: 'red',
      warning: 'yellow',
      notice: 'yellow',
      info: 'cyan',
      debug: 'cyan'
    },
    errorLevels: [
      'error',
      'critical',
      'alert',
      'emergency'
    ]
  }, options)

  if (opts.colors === false) {
    chalk.level = 0
  }

  return (date, level, data) => {
    const color = chalk[opts.levels[level]] || chalk.white

    // level formatting
    const l = color.underline(level) + (Array(Math.max(8 - level.length, 0)).join(' '))

    // hanlde multi-line messages
    let lines = data.msg.split('\n')
    const firstLine = lines.shift()

    // display stack trace for errors levels
    if (opts.errorLevels.includes(level)) {
      // Remove multi-line message from stack
      const stack = data.err.stack.replace(data.msg, firstLine)
      lines = lines.concat(stack.split('\n'))
    }

    // dim and trim all but first line
    lines = lines.map((s) => chalk.grey(s.trim()))
    lines = [firstLine, ...lines].join('\n')

    // format details
    const details = Object.keys(data).reduce((str, key) => {
      // dont display the message or error in details
      if (data[key] && key !== 'msg' && key !== 'err') {
        const prefix = `  ${chalk.grey('-')}`
        const prefixPad = Array(stringLen(prefix)).join(' ')
        const [firstLine, ...rest] = util.inspect(data[key], { colors: opts.colors !== false }).split('\n')
        str += `\n${prefix} ${key}: ${firstLine}`
        str += '\n' + rest.map((l) => prefixPad + l).join('\n')
      }
      return str
    }, '')

    return `${l} ${chalk.grey('›')} ${lines} ${details}\n`
  }
}
