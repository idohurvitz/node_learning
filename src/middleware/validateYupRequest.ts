import { object, string, number, date, AnyObjectSchema } from 'yup';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export const ValidateYup = (schema: AnyObjectSchema, type: 'body' | 'headers') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let validatedInput: object | undefined;
      type === 'body' ? (validatedInput = req.body) : (validatedInput = req.headers);
      const inputPostValidation = await schema.validate(validatedInput);
      logger.info(
        `validated successfully | got request:${JSON.stringify(validatedInput)}| updating Input after validate:  ${JSON.stringify(
          inputPostValidation
        )},`
      );
      type === 'body' ? (req.body = inputPostValidation) : (req.headers = inputPostValidation);
      next();
    } catch (error) {
      logger.error(`didn't validate, error: ${error}`);

      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  userBodySchema: object().shape({
    username: string().required()
  }),
  exerciseBodySchema: object().shape({
    duration: number().required().positive().integer(),
    description: string().required(),
    date: date().default(() => new Date())
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
