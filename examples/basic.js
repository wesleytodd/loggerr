'use strict'
const log = require('../')

log.debug('Should not be printed')
log.info('Information not shown')
log.notice('Notice me!')
log.warning('You have been warned')
log.error('An error occured')
log.critical('This is the end...')
log.alert('This is also the end...')
log.emergency('This is really the reall end.')
