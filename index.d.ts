/**
 * NodeJS.WritableStream "Like"
 *
 * We only call .write in this one form
 */
interface WritableStreamLike {
  write(chunk: any, encoding: 'utf8', callback?: (error: Error | null | undefined) => void): boolean;
}

type DefaultStreams = readonly [
  emergency: WritableStreamLike,
  alert: WritableStreamLike,
  critical: WritableStreamLike,
  error: WritableStreamLike,
  warning: WritableStreamLike,
  notice: WritableStreamLike,
  info: WritableStreamLike,
  debug: WritableStreamLike,
]

type DefaultOptions = Readonly<{
  level: LoggerrConstructor['WARNING'];
  formatter: DefaultLoggerr.FormatterFunction;
  streams: DefaultStreams;
  debugStream?: WritableStreamLike
}>;

/**
 * Instantiates a {@link DefaultLoggerr}
 *
 * **This** is the type the consumer will interface with when they use the
 * `Loggerr` export (or `Loggerr` prop of the default export).
 */
interface LoggerrConstructor {
  CRITICAL: 2;
  DEBUG: 6;
  EMERGENCY: 0;
  ERROR: 3;
  INFO: 5;
  WARNING: 4;
  defaultOptions: DefaultOptions;
  levels: DefaultLoggerr.DefaultLevels;
  Loggerr: LoggerrConstructor;

  new <const T extends DefaultLoggerr.Levels = DefaultLoggerr.DefaultLevels>(
    options?: DefaultLoggerr.LoggerrOptions<T>,
  ): DefaultLoggerr.Loggerr<T>;
}

declare namespace DefaultLoggerr {
  /**
   * Builtin formatters
   */
  type Formatter =
    | 'browser'
    | 'bunyan'
    | 'cli'
    | 'cli-simple'
    | 'default';

  /**
   * This aligns the levels with the streams -- there should be a stream for
   * each level.
   */
  type TupleOfLength<T, N extends number, A extends any[] = []> = A extends {
    length: N;
  }
    ? A
    : TupleOfLength<T, N, [...A, T]>;

  /**
   * List of levels when instantiating a new `Loggerr` instance.
   * 
   * @remarks You're gonna want at least one level.
   */
  type Levels = readonly [string, ...string[]];

  interface LoggerrOptions<
    T extends Levels = DefaultLevels,
  > {
    formatter?: Formatter | FormatterFunction;
    level?: LevelRef<T>;
    levels?: T;
    streams?: TupleOfLength<WritableStreamLike, T['length']>;
  }

  /**
   * Default levels for a new `Loggerr` instance (including the default instance)
   */
  type DefaultLevels = readonly [
    'emergency',
    'alert',
    'critical',
    'error',
    'warning',
    'notice',
    'info',
    'debug',
  ];

  /**
   * The type of a formatter, whether {@link Formatters builtin} or not
   */
  type FormatterFunction = (
    date: Date,
    level: string,
    data: Record<string, any>,
  ) => string;

  /**
   * Get the indices of a tuple; used for referencing a level by number
   */
  type Indices<T extends { length: number }> = Exclude<
    Partial<T>['length'],
    T['length']
  >;

  /**
   * Possible ways to reference a level.
   *
   * If an array, it's the index _or_ the item. If an object, we can only use
   * the key, since the value is arbitrary.
   */
  type LevelRef<T extends Levels> = T[number] | Indices<T>

  /**
   * Each log level gets a method which is one of these.
   */
  type LogFunction = (
    msg: string | Error,
    extraOrDone?: Record<string, unknown> | (() => void),
    done?: () => void,
  ) => void;

  /**
   * Defines the dynamic methods added to the {@link Loggerr_ class} instance
   * upon construction
   *
   * @privateRemarks
   * We don't use {@link LevelRef} here because we just want the level names
   */
  type Loggerr<T extends Levels = DefaultLevels> = {
    formatter: FormatterFunction;
    
    level: Indices<T>;
    
    streams: TupleOfLength<WritableStreamLike, T['length']>

    levels: T;

    /**
     * All dynamically-created methods are bound to this method with their level
     * for the first argument.
     *
     * @param level Level to log at
     * @param msg Message or error
     * @param extra Extra data
     * @param done "Done" callback
     */
    log(
      level: LevelRef<T>,
      msg: string | Error,
      extra?: Record<string, any>,
      done?: () => void,
    ): void;

    /**
     * Sets the log level
     * @param level Level to set
     */
    setLevel(level: LevelRef<T>): void;

    /**
     * Writes to a stream corresponding to the level
     * 
     * @param level Level 
     * @param msg Message
     * @param done "Done" callback
     */
    write(
      level: LevelRef<T>,
      msg: Uint8Array | string,
      done?: () => void,
    ): void;

    /**
     * Writes to a stream if level is satisfied
     * 
     * @param level Level 
     * @param msg Message
     * @param done "Done" callback
     */
    writeLevel(
      level: LevelRef<T>,
      msg: Uint8Array | string,
      done?: () => void,
    ): void;
  } & {
    [key in T[number]]: LogFunction;
  }
}

declare const DefaultLoggerr: DefaultLoggerr.Loggerr<DefaultLoggerr.DefaultLevels> & {Loggerr: LoggerrConstructor}

export = DefaultLoggerr
