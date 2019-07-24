'use strict'
const { describe, it } = require('mocha')
const assert = require('assert')
const util = require('util')
const Logger = require('../')
const writer = function (cb) {
  return { write: cb }
}

describe('Logger - basic', function () {
  Logger.levels.forEach(function (level, i) {
    it(util.format('should log %s messages', level), function (done) {
      const w = writer(function (chunk, encoding, next) {
        assert.notStrictEqual(chunk.indexOf('foo'), -1, util.format('"%s" does not contain foo', chunk))
        done()
      })

      const logger = new Logger({
        streams: Logger.levels.map(() => w),
        level: i
      })
      if (Logger.levels[i + 1]) {
        logger[Logger.levels[i + 1]]('bar')
      }
      logger[Logger.levels[i]]('foo')
    })
  })

  it('should log errors', function (done) {
    const w = writer((chunk) => {
      assert.notStrictEqual(chunk.indexOf('Error loading data foo'), -1, util.format('"%s" does not contain foo', chunk))
      done()
    })
    const logger = new Logger({
      streams: Logger.levels.map(() => w),
      level: Logger.ERROR
    })
    logger.error(new Error('Error loading data foo'))
  })

  it('should log complex data structures', function (done) {
    const w = writer((chunk) => {
      const parsed = chunk.match(/([^[]*)\[([\w]*)\] - (.*)/)
      const d = JSON.parse(parsed[3])
      assert.strictEqual(parsed[2], 'error', 'Did not format message level')
      assert.strictEqual(d.msg.indexOf('Error: Failed to load data'), 0, 'Did not contain error message')
      assert.strictEqual(d.status, 500, 'Did not properly encode number')
      assert.strictEqual(d.meta, 'bar', 'Did not properly encode string')
      done()
    })
    const logger = new Logger({
      streams: Logger.levels.map(() => w),
      level: Logger.ERROR
    })
    logger.error(new Error('Failed to load data'), {
      status: 500,
      meta: 'bar'
    })
  })

  it('should log error level messages with a stack trace', function (done) {
    const w = writer((chunk) => {
      assert.notStrictEqual(chunk.indexOf('Error: foobar'), -1)
      assert.notStrictEqual(chunk.indexOf('at Logger.log'), -1)
      done()
    })
    const logger = new Logger({
      streams: Logger.levels.map(() => w),
      level: Logger.ERROR
    })
    logger.error('foobar')
  })

  it('should set the log level', function () {
    const logger = new Logger()
    assert.strictEqual(logger.level, Logger.WARNING)
    logger.setLevel('error')
    assert.strictEqual(logger.level, Logger.ERROR)
    logger.setLevel(Logger.INFO)
    assert.strictEqual(logger.level, Logger.INFO)
  })

  it('should auto new', function () {
    assert.doesNotThrow(() => {
      assert(Logger() instanceof Logger)
    })
  })
})
