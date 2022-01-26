import { AnyObjectSchema, ValidationError } from 'yup';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export const ValidateYup = (schema: AnyObjectSchema, type: 'body' | 'headers') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Validator | got new validate request | user request is: ${JSON.stringify({ ...req.query, ...req.body })}`);
    let validatedInput: object | undefined;
    type === 'body' ? (validatedInput = req.body) : (validatedInput = req.query);
    try {
      if (schema.isValidSync(validatedInput, { strict: true })) {
      } else {
        throw new ValidationError("didn't pass validation");
      }
      const inputPostValidation = await schema.validate(validatedInput);
      logger.info(
        `validated successfully | got request:${JSON.stringify(
          validatedInput
        )} | updating Input after validate:  ${JSON.stringify(inputPostValidation)},`
      );
      type === 'body' ? (req.body = inputPostValidation) : '';
      next();
    } catch (error) {
      logger.error(`Validator | didn't validate | user input was: ${JSON.stringify(validatedInput)} | error: ${error} `);

      return res.status(422).json({ error });
    }
  };
};
