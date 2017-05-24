/**
 * Logger constructor
 *
 */
var Logger = module.exports = function Logger (options) {
	options = options || {};
	this.streams = options.streams || Logger.defaultOptions.streams;
	this.formatter = options.formatter || Logger.defaultOptions.formatter;
	this.level = isFinite(options.level) ? options.level : Logger.defaultOptions.level;

	// Add level methods
	Logger.levels.forEach(function (level) {
		this[level] = this.log.bind(this, level);
	}.bind(this));
};

Logger.levels = [
	'emergency',
	'alert',
	'critical',
	'error',
	'warning',
	'notice',
	'info',
	'debug'
];

// Add level constants
Logger.levels.forEach(function (level, i) {
	Logger[level.toUpperCase()] = i;
});

/**
 * The default options
 *
 */
Logger.defaultOptions = {
	level: Logger.WARNING,
	formatter: require('./formatters/default'),
	streams: typeof window === 'undefined' ? Logger.levels.map(function (level, i) {
		return i > Logger.WARNING ? process.stdout : process.stderr;
	}) : Logger.levels.map(function (level, i) {
		return i > Logger.WARNING ? {
			write: function (msg, encoding, done) {
				console.log(msg);
				typeof done === 'function' ? done() : null;
			}
		} : {
			write: function (msg, encoding, done) {
				console.error(msg);
				typeof done === 'function' ? done() : null;
			}
		};
	})
};

/**
 * Set the level for the logger from either a string
 *
 */
Logger.prototype.setLevel = function (level) {
	this.level = (typeof level === 'string') ? Logger.levels.indexOf(level) : level;
};

/**
 * Logs a message to the given stream
 *
 */
Logger.prototype.log = function (level, msg, extra, done) {
	// Require a level, matching output stream and that
	// it is greater then the set level of logging
	var i = Logger.levels.indexOf(level);
	if (
		typeof level !== 'string' ||
		i > this.level ||
		!this.streams[i]
	) {
		return;
	}

	// Extra is optional
	if (typeof extra === 'function') {
		done = extra;
		extra = {};
	}
	extra = extra || {};

	// Set message on extra object
	if (msg instanceof Error) {
		extra.msg = msg.stack;
		extra.code = extra.code || msg.code || msg.name;
	} else if (i <= Logger.ERROR) {
		var err = new Error(msg);
		extra.msg = err.stack;
		extra.code = extra.code || err.code;
	} else {
		extra.msg = msg;
	}

	// Format the message
	msg = this.formatter(new Date(), level, extra);

	// Write out the message
	this._write(this.streams[i], msg, 'utf8', done);
};

/**
 * Abstracted out the actuall writing of the log so it
 * can be eaisly overridden in sub-classes
 */
Logger.prototype._write = function (stream, msg, enc, done) {
	stream.write(msg, enc, done);
};
