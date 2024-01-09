import {CliCommandInterface} from './cli-command.interface';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import {fillDTO, getErrorMessage} from '../helpers/common.js';
import {createOffer} from '../helpers/offer.js';
import {OfferServiceInterface} from '../../modules/offer/offer-service.interface.js';
import {DBClientInterface} from '../db-client/db-client.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console-logger.service.js';
import OfferService from '../../modules/offer/offer.service.js';
import MongoClientService from '../db-client/mongo-client.service.js';
import {OfferModel} from '../../modules/offer/offer.entity.js';
import {OfferType} from '../../types/offer.type.js';
import {DEFAULT_DB_PORT} from '../helpers/consts.js';
import {getMongoURI} from '../helpers/db.js';
import OfferDto from '../../modules/offer/dto/offer.dto';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private offerService!: OfferServiceInterface;
  private dbService!: DBClientInterface;
  private readonly logger: LoggerInterface;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(OfferModel);
    this.dbService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: OfferType) {
    await this.offerService.create(fillDTO(OfferDto, offer));
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
    const [filename, login, password, host, dbname] = parameters;
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

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
