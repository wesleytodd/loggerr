
declare module 'loggerr' {
  type Formatter = 'browser' | 'bunyan' | 'cli' | 'default';

  interface LoggerrOptions<T extends readonly string[] = DefaultLevels> {
    formatter?: Formatter | FormatterFunction;
    level?: string | number;
    levels?: T;
    streams?: NodeJS.WritableStream[];
  }

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

  type FormatterFunction = (
    date: Date,
    level: string,
    data: Record<string, any>,
  ) => string; 

  class _Loggerr<const T extends readonly string[] = DefaultLevels> {
    public static ALERT: 1;
    public static CRITICAL: 2;
    public static DEBUG: 6;
    public static EMERGENCY: 0;
    public static ERROR: 3;
    public static INFO: 5;
    public static WARNING: 4;
    public static defaultOptions: {
      level: typeof _Loggerr.WARNING;
      formatter: FormatterFunction;
      streams: [
        NodeJS.Process['stderr'], // emergency
        NodeJS.Process['stderr'], // alert
        NodeJS.Process['stderr'], // critical
        NodeJS.Process['stderr'], // error
        NodeJS.Process['stderr'], // warning
        NodeJS.Process['stdout'], // notice
        NodeJS.Process['stdout'], // info
        NodeJS.Process['stdout'], // debug
      ];
    };
    public static levels: [
      'emergency',
      'alert',
      'critical',
      'error',
      'warning',
      'notice',
      'info',
      'debug',
    ];

    public formatter: FormatterFunction;
    public level: number;
    public streams: NodeJS.WritableStream[];

    constructor(options?: LoggerrOptions<T>);

    public log(
      level: keyof T | T[number],
      msg: any,
      extra?: Record<string, any>,
      done?: () => void,
    ): void;
    public setLevel(level: keyof T | T[number]): void;
    public write(level: keyof T | T[number], msg: string, done?: () => void): void;

  }

  type Loggerr<T extends readonly string[] = DefaultLevels> = {
    [key in T[number]]: (msg: any, extra?: Record<string, any>, done?: () => void) => void;
  } & { levels: T } &  _Loggerr<T>;

  interface LoggerrConstructor {
    new <T extends readonly string[] = DefaultLevels>(options?: LoggerrOptions<T>): Loggerr<T>;
  }

  const LoggerrConstructor: LoggerrConstructor;

  export = LoggerrConstructor;
}

