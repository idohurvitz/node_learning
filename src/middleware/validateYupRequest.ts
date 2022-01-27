import { object, string, number, date, AnyObjectSchema } from 'yup';
import { NextFunction, Request, Response, urlencoded } from 'express';
import logger from '../utils/logger';

export const ValidateYup = (schema: AnyObjectSchema, type: 'body' | 'headers') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Validator | got new validate request | user request is: ${JSON.stringify({ ...req.query, ...req.body })}`);
    let validatedInput: object | undefined;
    type === 'body' ? (validatedInput = req.body) : (validatedInput = req.query);
    try {
      const inputPostValidation = await schema.validate(validatedInput);
      logger.info(
        `validated successfully | got request:${JSON.stringify(
          validatedInput
        )} | updating Input after validate:  ${JSON.stringify(inputPostValidation)},`
      );
      type === 'body' ? (req.body = inputPostValidation) : '';
      next();
    } catch (errorObj: any) {
      logger.error(`Validator | didn't validate | user input was: ${JSON.stringify(validatedInput)} | error: ${errorObj} | tr`);

      return res.status(422).json({ error: errorObj.errors[0] });
    }
  };
};
// TODO using the typescript way of yup (ObjectSchema)
export const Schemas = {
  userBodySchema: object().shape({
    username: string().required()
  }),
  exerciseBodySchema: object().shape({
    duration: number().required().positive().integer(),
    description: string().required(),
    date: date().default(() => new Date())
  }),
  exerciseParamsSchema: object().shape({
    from: string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
    to: string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
    limit: number()
  }),
  urlBodySchema: object().shape({
    url: string().url('invalid url').required()
  })
};

export interface userInputInterface {
  username: string;
}

export interface exerciseInputInterface {
  duration: number;
  description: string;
  date: Date;
}

export interface urlInterface {
  short_url?: number;
  url: string;
}
