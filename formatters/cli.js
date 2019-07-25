'use strict'
const Loggerr = require('../')
const util = require('util')
const chalk = require('chalk')

module.exports = function (date, level, data) {
  let color = chalk.cyan
  const i = Loggerr.levels.indexOf(level)
  switch (i) {
    case Loggerr.EMERGENCY:
    case Loggerr.ALERT:
    case Loggerr.CRITICAL:
    case Loggerr.ERROR:
      color = chalk.red
      break
    case Loggerr.WARNING:
    case Loggerr.NOTICE:
      color = chalk.yellow
      break
  }

  // level formatting
  const l = color.underline(level) + (Array(Math.max(8 - level.length, 0)).join(' '))

  // hanlde multi-line messages
  let lines = data.msg.split('\n')
  const firstLine = lines.shift()

  // display stack trace for errors levels
  if (i <= Loggerr.ERROR) {
    lines = lines.concat(data.err.stack.split('\n'))
  }

  // dim all but first line
  lines = lines.map((s) => chalk.grey(s))
  lines = [firstLine, ...lines].join('\n')

  // format details
  const details = Object.keys(data).reduce((str, key) => {
    // dont display the message or error in details
    if (data[key] && key !== 'msg' && key !== 'err') {
      str += `\n  ${chalk.grey('-')} ${key}: ${util.inspect(data[key], { colors: true })}`
    }
    return str
  }, '')

  return `${l} ${chalk.grey('›')} ${lines} ${details}\n`
}
