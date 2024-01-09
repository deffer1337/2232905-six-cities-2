import { MiddlewareInterface } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

export class ValidateDTOMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute({body}: Request, res: Response, next: NextFunction): Promise<void> {
    const dto = plainToInstance(this.dto, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(errors);
      return;
    }

    next();
  }
}
