import {Container} from 'inversify';
import {UserServiceInterface} from './user-service.interface.js';
import UserService from './user.service.js';
import {Component} from '../../types/component.enum.js';
import {UserEntity, UserModel} from './user.entity.js';
import {types} from '@typegoose/typegoose';
import {Controller} from '../../core/controller/controller.abstract.js';
import UserController from './user.controller.js';
import TokenService from '../../core/auth/token.service.js';
import {TokenServiceInterface} from '../../core/auth/token-service.interface.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  userContainer.bind<TokenServiceInterface>(Component.TokenServiceInterface).to(TokenService);

  return userContainer;
}
