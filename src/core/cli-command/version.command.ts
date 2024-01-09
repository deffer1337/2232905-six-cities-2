import pkg from '../../../package.json' assert { type: 'json' };
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    return pkg.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(chalk.green(version));
  }
}
