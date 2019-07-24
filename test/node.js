/* global describe, it, before, after */
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var Logger = require('../')
var logdir = path.join(__dirname, 'log')

describe('Logger - node specific', function () {
  before(function () {
    try {
      fs.mkdirSync(logdir)
    } catch (e) {}
  })
  after(function () {
    fs.rmdirSync(logdir)
  })

  it('should log to a file', function (done) {
    var logfile = path.join(logdir, 'file.log')
    var file = fs.createWriteStream(logfile, {
      flags: 'a',
      encoding: 'utf8'
    })

    var logger = new Logger({
      streams: Logger.levels.map(function () {
        return file
      }),
      level: Logger.ERROR
    })
    logger.error('foo', function () {
      var c = fs.readFileSync(logfile)
      assert.notStrictEqual(c.indexOf('foo'), -1)
      fs.unlinkSync(logfile)
      done()
    })
  })

  it('should log to multiple files', function (done) {
    var errfile = path.join(logdir, 'err.log')
    var outfile = path.join(logdir, 'out.log')

    var err = fs.createWriteStream(errfile, {
      flags: 'a',
      encoding: 'utf8'
    })
    var out = fs.createWriteStream(outfile, {
      flags: 'a',
      encoding: 'utf8'
    })

    var logger = new Logger({
      streams: Logger.levels.map(function (level, i) {
        return i <= Logger.ERROR ? err : out
      }),
      level: Logger.WARNING
    })

    logger.error('foo', function () {
      logger.warning('bar', function () {
        var ec = fs.readFileSync(errfile)
        var oc = fs.readFileSync(outfile)

        assert.notStrictEqual(ec.indexOf('error'), -1)
        assert.strictEqual(ec.indexOf('warning'), -1)
        assert.notStrictEqual(ec.indexOf('foo'), -1)

        assert.notStrictEqual(oc.indexOf('warning'), -1)
        assert.strictEqual(oc.indexOf('error'), -1)
        assert.notStrictEqual(oc.indexOf('bar'), -1)

        fs.unlinkSync(errfile)
        fs.unlinkSync(outfile)
        done()
      })
    })
  })
})
