import {Container} from 'inversify';
import RestApplication from './rest-application';
import {LoggerInterface} from '../core/logger/logger.interface';
import {ConfigInterface} from '../core/config/config.interface';
import {Component} from '../types/component.enum';
import {ConfigSchema} from '../core/config/config.schema';
import {DBClientInterface} from '../core/db-client/db-client.interface';
import ConfigService from '../core/config/config.service';
import MongoClientService from '../core/db-client/mongo-client.service';
import PinoService from '../core/logger/pino.service';
import {ExceptionFilter} from '../core/http/exception-filter.interface';
import AppExceptionFilter from '../core/http/app-exception-filter';

export function createApplicationContainer() {
  const applicationContainer = new Container();
  applicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(PinoService).inSingletonScope();
  applicationContainer.bind<ConfigInterface<ConfigSchema>>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
  applicationContainer.bind<DBClientInterface>(Component.DBClientInterface).to(MongoClientService).inSingletonScope();
  applicationContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return applicationContainer;
}
