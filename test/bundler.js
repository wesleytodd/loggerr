'use strict'
const { describe, it } = require('mocha')
const assert = require('node:assert')
const path = require('node:path')
const vm = require('node:vm')
const { rollup } = require('rollup')

describe('Bundlers', () => {
  it('should bundle with rollup', async () => {
    const bundle = await rollup({
      input: {
        main: path.join(__dirname, '..', 'examples', 'cli')
      },
      plugins: [
        require('@rollup/plugin-node-resolve')(),
        require('@rollup/plugin-commonjs')({
          dynamicRequireTargets: [
            path.join(__dirname, '..', 'formatters', 'cli.js')
          ]
        })
      ]
    })

    assert(bundle.watchFiles.includes(path.join(__dirname, '..', 'examples', 'cli.js')))
    assert(bundle.watchFiles.includes(path.join(__dirname, '..', 'formatters', 'cli.js')))

    const { output } = await bundle.generate({
      format: 'cjs'
    })
    await bundle.close()

    vm.runInThisContext(`
      ;((require, module) => {
        ${output[0].code};
        return module;
      });
    `)(require, {})
  })
})
