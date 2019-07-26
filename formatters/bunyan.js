'use strict'
const os = require('os')

module.exports = function (date, level, data) {
  let l = 0
  switch (level) {
    case 'debug':
      l = 10
      break
    case 'info':
      l = 20
      break
    case 'notice':
      l = 30
      break
    case 'warning':
      l = 40
      break
    case 'error':
      l = 50
      break
    case 'critical':
    case 'alert':
    case 'emergency':
      l = 60
      break
  }

  return JSON.stringify(Object.assign({
    v: 0,
    level: l,
    name: process.title,
    hostname: os.hostname(),
    pid: process.pid,
    time: date
  }, data, {
    msg: (data.err && data.err.message) || data.msg,
    err: data.err && {
      message: data.err.message,
      name: data.err.name,
      stack: data.err.stack
    }
  })) + '\n'
}
