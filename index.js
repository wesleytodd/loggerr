// @ts-nocheck

'use strict'

/**
 * Loggerr constructor
 */
function Loggerr (options) {
  if (!(this instanceof Loggerr)) {
    return new Loggerr(options)
  }
  const opts = options || {}

  // Setup levels
  this.levels = opts.levels || Loggerr.levels
  this.streams = opts.streams || Loggerr.defaultOptions.streams
  this.debugStream = opts.debugStream
  this.levels.forEach((level, i) => {
    this[level] = this.log.bind(this, level)

    // Set write stream for level
    this.streams[i] = this.streams[i] || this.streams
  })

  // Setup formatter
  let formatter = opts.formatter || Loggerr.defaultOptions.formatter
  if (typeof formatter === 'string') {
    formatter = require(`./formatters/${formatter}.js`)
  }
  this.formatter = formatter

  if (isFinite(opts.level)) {
    this.level = opts.level
  } else if (typeof opts.level === 'string' && this.levels.includes(opts.level)) {
    this.level = this.levels.indexOf(opts.level)
  } else {
    this.level = Loggerr.defaultOptions.level
  }
}

Loggerr.levels = [
  'emergency',
  'alert',
  'critical',
  'error',
  'warning',
  'notice',
  'info',
  'debug'
]

// Add level constants
Loggerr.levels.forEach(function (level, i) {
  Loggerr[level.toUpperCase()] = i
})

/**
 * The default options
 *
 */
Loggerr.defaultOptions = {
  level: Loggerr.WARNING,
  formatter: require('./formatters/default'),
  debugStream: null,
  streams: typeof window === 'undefined'
    ? Loggerr.levels.map(function (level, i) {
      return i > Loggerr.WARNING ? process.stdout : process.stderr
    })
    : Loggerr.levels.map(function (level, i) {
      return i > Loggerr.WARNING
        ? {
            write: function (msg, encoding, done) {
              console.log(msg)
              if (typeof done === 'function') {
                done()
              }
            }
          }
        : {
            write: function (msg, encoding, done) {
              console.error(msg)
              if (typeof done === 'function') {
                done()
              }
            }
          }
    })
}

/**
 * Set the level for the logger from either a string
 */
Loggerr.prototype.setLevel = function (level) {
  this.level = (typeof level === 'string') ? Loggerr.levels.indexOf(level) : level
}

/**
 * Logs a message to the given stream
 */
Loggerr.prototype.log = function (level, msg, extra, done) {
  // Extra is optional
  if (typeof extra === 'function') {
    done = extra
    extra = {}
  }

  // Require a level, matching output stream and that
  // it is greater then the set level of logging
  const i = this.levels.indexOf(level)
  if (
    typeof level !== 'string' ||
    i > this.level ||
    !this.streams[i]
  ) {
    if (this.debugStream) {
      const message = processMessage(level, msg, extra, this.formatter)
      this._write(this.debugStream, message, 'utf8', done)
    }
    return
  }

  // Format the message
  const message = processMessage(level, msg, extra, this.formatter)

  if (this.debugStream) {
    this._write(this.debugStream, message, 'utf8')
  }

  // Write out the message
  this.write(i, message, done)
}

/**
 * Write with level awareness
 */
Loggerr.prototype.writeLevel = function (level, msg, done) {
  const i = this.levels.indexOf(level)
  if (
    typeof level !== 'string' ||
    i > this.level ||
    !this.streams[i]
  ) {
    return
  }

  // Write out the message
  this._write(this.streams[i], msg, 'utf8', done)
}

/**
 * Write to the given level stream
 */
Loggerr.prototype.write = function (level, msg, done) {
  const i = typeof level === 'string' ? this.levels.indexOf(level) : level

  // Write out the message
  this._write(this.streams[i], msg, 'utf8', done)
}

/**
 * Abstracted out the actuall writing of the log so it
 * can be eaisly overridden in sub-classes
 */
Loggerr.prototype._write = function (stream, msg, enc, done) {
  stream.write(msg, enc, done)
}

module.exports = new Loggerr()
module.exports.Loggerr = Loggerr

function processMessage (level, msg, extra, formatter) {
  const data = extra || {}

  // Set message on extra object
  const isErrorInstance = msg instanceof Error
  data.msg = isErrorInstance ? msg.message : msg
  if (msg.code) {
    data.code = msg.code
  }
  // If this is an error, copy over other properties on the error
  if (isErrorInstance) {
    for (const key in msg) {
      if (Object.prototype.hasOwnProperty.call(msg, key)) {
        data[key] = msg[key]
      }
    }
  }

  // Lazy create error
  let err
  Object.defineProperty(data, 'err', {
    enumerable: true,
    configurable: true,
    get: () => {
      err = err || ErrorContext(msg)
      return err
    }
  })

  return formatter(new Date(), level, data)
}
function ErrorContext (err, extra) {
  if (!(err instanceof Error)) {
    err = new Error(err)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, Loggerr.prototype.log)
    }
  }
  for (const key in extra) {
    err[key] = extra[key]
  }
  err.toJSON = function () {
    const o = {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
    for (const key in err) {
      if (key !== 'toJSON') {
        o[key] = err[key]
      }
    }
    return o
  }
  return err
}
