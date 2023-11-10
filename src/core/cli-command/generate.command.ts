import { CliCommandInterface } from './cli-command.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import OfferGenerator from '../../modules/offer-generator.js';
import TSVFileWriter from '../file-writer/tsv-file-writers.js';
import ConsoleLoggerService from '../logger/console-logger.service.js';
import {LoggerInterface} from '../logger/logger.interface';


export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;
  private readonly logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);
    try {
      const res = await fetch(url);
      this.initialData = await res.json();
    } catch {
      this.logger.error(`Can't get data from ${url}`);
    }
    const offerGenerator = new OfferGenerator(this.initialData);
    const fileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await fileWriter.write(offerGenerator.generate());
    }

    this.logger.info(`File ${filepath} was created!`);
  }
}
