'use strict'

/**
 * Logger constructor
 */
const Logger = module.exports = function Logger (options) {
  if (!(this instanceof Logger)) {
    return new Logger(options)
  }
  const opts = options || {}

  // Setup levels
  this.levels = opts.levels || Logger.levels
  this.streams = opts.streams || Logger.defaultOptions.streams
  this.levels.forEach((level, i) => {
    this[level] = this.log.bind(this, level)

    // Set write stream for level
    this.streams[i] = this.streams[i] || this.streams
  })

  // Setup formatter
  let formatter = opts.formatter || Logger.defaultOptions.formatter
  if (typeof formatter === 'string') {
    formatter = require(`${__dirname}/formatters/${formatter}`)
  }
  this.formatter = formatter

  if (isFinite(opts.level)) {
    this.level = opts.level
  } else if (typeof opts.level === 'string' && this.levels.includes(opts.level)) {
    this.level = this.levels.indexOf(opts.level)
  } else {
    this.level = Logger.defaultOptions.level
  }
}

Logger.levels = [
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
Logger.levels.forEach(function (level, i) {
  Logger[level.toUpperCase()] = i
})

/**
 * The default options
 *
 */
Logger.defaultOptions = {
  level: Logger.WARNING,
  formatter: require('./formatters/default'),
  streams: typeof window === 'undefined' ? Logger.levels.map(function (level, i) {
    return i > Logger.WARNING ? process.stdout : process.stderr
  }) : Logger.levels.map(function (level, i) {
    return i > Logger.WARNING ? {
      write: function (msg, encoding, done) {
        console.log(msg)
        if (typeof done === 'function') {
          done()
        }
      }
    } : {
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
Logger.prototype.setLevel = function (level) {
  this.level = (typeof level === 'string') ? Logger.levels.indexOf(level) : level
}

/**
 * Logs a message to the given stream
 */
Logger.prototype.log = function (level, msg, extra, done) {
  // Require a level, matching output stream and that
  // it is greater then the set level of logging
  const i = this.levels.indexOf(level)
  if (
    typeof level !== 'string' ||
    i > this.level ||
    !this.streams[i]
  ) {
    return
  }

  // Extra is optional
  if (typeof extra === 'function') {
    done = extra
    extra = {}
  }
  const data = extra || {}

  // Set message on extra object
  data.msg = msg instanceof Error ? msg.message : msg
  data.code = msg.code || data.code
  data.err = ErrorContext(msg)

  // Format the message
  const message = this.formatter(new Date(), level, data)

  // Write out the message
  this._write(this.streams[i], message, 'utf8', done)
}

/**
 * Abstracted out the actuall writing of the log so it
 * can be eaisly overridden in sub-classes
 */
Logger.prototype._write = function (stream, msg, enc, done) {
  stream.write(msg, enc, done)
}

function ErrorContext (err, extra) {
  if (!(err instanceof Error)) {
    err = new Error(err)
  }
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, Logger.prototype.log)
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
