import constants from './constants';
import * as logger from 'winston';

const date = new Date();
const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;
logger.configure({
  level: 'debug',
  format: logger.format.combine(
    logger.format.colorize(),
    logger.format.simple()),
  transports: [
    new logger.transports.File({ filename: `logs/${fileName}`, level: 'debug' }),
    new logger.transports.Console()
  ]
});

export class Logger {
  public static readonly shouldLog: boolean = constants.environment !== 'test';
  public static readonly console = logger;

  public static log(...args: any[]): void {
    if (Logger.shouldLog) Logger.console.debug(Logger.formatArgs(args));
  }

  public static warn(...args: any[]): void {
    if (Logger.shouldLog) Logger.console.warn(Logger.formatArgs(args));
  }

  public static error(...args: any[]): void {
    if (Logger.shouldLog) Logger.console.error(Logger.formatArgs(args));
  }

  public static info(...args: any[]): void {
    if (Logger.shouldLog) Logger.console.info(Logger.formatArgs(args));
  }

  public static verbose(...args: any[]): void {
    if (Logger.shouldLog) Logger.console.verbose(Logger.formatArgs(args));
  }

  private static formatArgs(args: any[]): string {
    if (args.length <= 1) args = args[0];
    return JSON.stringify(args, null, 4);
  }

}
