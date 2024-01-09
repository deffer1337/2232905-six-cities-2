import { StatusCodes } from 'http-status-codes';
import { NextFunction, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import {HttpError} from '../http/http.errors.js';
import {FindResourceInterface} from '../../types/find-resource.interface.js';
import {ExtendedRequestInterface} from '../../types/extended-request.js';

export class CheckUserAccessToResourceMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: FindResourceInterface,
    private readonly paramKey: string,
  ) {}

  public async execute({params, user}: ExtendedRequestInterface, _res: Response, next: NextFunction): Promise<void> {
    const resourceId = params[this.paramKey];
    const resource = await this.service.findById(resourceId);
    if (resource?.userId.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Resource was created other user',
        'CheckUserAccessToResourceMiddleware'
      );
    }

    next();
  }
}
