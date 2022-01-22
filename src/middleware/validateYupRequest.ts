import { object, string, number, date, AnyObjectSchema } from "yup";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const ValidateYup = (schema: AnyObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.validate(req.body);

      logger.info(
        `validated successfully, validate data:  ${JSON.stringify(data)}`
      );

      next();
    } catch (error) {
      logger.error(`didn't validate, error: ${error}`);

      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  user: object().shape({
    username: string().required(),
  }),
  exercise: object().shape({
    username: string().required(),
    duration: number().required().positive().integer(),
    description: string().required(),
    date: date().default(() => new Date()),
  }),
};

export interface userInputInterface {
  username: string;
}

export interface exerciseInputInterface {
  username: string;
  duration: number;
  description: string;
  date: string;
}
