/**
 * This file should not be run, but it should be type-checked.
 */

import expect = require('expect-type');
import DefaultLoggerr = require('loggerr');
import type {
  Loggerr,
  Formatter,
  FormatterFunction,
  LogFunction,
  DefaultLevels,
  Levels,
  Indices,
  TupleOfLength,
} from 'loggerr';

// #region default levels
expect.expectTypeOf<DefaultLevels>().toMatchTypeOf<Levels>();
expect.expectTypeOf<DefaultLevels['length']>().toEqualTypeOf<8>();

// #endregion

// #region default export

// an instance with a `Loggerr` prop
expect.expectTypeOf<typeof DefaultLoggerr>().toEqualTypeOf<
  Loggerr<DefaultLevels> & { Loggerr: typeof Loggerr }
>();

expect.expectTypeOf<typeof DefaultLoggerr.Loggerr>().toEqualTypeOf(DefaultLoggerr.Loggerr);
expect.expectTypeOf<typeof DefaultLoggerr.Loggerr>().toBeConstructibleWith({});

// #endregion

// #region Loggerr export

// same value as DefaultLoggerr.Loggerr
expect.expectTypeOf<typeof Loggerr.Loggerr>().toEqualTypeOf<typeof Loggerr>();
expect.expectTypeOf<typeof Loggerr.Loggerr>().toBeConstructibleWith({});
expect.expectTypeOf<(typeof Loggerr)['DEBUG']>().toEqualTypeOf<6>();
// @ts-expect-error - cannot provide empty levels option
new Loggerr({levels: []});

// #endregion

// #region new default instance
const newDefaultLoggerr = new DefaultLoggerr.Loggerr();

expect.expectTypeOf<typeof newDefaultLoggerr>().toEqualTypeOf<Loggerr>();

expect.expectTypeOf<(typeof newDefaultLoggerr)['level']>().toMatchTypeOf<
  Indices<DefaultLevels>
>();

expect.expectTypeOf<
  (typeof newDefaultLoggerr)['debug']
>().toMatchTypeOf<LogFunction>();

// @ts-expect-error - Only the default export instance has a `Loggerr` prop
expect.expectTypeOf<(typeof newDefaultLoggerr)['Loggerr']>().not.toBeUndefined();

expect.expectTypeOf(newDefaultLoggerr.setLevel(1)).toEqualTypeOf<void>();
// @ts-expect-error - no such level
expect.expectTypeOf(newDefaultLoggerr.setLevel(9000)).toEqualTypeOf<void>();
expect.expectTypeOf(newDefaultLoggerr.setLevel('debug')).toEqualTypeOf<void>();
// @ts-expect-error - no such level
expect.expectTypeOf(newDefaultLoggerr.setLevel('silly')).toEqualTypeOf<void>();

// #endregion

// #region custom levels

const customLogger = new DefaultLoggerr.Loggerr({ levels: ['butts', 'feet', 'armpits'] });

expect.expectTypeOf<
  (typeof customLogger)['formatter']
>().toMatchTypeOf<FormatterFunction>();

expect.expectTypeOf<'bunyan'>().toMatchTypeOf<Formatter>();

expect.expectTypeOf<(typeof customLogger)['butts']>().toEqualTypeOf<LogFunction>();

expect.expectTypeOf(customLogger.setLevel('butts')).toEqualTypeOf<void>();
expect.expectTypeOf(customLogger.setLevel(0)).toEqualTypeOf<void>();

expect.expectTypeOf(customLogger.log('feet', 'hello')).toEqualTypeOf<void>();

// #endregion

// #region helpers
expect.expectTypeOf<Indices<DefaultLevels>>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
>();

const arr = ['a', 'b', 'c'];
expect.expectTypeOf<(typeof arr)['length']>().not.toEqualTypeOf<0 | 1 | 2>();
expect.expectTypeOf<Indices<typeof arr>>().toEqualTypeOf<never>();

const tuple = ['a', 'b', 'c'] as const;
expect.expectTypeOf<Indices<typeof tuple>>().toEqualTypeOf<0 | 1 | 2>();

expect.expectTypeOf<TupleOfLength<typeof tuple, typeof tuple['length']>>().toMatchTypeOf<TupleOfLength<readonly ['a', 'b', 'c'], 3>>();

// #endregion
