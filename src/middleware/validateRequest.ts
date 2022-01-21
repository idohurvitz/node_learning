import { Request, Response, NextFunction } from "express";
import validateSchema from '../utils/validateSchema';
import logger from '../utils/logger';


function validateRequest(req: Request, res: Response, next: NextFunction) {
    // this function is getting schema and request and enrich the request with the input type
    // for example: if the input was epoch time - will add the userInputType to be epoch

    // validate userinputdata
    logger.info(`validateRequset middleware | got new request: ${JSON.stringify(req.params)} `)
    const userInput = req.params;
    let userInputKey: string = Object.keys(userInput)[0]; // for now assming there is only one
    let userInputValue: string = userInput[userInputKey];
    if (getSchema(userInputKey) !== null) {
        let currentSchema: object = getSchema(userInputKey)
        for (const [key, value] of Object.entries(currentSchema)) {
            const regex: RegExp = new RegExp(value)
            logger.info(`validateRequset middleware | validation | user input: ${userInputValue} | regex: ${regex}`);

            if (regex.test(userInputValue)) {
                logger.info(`validateRequset middleware | passed validation | user input type: ${key} `)
                req.userInputType = key
                logger.info(`validateRequset middleware | adding type to request params | user input type: ${req.userInputType} `)
                next()
                return;

            }
        }
        logger.info(`validateRequset middleware | didnt passed validation | user input was: ${userInputValue} `)
        req.userInputType = 'unkwon input type' // TODO add to config
        logger.info(`validateRequset middleware | adding type to request params | user input type: ${req.userInputType} `)
        next()
        return;
    }
    else {
        logger.error('problem with validateing schema')
    }





    // adding the type to the request





}

function getSchema(requestType: string) {
    // currently asumming there is only one param each time

    if (validateSchema[requestType]) { return validateSchema[requestType] }
    else return null


}

export default validateRequest