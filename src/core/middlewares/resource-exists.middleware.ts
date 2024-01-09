import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import {ResourceExistsInterface} from '../../types/resource-exists.interface.js';
import {HttpError} from '../http/http.errors.js';

export class ResourceExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: ResourceExistsInterface,
    private readonly entityName: string,
    private readonly paramKey: string,
  ) {}

  public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
    const resourceId = params[this.paramKey];
    if (!await this.service.exists(resourceId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with id '${resourceId}' not found.`,
        'ResourceExistsMiddleware'
      );
    }

    next();
  }
}
