import { Request, Response, NextFunction } from 'express';
import validateSchema from '../utils/validateSchema';
import logger from '../utils/logger';
import config from 'config';

function validateRequest(req: Request, res: Response, next: NextFunction) {
  // this function is getting schema and request and enrich the request with the input type
  // for example: if the input was epoch time - will add the CurrentUserInputType to be epoch

  logger.info(`validateRequest middleware | got new request: ${JSON.stringify(req.params)} `);

  const userInput = req.params;
  const userInputKey: string | undefined = Object.keys(userInput)[0];
  let userInputValue: string | undefined = userInput[userInputKey];
  if (typeof userInputValue === 'undefined' && !userInputValue) {
    // the params are empty -> the is no char in the param
    userInputValue = '';
    logger.info(`validateRequest middleware | got request with no params`);
  }
  if (getSchema(userInputKey) !== null) {
    const currentSchema: object = getSchema(userInputKey);
    for (const [key, value] of Object.entries(currentSchema)) {
      const regex = new RegExp(value);
      logger.info(`validateRequest middleware | validation | user input: ${userInputValue} | regex: ${regex}`);

      if (regex.test(userInputValue)) {
        logger.info(`validateRequest middleware | passed validation | user input type: ${key} `);
        req.CurrentUserInputType = key;
        logger.info(`validateRequest middleware | adding type to request params | user input type: ${req.CurrentUserInputType} `);
        next();
        return;
      }
    }
    logger.info(`validateRequest middleware | didn't passed validation | user input was: ${userInputValue} `);
    req.CurrentUserInputType = config.get<string>('unknownCurrentUserInputType');
    logger.info(`validateRequest middleware | adding type to request params | user input type: ${req.CurrentUserInputType} `);
    next();
    return;
  } else {
    logger.error('problem with validating schema');
  }

  // adding the type to the request
}

function getSchema(requestType: string) {
  // currently assuming there is only one param each time
  const requestType = requestType;
  if (validateSchema?.requestType) {
    return validateSchema.requestType;
  } else return null;
}

export default validateRequest;
