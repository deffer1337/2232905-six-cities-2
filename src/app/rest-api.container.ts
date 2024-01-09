import {Container} from 'inversify';
import RestApplication from './rest-application.js';
import {LoggerInterface} from '../core/logger/logger.interface.js';
import {ConfigInterface} from '../core/config/config.interface.js';
import {Component} from '../types/component.enum.js';
import {ConfigSchema} from '../core/config/config.schema.js';
import {DBClientInterface} from '../core/db-client/db-client.interface.js';
import ConfigService from '../core/config/config.service.js';
import MongoClientService from '../core/db-client/mongo-client.service.js';
import PinoService from '../core/logger/pino.service.js';
import {ExceptionFilter} from '../core/http/exception-filter.interface.js';
import AppExceptionFilter from '../core/http/app-exception-filter.js';

export function createApplicationContainer() {
  const applicationContainer = new Container();
  applicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(PinoService).inSingletonScope();
  applicationContainer.bind<ConfigInterface<ConfigSchema>>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
  applicationContainer.bind<DBClientInterface>(Component.DBClientInterface).to(MongoClientService).inSingletonScope();
  applicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return applicationContainer;
}
