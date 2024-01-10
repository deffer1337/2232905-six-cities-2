import {inject, injectable} from 'inversify';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {IssuedTokenServiceInterface} from './token-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {IssuedTokenEntity} from './token.entity.js';


@injectable()
export default class IssuedTokenService implements IssuedTokenServiceInterface {
  constructor(
    @inject(Component.IssuedTokenModel) private readonly issuedTokenModel: types.ModelType<IssuedTokenEntity>,
  ) {
  }

  public async revoke(jti:string){
    await this.issuedTokenModel.updateOne(
      {jti: jti},
      {revoked: true}
    );
  }

  public async issue(userId: string, expiresAt: number, jti: string){
    await this.issuedTokenModel.create(
      {
        userId: userId,
        expiresAt: expiresAt,
        jti: jti,
      }
    );
  }

  public async isRevoked(jti: string): Promise<boolean>{
    const issuedToken = await this.issuedTokenModel.findOne({jti: jti});
    if (!issuedToken) {
      return false;
    }
    return issuedToken.revoked;
  }

  public async getIssuedToken(jti: string): Promise<DocumentType<IssuedTokenEntity> | null>{
    return await this.issuedTokenModel.findOne({jti: jti}).populate('userId').exec();
  }
}
