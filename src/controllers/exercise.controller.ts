import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Exercise from '../models/exercise.model';
import logger from '../utils/logger';
import { exerciseInputInterface } from '../middleware/validateYupRequest';
const createExercise = (req: Request, res: Response, next: NextFunction) => {
  // I added the user object to the request headers
  // I tried to using mongo middleware to return the Date object as a string instead of wrapping it, will explain to you personally :)
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
    .save() // TODO switch to use await instead of .function
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

const GetExerciseByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = req.CurrentUserObject;
  if (Object.entries(currentUser).length === 0) {
    logger.error(
      `get exercise by user id request | no user in headers, you probably didn't config the middleware's good, the user object is:${JSON.stringify(
        req.CurrentUserObject
      )}`
    );
    return res.status(500).json({ error: 'error message' });
  }
  logger.info(
    `get exercise by user id request | getting user from request headers, user object: ${JSON.stringify(req.CurrentUserObject)}`
  );
  // handle user request params , i assume the validation happened in the middleware before
  const userQuery: any = req.query;
  logger.info(`handle query, query params: ${JSON.stringify(userQuery)}`);
  let datesQuery: object | undefined;
  if (userQuery.hasOwnProperty('from')) {
    datesQuery = { $gte: userQuery.from };
  }
  if (userQuery.hasOwnProperty('to')) {
    datesQuery = { ...datesQuery, $lte: userQuery.to };
  }

  const queryExercisesByUserId =
    typeof datesQuery !== 'undefined' ? { userId: currentUser._id, date: datesQuery } : { userId: currentUser._id };

  logger.info(`after checking the userQuery from request | raw request ${JSON.stringify(queryExercisesByUserId)}`);
  try {
    const exercises = userQuery.hasOwnProperty('limit')
      ? await Exercise.find(queryExercisesByUserId).limit(userQuery.limit).exec()
      : await Exercise.find(queryExercisesByUserId).exec();

    logger.info(`returning exercises of user :${currentUser._id}, amount of exercises: ${exercises.length}`);
    return res.status(200).json({ ...currentUser, log: exercises, count: exercises.length });
  } catch (error: any) {
    logger.error(`adding exercise failed, error message: ${error.message}`);
    return res.status(500).json({
      message: error.message,
      error
    });
  }
};

export default { createExercise, GetExerciseByUserId };
