import { Request } from 'express';

import { ApiError } from './config/ErrorHandler';

export type res = { status: number; message: string };

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<res> {
  switch (securityName) {
    case 'adminUser':
      return null; /** everyone is an admin now :D */
  }
  throw new ApiError('auth', 403, 'invalid credentials');
}
