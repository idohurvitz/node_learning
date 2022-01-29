import { Request, Response } from 'express';
import Exercise from '../models/exercise.model';
import logger from '../utils/logger';
const createExercise = async (req: Request, res: Response) => {
  // I added the user object to the request headers
  // I tried to using mongo middleware to return the Date object as a string instead of wrapping it, will explain to you personally :)
  const excerciseObj = req.body; // here i can assume the req.body passed the validation and therefore i can predict the type (will be used later)
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
  try {
    const exerciseObj = await exercise.save();
    logger.info(
      `adding exercise successfully : ${JSON.stringify({
        exercise: exerciseObj
      })} | sending to client: ${JSON.stringify({
        ...user,
        description: exerciseObj.description,
        duration: exerciseObj.duration,
        date: exerciseObj.date.toDateString()
      })}`
    );
    return res.status(201).json({
      ...user,
      description: exerciseObj.description,
      duration: exerciseObj.duration,
      date: exerciseObj.date.toDateString() // it was optional here to use mongo $todateString aggregation, but i think it is not good practice.
    });
  } catch (error) {
    logger.error(`adding exercise failed, error message: ${error}`);
    return res.status(500).json({
      error
    });
  }
};

const GetExerciseByUserId = async (req: Request, res: Response) => {
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
  if (userQuery.from !== undefined) {
    datesQuery = { $gte: `${userQuery.from}` };
  }
  if (userQuery.to !== undefined) {
    datesQuery = { ...datesQuery, $lte: `${userQuery.to}` };
  }

  const queryExercisesByUserId =
    typeof datesQuery !== 'undefined' ? { userId: currentUser._id, date: datesQuery } : { userId: currentUser._id };

  logger.info(`after checking the userQuery from request | raw request ${JSON.stringify(queryExercisesByUserId)}`);
  try {
    const exercises =
      userQuery.limit !== undefined
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - im sure the limit is type number because of validation middleware
          await Exercise.find(queryExercisesByUserId, { __v: 0, _id: 0 }).limit(userQuery.limit).exec()
        : await Exercise.find(queryExercisesByUserId, { __v: 0, _id: 0 }).exec();

    logger.info(`returning exercises of user :${currentUser._id}, amount of exercises: ${exercises.length}`);

    const parsedExercises = exercises.map(({ description, duration, date }) => ({
      description,
      duration,
      date: new Date(date).toDateString()
    }));
    return res.status(200).json({ ...currentUser, log: parsedExercises, count: exercises.length });
  } catch (error: any) {
    logger.error(`adding exercise failed, error message: ${error.message}`);
    return res.status(500).json({
      message: error.message,
      error
    });
  }
};

export default { createExercise, GetExerciseByUserId };
