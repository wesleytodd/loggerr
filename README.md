# Loggerr

[![NPM Version](https://img.shields.io/npm/v/loggerr.svg)](https://npmjs.org/package/loggerr)
[![NPM Downloads](https://img.shields.io/npm/dm/loggerr.svg)](https://npmjs.org/package/loggerr)
[![CI Test](https://github.com/wesleytodd/loggerr/workflows/Tests/badge.svg)](https://github.com/wesleytodd/loggerr/actions)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)

A very simple logger.

**Features:**

- Synchronous output (great for cli's, browser and tools)
- Levels (built-in and customizable)
- Formatting (built-in and customizable)
- `Loggerr` is dependency free (*formatters are not*)
- Always captures stack trace on error logs
- Tiny filesize
- The `cli` formatter 🚀

![cli formatter example](https://github.com/wesleytodd/loggerr/blob/master/cli.png)

## Install

```
$ npm install --save loggerr
```

## Usage

```javascript
const log = require('loggerr')
log.error(new Error('My error message'))
// Thu Apr 16 2015 22:05:27 GMT-0500 (CDT) [error] - {"msg":"Error: My error message\n<STACK TRACE>"}

log.info('Something happened', {
  foo: 'info about what happened'
})
// Thu Apr 16 2015 22:05:27 GMT-0500 (CDT) [info] - {"msg":"Something happened","foo":"info about what happened"}
```

## Log Levels

Each log level can be directed to a different output stream
or disabled entirely. The default levels are as follows:

- `emergency`
- `alert`
- `critical`
- `error`
- `warning` *(default)*
- `notice`
- `info`
- `debug`

Constants are available for setting and referencing the levels and
their streams. These constants are the all uppercase version of the
level.  Here is an example of setting the log level:

```javascript
const logger = new Loggerr({
  level: Loggerr.DEBUG
})

logger.debug('Foo')
// Thu Apr 16 2015 22:05:27 GMT-0500 (CDT) [debug] - {"msg":"Foo"}
```

### Customize Levels

You can fully customize the levels for your purposes. For example, here
we implement `pino` compatible levels:

```javascript
const log = new Loggerr({
  level: [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ]
})

log.trace('Example trace log')
```

See the [example of custom levels for cli output](https://github.com/wesleytodd/loggerr/blob/master/examples/custom-cli.js).

## Log Formatting

Loggerr supports formatting via formatter functions. The default
formatter outputs a timestamp, the log level and the messages formatted
as json. But you can provide a custom formatter function with the `formatter`
options. Formatter functions take three parameters: `date`, `level`, `data`.
Say we want to output the log message with a color based on the level:

```javascript
const Loggerr = require('loggerr')
const chalk = require('chalk')

const logger = new Loggerr({
  formatter: (date, level, data) => {
    var color
    switch (Loggerr.levels.indexOf(level)) {
      case Loggerr.EMERGENCY:
      case Loggerr.ALERT:
      case Loggerr.CRITICAL:
      case Loggerr.ERROR:
        color = chalk.red
        break
      case Loggerr.WARNING:
      case Loggerr.NOTICE:
        color = chalk.yellow
        break
      case Loggerr.INFO:
      case Loggerr.DEBUG:
        color = chalk.white
        break
    }
    return color(data.msg)
  }
})
```

There are a few built-in in formatters:

- `default`: Outputs date, level and json
- `cli`: Outputs the message and json data, colorized and formatted
- `bunyan`: Compatible format to `bunyan`
- `browser`: Relies on `console.log`, so just returns the `data`

For these built-in formatters can specify the string name of the formatter for built-in formatters:

```javascript
const log = new Loggerr({
  formatter: 'cli'
})
```

To use the cli formatter you can require it and pass the `formatter` options:

```javascript
const log = new Loggerr({
  formatter: require('loggerr/formatters/cli')
})
```

## Output Streams

You can output each level to it's own stream. The method is simple, just pass an
array of streams corresponding to each level as the `streams` option. The simplest
way is to just map over `Loggerr.levels`, this is how we set the defaults:

```javascript
new Loggerr({
  streams: Loggerr.levels.map(function (level, i) {
    return i > Loggerr.WARNING ? process.stdin : process.stderr
  })
})
```

The most useful reason to specify an output stream to to redirect logs to files.
Here is an example of how to do that:

```javascript
const logfile = fs.createWriteStream('./logs/stdout.log', {
  flags: 'a',
  encoding: 'utf8'
})

new Loggerr({
  streams: Loggerr.levels.map(() => logfile)
})
```

## Bundling with Rollup

There is a dynamic require in this library. If you intend to use this with a bundler (ex Rollup) you may need to configure it to include the correct formatter if you pass that
option as a string (ex `formatter: 'cli'`).

Example:

```javascript
// rollup.config.js
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'commonjs'
  },
  plugins: [
    nodeResolve(),
    commonjs({
      dynamicRequireTargets: [
        './node_modules/loggerr/formatters/cli.js',
      ]
    })
  ]
};
```

The values above will change based on your application, but the main important thing is the `dynamicRequireTargets` configuration.
