import {DocumentType} from '@typegoose/typegoose/lib/types';
import {IssuedTokenEntity} from './token.entity.js';

export interface IssuedTokenServiceInterface {
  issue(userId: string, expiresAt: number, jti: string): Promise<void>
  revoke(jti: string): Promise<void>
  isRevoked(jti: string): Promise<boolean>
  getIssuedToken(jti: string): Promise<DocumentType<IssuedTokenEntity> | null>
}
