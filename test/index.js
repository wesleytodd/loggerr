/* global describe, it */
var assert = require('assert');
var util = require('util');
var Logger = require('../');
var writer = function (cb) {
	return {write: cb};
};

describe('Logger - basic', function () {
	Logger.levels.forEach(function (level, i) {
		it(util.format('should log %s messages', level), function (done) {
			var w = writer(function (chunk, encoding, next) {
				assert.notEqual(chunk.indexOf('foo'), -1, util.format('"%s" does not contain foo', chunk));
				done();
			});

			var logger = new Logger({
				streams: Logger.levels.map(function () {
					return w;
				}),
				level: i
			});
			if (Logger.levels[i + 1]) {
				logger[Logger.levels[i + 1]]('bar');
			}
			logger[Logger.levels[i]]('foo');
		});
	});

	it('should log errors', function (done) {
		var w = writer(function (chunk) {
			assert.notEqual(chunk.indexOf('Error loading data foo'), -1, util.format('"%s" does not contain foo', chunk));
			done();
		});
		var logger = new Logger({
			streams: Logger.levels.map(function () {
				return w;
			}),
			level: Logger.ERROR
		});
		logger.error(new Error('Error loading data foo'));
	});

	it('should log complex data structures', function (done) {
		var w = writer(function (chunk) {
			var parsed = chunk.match(/([^[]*)\[([\w]*)\] - (.*)/);
			var d = JSON.parse(parsed[3]);
			assert.equal(parsed[2], 'error', 'Did not format message level');
			assert.equal(d.msg.indexOf('Error: Failed to load data'), 0, 'Did not contain error message');
			assert.equal(d.status, 500, 'Did not properly encode number');
			assert.equal(d.meta, 'bar', 'Did not properly encode string');
			done();
		});
		var logger = new Logger({
			streams: Logger.levels.map(function () {
				return w;
			}),
			level: Logger.ERROR
		});
		logger.error(new Error('Failed to load data'), {
			status: 500,
			meta: 'bar'
		});
	});

	it('should log error level messages with a stack trace', function (done) {
		var w = writer(function (chunk) {
			assert.notEqual(chunk.indexOf('Error: foobar'), -1);
			assert.notEqual(chunk.indexOf('at Logger.log'), -1);
			done();
		});
		var logger = new Logger({
			streams: Logger.levels.map(function () {
				return w;
			}),
			level: Logger.ERROR
		});
		logger.error('foobar');
	});
});
