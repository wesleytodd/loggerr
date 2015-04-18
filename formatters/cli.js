var Loggerr = require('../'),
	util = require('util'),
	chalk = require('chalk');

module.exports = function(date, level, data) {
	var color;
	switch(Loggerr.levels.indexOf(level)) {
		case Loggerr.EMERGENCY:
		case Loggerr.ALERT:
		case Loggerr.CRITICAL:
		case Loggerr.ERROR:
			color = chalk.red;
			break;
		case Loggerr.WARNING:
		case Loggerr.NOTICE:
			color = chalk.yellow;
			break;
		case Loggerr.INFO:
		case Loggerr.DEBUG:
			color = chalk.white;
			break;
	}

	if (!color) {
		return;
	}

	var msg = color(data.msg);
	delete data.msg;

	if (Object.keys(data).length) {
		msg += ' ' + util.inspect(data, {
			colors: true
		});
	}

	return msg + '\n';
};
