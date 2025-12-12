'use strict'
const log = require('../')
log.warning('self', { log })

const cliLog = new log.Loggerr({
  formatter: 'cli',
  level: 'info'
})
cliLog.warning('self', { log })
