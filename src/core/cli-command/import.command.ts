import {CliCommandInterface} from './cli-command.interface';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import {getErrorMessage} from '../helpers/common.js';
import {createOffer} from '../helpers/offer.js';
import {UserServiceInterface} from '../../modules/user/user-service.interface.js';
import {OfferServiceInterface} from '../../modules/offer/offer-service.interface.js';
import {DBClientInterface} from '../db-client/db-client.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console-logger.service.js';
import OfferService from '../../modules/offer/offer.service.js';
import UserService from '../../modules/user/user.service.js';
import MongoClientService from '../db-client/mongo-client.service.js';
import {OfferModel} from '../../modules/offer/offer.entity.js';
import {UserModel} from '../../modules/user/user.entity.js';
import {OfferType} from '../../types/offer.type.js';
import {DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD} from '../helpers/consts.js';
import {getMongoURI} from '../helpers/db.js';


export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private dbService!: DBClientInterface;
  private readonly logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.dbService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: OfferType) {
    const user = await this.userService.findOrCreate({
      ...offer.offerAuthor,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      ...offer,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: VoidFunction) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${count} rows successfully imported`);
    this.dbService.disconnect();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.dbService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      this.logger.error(`Can't read the file with error: ${getErrorMessage(err)})}`);
    }
  }
}
