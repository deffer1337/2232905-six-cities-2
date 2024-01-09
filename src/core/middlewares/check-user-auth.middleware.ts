import { StatusCodes } from 'http-status-codes';
import { NextFunction, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import {HttpError} from '../http/http.errors.js';
import {ExtendedRequestInterface} from "../../types/extended-request";

export class CheckUserAuthMiddleware implements MiddlewareInterface {
  public async execute({ user }: ExtendedRequestInterface, _res: Response, next: NextFunction): Promise<void> {
    if (! user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
