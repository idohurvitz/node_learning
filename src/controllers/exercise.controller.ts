import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Exercise from '../models/exercise.model';
import logger from '../utils/logger';
import { exerciseInputInterface } from '../middleware/validateYupRequest';
const createExercise = (req: Request, res: Response, next: NextFunction) => {
  // I added the user object to the request headers
  const excerciseObj: exerciseInputInterface = req.body; // here i can assume the req.body passed the validation and therefore i can predict the type (will be used later)
  logger.info(`got new request for creating exercise, request body: ${JSON.stringify(req.body)}`);

  const user = req.CurrentUserObject;
  if (Object.entries(user).length === 0) {
    logger.error(
      `no user in headers, you probably didn't config the middleware's good, the user object is:${JSON.stringify(
        req.CurrentUserObject
      )}`
    );
    return res.status(500).json({ error: 'error message' });
  }
  logger.info(`getting user from request headers, user object: ${JSON.stringify(req.CurrentUserObject)}`);

  const userId = { userId: user._id };
  const exercise = new Exercise({ ...userId, ...excerciseObj }); // concat more then two objects (bloody ecma6)

  return exercise
    .save()
    .then((result: any) => {
      logger.info(
        `adding exercise successfully : ${JSON.stringify({
          exercise: result
        })} | sending to client: ${JSON.stringify({
          ...user,
          description: result.description,
          duration: result.duration,
          date: result.date.toDateString()
        })}`
      );
      return res.status(201).json({
        ...user,
        description: result.description,
        duration: result.duration,
        date: result.date.toDateString()
      });
    })
    .catch((error: any) => {
      logger.error(`adding exercise failed, error message: ${error.message}`);
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};

export default { createExercise };
