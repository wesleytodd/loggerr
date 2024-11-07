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
} from 'loggerr';

/**
 * Checks the default export, which is an instance of `Loggerr` with the default
 * levels.
 */
{
  expectTypeOf<typeof DefaultLoggerr>().toEqualTypeOf<
    Loggerr<DefaultLevels> & { Loggerr: typeof Loggerr }
  >();

  expectTypeOf<typeof DefaultLoggerr.Loggerr>().toEqualTypeOf(Loggerr);

  expectTypeOf<typeof DefaultLoggerr.Loggerr>().toBeConstructibleWith({
    levels: ['butts', 'feet', 'armpits'],
    formatter: (date, level, data) => `${date} ${level} ${data}`,
    streams: ([] as NodeJS.WritableStream[]).fill(process.stderr, 0, 3),
  });
}

/**
 * Check the `Loggerr` export, which is a class w/ static props
 */
{
  expectTypeOf<typeof Loggerr.Loggerr>().toEqualTypeOf<typeof Loggerr>();

  expectTypeOf<typeof Loggerr.Loggerr>().toBeConstructibleWith({
    levels: ['butts', 'feet', 'armpits'],
    formatter: (date, level, data) => `${date} ${level} ${data}`,
    streams: ([] as NodeJS.WritableStream[]).fill(process.stderr, 0, 3),
  });

  expectTypeOf<(typeof Loggerr)['DEBUG']>().toEqualTypeOf<6>();
}

/**
 * Test a new `Loggerr` instance with default levels
 */
{
  const newDefaultLoggerr = new Loggerr();

  expectTypeOf<typeof newDefaultLoggerr>().toEqualTypeOf<Loggerr>();

  expectTypeOf<(typeof newDefaultLoggerr)['level']>().toMatchTypeOf<number>();

  expectTypeOf<
    (typeof newDefaultLoggerr)['debug']
  >().toMatchTypeOf<LogFunction>();

  /* @ts-expect-error - Only the default export instance has a `Loggerr` prop */
  expectTypeOf<typeof newDefaultLoggerr['Loggerr']>().not.toBeUndefined();
}

/**
 * Check behavior of new `Loggerr` instance with custom levels
 */
{
  const customLogger = new Loggerr({ levels: ['butts', 'feet', 'armpits'] });

  expectTypeOf<
    (typeof customLogger)['formatter']
  >().toMatchTypeOf<FormatterFunction>();

  expectTypeOf<'bunyan'>().toMatchTypeOf<Formatter>();

  expectTypeOf<(typeof customLogger)['butts']>().toEqualTypeOf<LogFunction>();

  expectTypeOf(customLogger.setLevel('butts')).toEqualTypeOf<void>();
  expectTypeOf(customLogger.setLevel(0)).toEqualTypeOf<void>();

  expectTypeOf(customLogger.log('feet', 'hello')).toEqualTypeOf<void>();
}
