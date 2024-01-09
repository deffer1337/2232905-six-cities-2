import { ParamsDictionary } from 'express-serve-static-core';

export type ParamsOffersCount = {
  count: number;
} | ParamsDictionary;
