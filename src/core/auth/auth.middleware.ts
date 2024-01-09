import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';
import {HttpError} from '../http/http.errors.js';
import {MiddlewareInterface} from '../middlewares/middleware.interface';
import {inject} from 'inversify';
import {Component} from '../../types/component.enum';
import {IssuedTokenServiceInterface} from '../../modules/token/token-service.interface';

export class AuthMiddleware implements MiddlewareInterface {
  constructor(
    private readonly jwtSecret: string,
    @inject(Component.IssuedTokenServiceInterface) private readonly issuedTokenService: IssuedTokenServiceInterface
  ) {
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const revoked = await this.issuedTokenService.isRevoked(payload.jti);
      if (revoked){
        return next(new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Token is revoked',
          'AuthMiddleware'
        ));
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.user = { email: payload.email as string, id: payload.id as string };
      return next();
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthMiddleware')
      );
    }
  }
}
