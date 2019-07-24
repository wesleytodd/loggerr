var util = require('util')
module.exports = util.format.bind(util, '%s [%s] - %j\n')
