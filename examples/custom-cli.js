'use strict'
const Loggerr = require('../').Loggerr
const cli = require('../formatters/cli').create

const log = new Loggerr({
  formatter: cli({
    levels: {
      fatal: 'red',
      error: 'red',
      success: 'green',
      debug: 'cyan'
    },
    errorLevels: ['error', 'fatal']
  }),
  level: 'success',
  levels: [
    'fatal',
    'error',
    'success',
    'debug'
  ]
})

log.debug('Should not be printed')
log.success('Operation successful!')
log.error('An error occured', {
  extraError: 'information',
  provideError: 'context'
})
log.fatal('This is the end...')
