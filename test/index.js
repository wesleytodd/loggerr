'use strict'
const { describe, it } = require('mocha')
const assert = require('assert')
const util = require('util')
const Logger = require('../').Loggerr
const writer = function (cb) {
  return { write: cb }
}

describe('Logger - basic', function () {
  Logger.levels.forEach(function (level, i) {
    it(util.format('should log %s messages', level), function (done) {
      const w = writer(function (chunk, encoding, next) {
        assert.notStrictEqual(chunk.indexOf('foo'), -1, util.format('"%s" does not contain foo', chunk))
        if (typeof next === 'function') {
          next()
        }
      })

      const logger = new Logger({
        streams: Logger.levels.map(() => w),
        level: i
      })
      if (Logger.levels[i + 1]) {
        logger[Logger.levels[i + 1]]('bar')
        logger.writeLevel(Logger.levels[i + 1], 'bar')
      }
      logger[Logger.levels[i]]('foo')
      logger.writeLevel(Logger.levels[i], 'foo', () => {
        done()
      })
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
      const d = chunk[2]
      assert.strictEqual(chunk[1], 'error', 'Did not format message level')
      assert.strictEqual(d.err.stack.indexOf('Error: Failed to load data'), 0, 'Did not contain error message')
      assert.strictEqual(d.status, 500, 'Did not properly encode number')
      assert.strictEqual(d.meta, 'bar', 'Did not properly encode string')
      done()
    })
    const logger = new Logger({
      streams: Logger.levels.map(() => w),
      level: Logger.ERROR,
      formatter: (date, level, data) => {
        return [date, level, data]
      }
    })
    logger.error(new Error('Failed to load data'), {
      status: 500,
      meta: 'bar'
    })
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

  it('should log custom levels', function (done) {
    const w = writer((chunk) => {
      const d = chunk[2]
      assert.strictEqual(chunk[1], 'test')
      assert.strictEqual(d.msg, 'A test message')
      done()
    })
    const logger = new Logger({
      streams: Logger.levels.map(() => w),
      levels: ['test', 'debug'],
      level: 'test',
      formatter: (date, level, data) => {
        return [date, level, data]
      }
    })
    logger.debug('Not logged')
    logger.test('A test message')
  })

  it('should write to debugStream', function (done) {
    const seenDebug = []
    const dw = writer((chunk, enc, next) => {
      seenDebug.push(chunk)
      if (typeof next === 'function') {
        next()
      }
    })

    const seen = []
    const w = writer((chunk, enc, next) => {
      seen.push(chunk)
      if (typeof next === 'function') {
        next()
      }
    })

    const logger = new Logger({
      debugStream: dw,
      streams: Logger.levels.map(() => w),
      level: Logger.ERROR,
      formatter: (date, level, data) => {
        return data.msg
      }
    })
    logger.levels.forEach(function (level, i) {
      logger[level](level)
    })

    // .writeLevel should write to debug stream
    logger.writeLevel('error', 'writeLevelError')
    logger.writeLevel('debug', 'writeLevelDebug')

    // direct .write should not write to the debug stream
    logger.write('emergency', 'end', () => {
      assert.deepStrictEqual(seen, [
        'emergency',
        'alert',
        'critical',
        'error',
        'writeLevelError',
        'end'
      ])
      assert.deepStrictEqual(seenDebug, [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info',
        'debug',
        'writeLevelError',
        'writeLevelDebug'
      ])
      done()
    })
  })
})
