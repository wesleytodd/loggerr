# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.3.0](https://github.com/wesleytodd/loggerr/compare/v4.2.0...v4.3.0) (2025-06-30)


### Features

* align cli detail output with key ([5189a1a](https://github.com/wesleytodd/loggerr/commit/5189a1a30ad0e34797a4badf87bc1f2b4063bcd5))
* **formatter:** add simple-cli depth option and default ([#22](https://github.com/wesleytodd/loggerr/issues/22)) ([038fa86](https://github.com/wesleytodd/loggerr/commit/038fa86d4daf234d5b4d8174ac97febc635a9b8f))
* remove depdendecy on @types/node ([#24](https://github.com/wesleytodd/loggerr/issues/24)) ([e12bb7c](https://github.com/wesleytodd/loggerr/commit/e12bb7c1b90dc3cc0d643efed0dd4784562b7a8e))


### Bug Fixes

* **ci:** add node@24.x to CI ([#26](https://github.com/wesleytodd/loggerr/issues/26)) ([020877d](https://github.com/wesleytodd/loggerr/commit/020877d9372733839c7f03bc183a9f2f2ad6b111))
* **dev-deps:** mocha@^11.7.1 ([983f4b9](https://github.com/wesleytodd/loggerr/commit/983f4b9c7f362b1db5de4e3971d61db9db7d0331))
* **dev-deps:** rollup plugins updated ([4a1d9d1](https://github.com/wesleytodd/loggerr/commit/4a1d9d123ffd1d1d6d96067a5748545fbaffad3a))
* **dev-deps:** rollup@^4.44.1 ([344464f](https://github.com/wesleytodd/loggerr/commit/344464fb0141cadc3ca23eb7cff445fac2058683))

## [4.2.0](https://github.com/wesleytodd/loggerr/compare/v4.1.0...v4.2.0) (2024-11-14)


### Features

* **types:** adds types ([#17](https://github.com/wesleytodd/loggerr/issues/17)) ([f82c5ff](https://github.com/wesleytodd/loggerr/commit/f82c5ff89b66baadb6d22f40b090515aac0a49ea))


### Bug Fixes

* **test:** use vlt in tests ([e7be1b1](https://github.com/wesleytodd/loggerr/commit/e7be1b198cd72da598393e37d6910bd5cb93279f))
* **types:** fix the types ([eb6245e](https://github.com/wesleytodd/loggerr/commit/eb6245eec753f89a081113d05c305244fca4b70b))

## [4.1.0](https://github.com/wesleytodd/loggerr/compare/v4.0.0...v4.1.0) (2024-10-10)


### Features

* added cli-simple formatter and .write for unmodified logging ([92a69f6](https://github.com/wesleytodd/loggerr/commit/92a69f69d573b049b3f331a081e0025a8977a352))


### Bug Fixes

* **ci:** updated checkout and setup-node actions and branch ([ffea84b](https://github.com/wesleytodd/loggerr/commit/ffea84b65680f406a8f08defd724ec2afd6df28b))

## [4.0.0](https://github.com/wesleytodd/loggerr/compare/v3.3.0...v4.0.0) (2024-07-25)


### ⚠ BREAKING CHANGES

* support bundlers like rollup, drops old node versions

### Bug Fixes

* add funding.yml ([a6e3235](https://github.com/wesleytodd/loggerr/commit/a6e3235cd2328bc9bcf19b78d1fd201e70d8f7c2))
* **devDeps:** c8@^10.1.2 ([f0dac84](https://github.com/wesleytodd/loggerr/commit/f0dac846c548b017a79b3f88877765921268b3e8))
* **devDeps:** standard-version@^9.5.0 ([53a2f4b](https://github.com/wesleytodd/loggerr/commit/53a2f4b53757c07ebb444f09a9c226a60295414e))
* **devDeps:** standard@17.1.0 ([3b8c3b8](https://github.com/wesleytodd/loggerr/commit/3b8c3b8a5df59cfa0fcc76f1ac815e132fc9a59c))
* readme branch link ([69be749](https://github.com/wesleytodd/loggerr/commit/69be7491d379dbe0c8fc5f744c9ec3508d1d82e6))
* support bundlers like rollup, drops old node versions ([f136fd1](https://github.com/wesleytodd/loggerr/commit/f136fd1b04e844502cc507bf11e5da75f5379580))

## [3.3.0](https://github.com/wesleytodd/loggerr/compare/v3.2.0...v3.3.0) (2021-04-19)


### Features

* log error properties as extra data ([c7f64ca](https://github.com/wesleytodd/loggerr/commit/c7f64caf1cf2dcef5cbd0ed1f59dfca92f55717c))

## [3.2.0](https://github.com/wesleytodd/loggerr/compare/v3.1.0...v3.2.0) (2021-01-15)


### Features

* **cli:** clean up multi-line error display ([ceee0ac](https://github.com/wesleytodd/loggerr/commit/ceee0ac99be02aae4cc31cf6e134a7c7f5b50c70))

## [3.1.0](https://github.com/wesleytodd/loggerr/compare/v3.0.0...v3.1.0) (2020-10-29)


### Features

* cli logger no supports colors:false ([5bd9ff5](https://github.com/wesleytodd/loggerr/commit/5bd9ff5477331361a5a322d0c03ab6619789ccf8))


### Bug Fixes

* node@6 was never supposed to be supported in 3.x ([0df26b6](https://github.com/wesleytodd/loggerr/commit/0df26b644b2208c176b12339b7278300dd67458d))

## [3.0.0](https://github.com/wesleytodd/loggerr/compare/v3.0.0-3...v3.0.0) (2020-10-21)


### Bug Fixes

* only capture stack if passed an error ([3e3ca5a](https://github.com/wesleytodd/loggerr/commit/3e3ca5a501f881332f7e71d99dca12fc278e75ff))

## [3.0.0-3](https://github.com/wesleytodd/loggerr/compare/v3.0.0-2...v3.0.0-3) (2020-09-10)


### Bug Fixes

* **build:** ci fixes, added node versions, updated badges and docs, and added standard-version ([dd34b0f](https://github.com/wesleytodd/loggerr/commit/dd34b0fefc96ca4c06d0b0dfa6c88af69ca3ec5d))
