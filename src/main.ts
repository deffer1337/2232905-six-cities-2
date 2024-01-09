import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './types/component.enum.js';
import RestApplication from './app/rest-application.js';
import {createApplicationContainer} from './app/rest-api.container';
import {createOfferContainer} from './modules/offer/offer.container';
import {createUserContainer} from './modules/user/user.container';
import {createCommentContainer} from './modules/comment/comment.container';
import {createIssuedTokenContainer} from "./modules/token/token.container";


const mainContainer = Container.merge(
  createApplicationContainer(),
  createUserContainer(),
  createOfferContainer(),
  createCommentContainer(),
  createIssuedTokenContainer(),
);
const application = mainContainer.get<RestApplication>(Component.RestApplication);
await application.init();
