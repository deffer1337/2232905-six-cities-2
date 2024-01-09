
export interface TokenServiceInterface {
  issueToken(algorithm: string, jwtSecret: string, payload: object): Promise<string>
}
