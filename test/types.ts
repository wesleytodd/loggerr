/// <reference types="../loggerr.d.ts" />

/**
 * This file should not be run, but it should be type-checked.
 */

import { expectTypeOf } from 'expect-type';
import Loggerr, { Formatter, FormatterFunction, LogFunction } from 'loggerr';

expectTypeOf<typeof Loggerr>().toBeConstructibleWith({
  levels: ['butts', 'feet', 'armpits'],
  formatter: (date, level, data) => `${date} ${level} ${data}`,
  streams: ([] as NodeJS.WritableStream[]).fill(process.stderr, 0, 3),
});

expectTypeOf<Loggerr['DEBUG']>().toEqualTypeOf<6>();

const defaultLogger = new Loggerr();

expectTypeOf<(typeof defaultLogger)['level']>().toBeNumber();

expectTypeOf<(typeof defaultLogger)['debug']>().toMatchTypeOf<LogFunction>();

const customLogger = new Loggerr({ levels: ['butts', 'feet', 'armpits'] });

expectTypeOf<
  (typeof customLogger)['formatter']
>().toMatchTypeOf<FormatterFunction>();

expectTypeOf<'bunyan'>().toMatchTypeOf<Formatter>();

expectTypeOf<(typeof customLogger)['butts']>().toEqualTypeOf<LogFunction>();

expectTypeOf(customLogger.setLevel('butts')).toEqualTypeOf<void>();
expectTypeOf(customLogger.setLevel(0)).toEqualTypeOf<void>();

expectTypeOf(customLogger.log('feet', 'hello')).toEqualTypeOf<void>();
