import {LoggerInterface} from '../core/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {ConfigInterface} from '../core/config/config.interface.js';
import {ConfigSchema} from '../core/config/config.schema.js';
import {Component} from '../types/component.enum.js';
import {DBClientInterface} from '../core/db-client/db-client.interface';
import {getMongoURI} from '../core/helpers/db';
import express, {Express} from 'express';
import {ControllerInterface} from "../core/controller/controller.interface";
import {ExceptionFilter} from "../core/http/exception-filter.interface";
import {AuthMiddleware} from "../core/auth/auth.middleware";


@injectable()
export default class RestApplication {
  private app: Express;

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>,
    @inject(Component.DBClientInterface) private readonly dbClient: DBClientInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
  ) {
    this.app = express();
  }

  private async initApp() {
    this.logger.info('App init');

    const port = this.config.get('PORT');
    this.app.listen(port);

    this.logger.info('App success init');
  }

  private async initRoutes() {
    this.app.use('/offers', this.offerController.router);
    this.app.use('/users', this.userController.router);
  }

  private async initMiddleware() {
    this.app.use(express.json());

    const authMiddleware = new AuthMiddleware(this.config.get('JWT_SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  private async initExceptionFilters() {
    this.app.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initDb() {
    this.logger.info('DB init');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
    this.logger.info(`DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`SALT: ${this.config.get('SALT')}`);

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.dbClient.connect(mongoUri);
    this.logger.info('DB initialized');
  }

  public async init() {
    await this.initDb();
    await this.initApp();
    await this.initRoutes();
    await this.initMiddleware();
    await this.initExceptionFilters();
  }
}
