import constants from './constants';

export class Logger {
  private static readonly shouldLog: boolean = constants.environment !== 'test';
  public static log(...args: any[]): void {
    Logger.shouldLog && console.log(Logger.formatArgs(args));
  }
  public static warn(...args: any[]): void {
    Logger.shouldLog && console.warn(Logger.formatArgs(args));
  }

  public static error(...args: any[]): void {
    Logger.shouldLog && console.error(Logger.formatArgs(args));
  }

  private static formatArgs(args: any[]): string {
    if (args.length <= 1) args = args[0];
    return JSON.stringify(args, null, 4)
  }
}
