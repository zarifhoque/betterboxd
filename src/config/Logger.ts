import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  const location = getCallSite();
  return `${timestamp} [${level}] ${location}: ${stack || message}`;
});

export const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // show stack trace for error
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
});

export const getCallSite = (): string => {
  const oldStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const err = new Error();
  const stack = err.stack as unknown as NodeJS.CallSite[];
  Error.prepareStackTrace = oldStackTrace;
  if (!stack) return '';

  // Adjust the index: 0 = this function, 1 = printf, 2 = logger call
  const caller = stack[2];
  if (!caller) return '';

  const file = caller.getFileName()?.split('/').pop();
  const line = caller.getLineNumber();
  const column = caller.getColumnNumber();
  return `${file}:${line}:${column}`;
};
