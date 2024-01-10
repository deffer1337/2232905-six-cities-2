import { Request } from 'express';
import {UserLite} from './user-lite.type';

export interface ExtendedRequestInterface extends Request {
  user: UserLite,
}
