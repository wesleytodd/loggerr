var assert = require('assert'),
	util = require('util'),
	fs = require('fs'),
	path = require('path'),
	Logger = require('../logger'),
	Writable = require('stream').Writable,
	logdir = path.join(__dirname, 'log');

describe('Logger', function() {

	before(function() {
		try {
			fs.mkdirSync(logdir);
		} catch(e) {}
	});
	after(function() {
		fs.rmdirSync(logdir);
	});

	Logger.levels.forEach(function(level, i) {

		it(util.format('should log %s messages', level), function(done) {
			var w = new Writable({
				decodeStrings: false,
				write: function(chunk, encoding, next) {
					assert.notEqual(chunk.indexOf('foo'), -1, util.format('"%s" does not contain foo', chunk));
					done();
				}
			});

			var logger = new Logger({
				streams: Logger.levels.map(function() {
					return w;
				}),
				level: i
			});
			if (Logger.levels[i+1]) {
				logger[Logger.levels[i+1]]('bar');
			}
			logger[Logger.levels[i]]('foo');
		});
		
	});

	it('should log errors', function(done) {
		var w = new Writable({
			decodeStrings: false,
			write: function(chunk, encoding, next) {
				assert.notEqual(chunk.indexOf('Error loading data foo'), -1, util.format('"%s" does not contain foo', chunk));
				done();
			}
		});
		var logger = new Logger({
			streams: Logger.levels.map(function() {
				return w;
			}),
			level: Logger.ERROR
		});
		logger.error(new Error('Error loading data foo'));
	});

	it('should log complex data structures', function(done) {
		var w = new Writable({
			decodeStrings: false,
			write: function(chunk, encoding, next) {
				var parsed = chunk.match(/([^[]*)\[([\w]*)\] - (.*)/);
				var d = JSON.parse(parsed[3]);
				assert.equal(parsed[2], 'error', 'Did not format message level');
				assert.equal(d.msg.indexOf('Error: Failed to load data'), 0, 'Did not contain error message');
				assert.equal(d.status, 500, 'Did not properly encode number');
				assert.equal(d.meta, 'bar', 'Did not properly encode string');
				done();
			}
		});
		var logger = new Logger({
			streams: Logger.levels.map(function() {
				return w;
			}),
			level: Logger.ERROR
		});
		logger.error(new Error('Failed to load data'), {
			status: 500,
			meta: 'bar'
		});
	});

	it('should log to a file', function(done) {
		var logfile = path.join(logdir, 'file.log');
		var file = fs.createWriteStream(logfile, {
			flags: 'a',
			encoding: 'utf8'
		});

		var logger = new Logger({
			streams: Logger.levels.map(function() {
				return file;
			}),
			level: Logger.ERROR
		});
		logger.error('foo', function() {
			var c = fs.readFileSync(logfile);
			assert.notEqual(c.indexOf('foo'), -1);
			fs.unlinkSync(logfile);
			done();
		});
	});

	it('should log to multiple files', function(done) {
		var errfile = path.join(logdir, 'err.log');
		var outfile = path.join(logdir, 'out.log');

		var err = fs.createWriteStream(errfile, {
			flags: 'a',
			encoding: 'utf8'
		});
		var out = fs.createWriteStream(outfile, {
			flags: 'a',
			encoding: 'utf8'
		});

		var logger = new Logger({
			streams: Logger.levels.map(function(level, i) {
				return i <= Logger.ERROR ? err : out;
			}),
			level: Logger.WARNING
		});

		logger.error('foo', function() {
			logger.warning('bar', function() {
				var ec = fs.readFileSync(errfile);
				var oc = fs.readFileSync(outfile);

				assert.notEqual(ec.indexOf('error'), -1);
				assert.equal(ec.indexOf('warning'), -1);
				assert.notEqual(ec.indexOf('foo'), -1);

				assert.notEqual(oc.indexOf('warning'), -1);
				assert.equal(oc.indexOf('error'), -1);
				assert.notEqual(oc.indexOf('bar'), -1);

				fs.unlinkSync(errfile);
				fs.unlinkSync(outfile);
				done();
			});
		});
	});

});
