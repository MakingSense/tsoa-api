import { Request, Response, NextFunction } from 'express';

import { Logger } from './Logger';

export class ApiError extends Error {
  public statusCode: number;

  constructor(name: string, statusCode: number, message?: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class ErrorHandler {
  public static handleError(error: ApiError, req: Request, res: Response, next: NextFunction): void {
    const { name = 'InternalServerError', message = 'error', statusCode = 500 } = error;
    Logger.error(`Error: ${name}:`, message, error);
    res.status(statusCode).json({ name, message })
    next();
  }
}
