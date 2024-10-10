'use strict'
const Loggerr = require('../').Loggerr

const log = new Loggerr({
  formatter: 'cli-simple',
  level: 'info'
})
log.debug('Should not be printed')
log.write('info', 'Write out raw log line.\n')
log.info('Information:', {
  hello: 'hello',
  world: 'world!'
})
log.notice('Notice me plz')
log.error('An error occured')
log.critical('This is the song')
log.alert('That never ends')
log.emergency('It goes on and on')
