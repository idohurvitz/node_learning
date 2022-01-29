import { Express, Request, Response } from 'express';
import logger from './utils/logger';
import validateRequest from './middleware/validateRequest';
import config from 'config';
import userController from './controllers/user.controller';
import { ValidateYup } from './middleware/validateYupRequest';
import Schemas from './utils/validateSchemas';
import exerciseController from './controllers/exercise.controller';
import urlController from './controllers/url.controller';
import multer from 'multer';
const upload = multer({ dest: './public/data/uploads/' });

// i should  import the config file onload instead of handling every request ( for better practice)

function routes(app: Express) {
  app.post('/api/fileanalyse', upload.single('upfile'), (req: Request, res: Response) => {
    const fileMetaData: any = req.file;
    logger.info(`getting file from user, file metadata: ${JSON.stringify(fileMetaData)}`);
    if (!fileMetaData) res.json({ error: 'no file was uploading' });

    logger.info(
      JSON.stringify({
        name: fileMetaData.originalname,
        type: fileMetaData.mimetype,
        size: fileMetaData.Datasize
      })
    );
    return res.json({
      name: fileMetaData.originalname,
      type: fileMetaData.mimetype,
      size: fileMetaData.size
    });
  });

  app.get('/api/whoami', (req: Request, res: Response) => {
    logger.info(`route /api/whoami | got new request, headers are: ${req.hostname}`);
    res.json({
      software: req.headers['user-agent'],
      language: req.headers['accept-language'],
      ipaddress: req.ip
    });
  });

  app.post('/api/shorturl/', ValidateYup(Schemas.urlBodySchema, 'body'), urlController.createUrl);
  app.get('/api/shorturl/:shortUrl', urlController.getUrl);

  app.get('/api/users', userController.getAllUsers);
  app.post('/api/users', ValidateYup(Schemas.userBodySchema, 'body'), userController.createUser);

  app.post(
    '/api/users/:_id/exercises',
    ValidateYup(Schemas.exerciseBodySchema, 'body'),
    userController.getUser,
    exerciseController.createExercise
  );
  app.get(
    '/api/users/:_id/logs',
    ValidateYup(Schemas.exerciseParamsSchema, 'headers'),
    userController.getUser,
    exerciseController.GetExerciseByUserId
  );
  app.get('/api/:date?', validateRequest, (req: Request, res: Response) => {
    // here I assume the input if one of the three formats - unix timestamp / string date / empty
    logger.info('route /api/:date | got new request, params are: ' + JSON.stringify(req.params));
    const userInputType: string = req.CurrentUserInputType;
    logger.info('route /api/:date | user input type is: ' + userInputType);
    const userInput: { [index: string]: any } = req.params;
    logger.info(`user request is: ${JSON.stringify(userInput)}`);

    if (userInputType === config.get<string>('unixtimeStampInputType')) {
      const dateObject: Date = new Date(parseInt(userInput['date']));
      const responseBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString()
      };
      logger.info(`returning request to client. request body: ${JSON.stringify(responseBody)}`);
      res.json(responseBody);
    } else if (userInputType === config.get<string>('dateStringInputType')) {
      const dateObject: Date = new Date(userInput['date']);
      const responseBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString()
      };
      logger.info(`returning request to client. request body: ${JSON.stringify(responseBody)}`);
      res.json(responseBody);
    } else if (userInputType === config.get<string>('emptyInputType')) {
      const dateObject: Date = new Date();
      const responseBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString()
      };
      logger.info(`returning request to client. request body: ${JSON.stringify(responseBody)}`);
      res.json(responseBody);
    } else {
      if (!isNaN(Date.parse(userInput['date']))) {
        const dateObject: Date = new Date(userInput['date']);
        const resposneBody: object = {
          unix: dateObject.getTime(),
          utc: dateObject.toUTCString()
        };
        logger.info(`returning request to client. request body: ${JSON.stringify(resposneBody)}`);
        res.json(resposneBody);
      } else {
        logger.info(`invalid Date, sending error | user input was: ${JSON.stringify(req.params)}`);
        res.json({ error: config.get<string>('invalidDateError') });
      }
    }
  });
}
export default routes;
