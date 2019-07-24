const Loggerr = require('../')
const util = require('util')
const chalk = require('chalk')

module.exports = function (date, level, data) {
  let color
  switch (Loggerr.levels.indexOf(level)) {
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
    case Loggerr.INFO:
    case Loggerr.DEBUG:
      color = chalk.white
      break
  }

  if (!color) {
    return
  }

  let msg = color(data.msg)
  delete data.msg

  if (Object.keys(data).length) {
    msg += '\n ' + util.inspect(data, {
      colors: true
    })
  }

  return msg + '\n'
}
