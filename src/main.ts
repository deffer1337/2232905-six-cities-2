import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './types/component.enum.js';
import RestApplication from './app/rest-application.js';
import {createApplicationContainer} from './app/rest-api.container.js';
import {createOfferContainer} from './modules/offer/offer.container.js';
import {createUserContainer} from './modules/user/user.container.js';
import {createCommentContainer} from './modules/comment/comment.container.js';
import {createIssuedTokenContainer} from './modules/token/token.container.js';


const mainContainer = Container.merge(
  createApplicationContainer(),
  createUserContainer(),
  createOfferContainer(),
  createCommentContainer(),
  createIssuedTokenContainer(),
);
const application = mainContainer.get<RestApplication>(Component.RestApplication);
await application.init();
