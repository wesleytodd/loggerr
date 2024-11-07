/// <reference types="../loggerr.d.ts" />

/**
 * This file should not be run, but it should be type-checked.
 */

import { expectTypeOf } from 'expect-type';
import DefaultLoggerr, {
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
expectTypeOf<DefaultLevels>().toMatchTypeOf<Levels>();
expectTypeOf<DefaultLevels['length']>().toEqualTypeOf<8>();

// #endregion

// #region default export

// an instance with a `Loggerr` prop
expectTypeOf<typeof DefaultLoggerr>().toEqualTypeOf<
  Loggerr<DefaultLevels> & { Loggerr: typeof Loggerr }
>();

expectTypeOf<typeof DefaultLoggerr.Loggerr>().toEqualTypeOf(Loggerr);
expectTypeOf<typeof DefaultLoggerr.Loggerr>().toBeConstructibleWith({});

// #endregion

// #region Loggerr export

// same value as DefaultLoggerr.Loggerr
expectTypeOf<typeof Loggerr.Loggerr>().toEqualTypeOf<typeof Loggerr>();
expectTypeOf<typeof Loggerr.Loggerr>().toBeConstructibleWith({});
expectTypeOf<(typeof Loggerr)['DEBUG']>().toEqualTypeOf<6>();
// @ts-expect-error - cannot provide empty levels option
new Loggerr({levels: []});

// #endregion

// #region new default instance
const newDefaultLoggerr = new Loggerr();

expectTypeOf<typeof newDefaultLoggerr>().toEqualTypeOf<Loggerr>();

expectTypeOf<(typeof newDefaultLoggerr)['level']>().toMatchTypeOf<
  Indices<DefaultLevels>
>();

expectTypeOf<
  (typeof newDefaultLoggerr)['debug']
>().toMatchTypeOf<LogFunction>();

// @ts-expect-error - Only the default export instance has a `Loggerr` prop
expectTypeOf<(typeof newDefaultLoggerr)['Loggerr']>().not.toBeUndefined();

expectTypeOf(newDefaultLoggerr.setLevel(1)).toEqualTypeOf<void>();
// @ts-expect-error - no such level
expectTypeOf(newDefaultLoggerr.setLevel(9000)).toEqualTypeOf<void>();
expectTypeOf(newDefaultLoggerr.setLevel('debug')).toEqualTypeOf<void>();
// @ts-expect-error - no such level
expectTypeOf(newDefaultLoggerr.setLevel('silly')).toEqualTypeOf<void>();

// #endregion

// #region custom levels

const customLogger = new Loggerr({ levels: ['butts', 'feet', 'armpits'] });

expectTypeOf<
  (typeof customLogger)['formatter']
>().toMatchTypeOf<FormatterFunction>();

expectTypeOf<'bunyan'>().toMatchTypeOf<Formatter>();

expectTypeOf<(typeof customLogger)['butts']>().toEqualTypeOf<LogFunction>();

expectTypeOf(customLogger.setLevel('butts')).toEqualTypeOf<void>();
expectTypeOf(customLogger.setLevel(0)).toEqualTypeOf<void>();

expectTypeOf(customLogger.log('feet', 'hello')).toEqualTypeOf<void>();

// #endregion

// #region helpers
expectTypeOf<Indices<DefaultLevels>>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
>();

const arr = ['a', 'b', 'c'];
expectTypeOf<(typeof arr)['length']>().not.toEqualTypeOf<0 | 1 | 2>();
expectTypeOf<Indices<typeof arr>>().toEqualTypeOf<never>();

const tuple = ['a', 'b', 'c'] as const;
expectTypeOf<Indices<typeof tuple>>().toEqualTypeOf<0 | 1 | 2>();

expectTypeOf<TupleOfLength<typeof tuple, typeof tuple['length']>>().toMatchTypeOf<TupleOfLength<readonly ['a', 'b', 'c'], 3>>();

// #endregion
