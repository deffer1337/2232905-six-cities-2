import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_ALGORITHM: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Application server port',
    format: 'port',
    env: 'PORT',
    default: 8000
  },
  SALT: {
    doc: 'Salt for hash passwords',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Database ip-address',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Username for connect to db',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password for connect to db',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port for connect to db',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: 'buy-and-sell'
  },
  JWT_SECRET: {
    doc: 'JWT secret string',
    format: String,
    env: 'JWT_SECRET',
    default: 'six-sities-yoyoyo'
  },
  JWT_ALGORITHM: {
    doc: 'JWT algorithm',
    format: String,
    env: 'JWT_ALGORITHM',
    default: 'HS256'
  }
});
