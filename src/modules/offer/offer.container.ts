import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import OfferService from './offer.service.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../core/controller/controller.abstract.js';
import OfferController from './offer.controller.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentService from '../comment/comment.service.js';
import {UserServiceInterface} from '../user/user-service.interface.js';
import UserService from '../user/user.service.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  offerContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
  offerContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);

  return offerContainer;
}
