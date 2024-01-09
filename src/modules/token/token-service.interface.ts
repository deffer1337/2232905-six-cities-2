export interface IssuedTokenServiceInterface {
  issue(userId: string, expiresAt: number, jti: string): Promise<void>
  revoke(jti: string): Promise<void>
  isRevoked(jti: string): Promise<boolean>
}
