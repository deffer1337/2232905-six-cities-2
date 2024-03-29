import mongoose from 'mongoose';
import { MiddlewareInterface } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {HttpError} from '../http/http.errors.js';

const { Types } = mongoose;

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private paramKey: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.paramKey];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
