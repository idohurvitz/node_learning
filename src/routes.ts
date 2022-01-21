
import { Express, Request, Response } from 'express'
import logger from './utils/logger';
import validateRequest from './middleware/validateRequest'


function routes(app: Express) {
    app.get("/api/:date", validateRequest, (req: Request, res: Response) => {
        // here I assume the input if one of the two formats - unix timestamp or string date in this format:
        logger.info('route /api/:date | got new request, headers are: ' + JSON.stringify(req.params));
        const userInputType: string = req.userInputType;
        logger.info('route /api/:date | user input type is: ' + userInputType)
        const userInput = req.params

        if (userInputType == 'unix_timestamp') {
            let dateObject: Date = new Date(parseInt(userInput['date']))
            res.json({
                unix: dateObject.getTime(),
                utc: dateObject.toUTCString()

            })
        }
        else if (userInputType === 'date_string') {
            let dateObject: Date = new Date(userInput['date'])
            res.json({
                unix: dateObject.getTime(),
                utc: dateObject.toUTCString()

            })
        }
        else {
            res.json({ error: 'Invalid Date' })
        }



    })



}
export default routes