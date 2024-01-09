import { v4 as uuidv4 } from 'uuid';
import {injectable} from 'inversify';
import {TokenServiceInterface} from './token-service.interface';
import * as jose from 'jose';
import * as crypto from 'node:crypto';
import {JWTPayload} from 'jose';


@injectable()
export default class TokenService implements TokenServiceInterface {
  // This is a toy authentication using JWT tokens.
  // In the educational project, I decided to simplify it to save time.
  // The implementation in a real-world project would involve both access and refresh tokens.
  public async issueToken(algorithm: string, jwtSecret: string, payload: object) {
    return new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime('30d')
      .setJti(uuidv4())
      .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
  }

  public async getRawToken(token: string): Promise<JWTPayload> {
    return jose.decodeJwt(token);
  }
}
