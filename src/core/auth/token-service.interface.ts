import {JWTPayload} from 'jose';

export interface TokenServiceInterface {
  issueToken(algorithm: string, jwtSecret: string, payload: object): Promise<string>
  getRawToken(token: string): Promise<JWTPayload>
}
