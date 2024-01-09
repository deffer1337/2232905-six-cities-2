import {NextFunction, Response} from 'express';
import {HttpMethod} from './http.method.enum.js';
import { ExtendedRequestInterface } from './extended-request.js';
import {MiddlewareInterface} from '../core/middlewares/middleware.interface';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (req: ExtendedRequestInterface, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
