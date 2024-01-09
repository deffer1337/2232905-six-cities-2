import {Container} from 'inversify';
import {Component} from '../../types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {IssuedTokenServiceInterface} from './token-service.interface.js';
import IssuedTokenService from './token.service.js';
import {IssuedTokenEntity, IssuedTokenModel} from './token.entity.js';

export function createIssuedTokenContainer() {
  const issuedTokenContainer = new Container();

  issuedTokenContainer.bind<IssuedTokenServiceInterface>(Component.IssuedTokenServiceInterface).to(IssuedTokenService);
  issuedTokenContainer.bind<types.ModelType<IssuedTokenEntity>>(Component.IssuedTokenModel).toConstantValue(IssuedTokenModel);

  return issuedTokenContainer;
}
