import { ParamsDictionary } from 'express-serve-static-core';

export type ParamsCity = {
  city: string;
} | ParamsDictionary;
