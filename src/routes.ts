import { Express, Request, Response } from 'express';
import logger from './utils/logger';
import validateRequest from './middleware/validateRequest';
import config from 'config';
import userController from './controllers/user.controller';
import { ValidateYup, Schemas } from './middleware/validateYupRequest';
import exerciseController from './controllers/exercise.controller';
import urlController from './controllers/url.controller';
import multer from 'multer';
const upload = multer({ dest: './public/data/uploads/' });

// TODO import the config file onload instead of handling every request ( for better practice)

function routes(app: Express) {
  app.post('/api/fileanalyse', upload.single('upfile'), (req: Request, res: Response) => {
    if (!req.file) res.json({ error: 'no file was uploading' });

    logger.info(
      JSON.stringify({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
      })
    );
    return res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
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

    if (userInputType === config.get<string>('unixtimeStampInputType')) {
      let dateObject: Date = new Date(parseInt(userInput['date']));
      const resposneBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString()
      };
      logger.info(`returning request to client. request body: ${JSON.stringify(resposneBody)}`);
      res.json(resposneBody);
    } else if (userInputType === config.get<string>('dateStringInputType')) {
      let dateObject: Date = new Date(userInput['date']);
      const resposneBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString()
      };
      logger.info(`returning request to client. request body: ${JSON.stringify(resposneBody)}`);
      res.json(resposneBody);
    } else if (userInputType === config.get<string>('emptyInputType')) {
      let dateObject: Date = new Date();
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
  });
}
export default routes;
