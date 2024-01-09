import {injectable} from 'inversify';
import {TokenServiceInterface} from './token-service.interface';
import * as jose from 'jose';
import * as crypto from 'node:crypto';


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
      .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
  }
}
