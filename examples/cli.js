'use strict'
const Loggerr = require('../').Loggerr

const log = new Loggerr({
  formatter: 'cli',
  level: 'info'
})
log.debug('Should not be printed')
log.info('Information unknown')
log.notice('Notice me plz')
log.error('An error occured')
log.critical('This is the song')
log.alert('That never ends')
log.emergency('It goes on and on')
