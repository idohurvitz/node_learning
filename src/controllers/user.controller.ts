import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import logger from '../utils/logger';
import userInterface from '../interfaces/user.interface';
const createUser = (req: Request, res: Response, next: NextFunction) => {
  const usernameObj: userInterface = req.body;
  // here i can assume the req.body passed the validation and therefore i can predict the type (will be used later)
  logger.info(`got new request for creating user, request body: ${JSON.stringify(req.body)}`);
  const uniqueId = { _id: new mongoose.Types.ObjectId() };
  const user = new User({ ...uniqueId, ...usernameObj }); // concat more then two objects (bloody ecma6)

  return user
    .save()
    .then((resultObj: any) => {
      logger.info(`adding user successfully : ${JSON.stringify(resultObj)}`);
      return res.status(201).json(resultObj);
    })
    .catch((error: any) => {
      logger.error(`adding user failed, error message: ${error.message}`);
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}, { __v: 0 })
    .exec()
    .then((users: Array<object>) => {
      logger.info(`returning users array, array length :${users.length}`);
      return res.status(200).send(users);
    })
    .catch((error: any) => {
      logger.error(`returning users failed, error message: ${error.message}`);
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  // getting the user id from the request header - I'm not validating the url for now
  // later will add another middleware to return the actual user object if necessarily
  logger.info(`got new request for quering user, user details from request: ${JSON.stringify(req.params)}`);
  const userId = req.params._id;
  // returning the userObject
  User.findById(userId)
    .exec()
    .then((user: any) => {
      logger.info(`returning user, user params:${JSON.stringify(user)}`);
      !user
        ? () => {
            throw new Error('No user with id:' + req.params._id);
          }
        : '';

      req.CurrentUserObject = { username: user.username, _id: user._id };
      next();
      return;
    })
    .catch((error: any) => {
      logger.error(`returning user failed, error message: ${error.message}`);
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};
export default { createUser, getAllUsers, getUser };
