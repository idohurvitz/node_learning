import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import logger from '../utils/logger';
import { userInputInterface } from '../middleware/validateYupRequest';
const createUser = async (req: Request, res: Response) => {
  const usernameObj: userInputInterface = req.body;
  // here i can assume the req.body passed the validation and therefore i can predict the type (will be used later)
  logger.info(`got new request for creating user, request body: ${JSON.stringify(req.body)}`);
  const uniqueId = { _id: new mongoose.Types.ObjectId() };
  const user = new User({ ...uniqueId, ...usernameObj }); // concat more then two objects (bloody ecma6)

  try {
    const userObj = await user.save();
    logger.info(`adding user successfully : ${JSON.stringify(userObj)}`);
    return res.status(201).json(userObj);
  } catch (error) {
    logger.error(`adding user failed, error message: ${error}`);
    return res.status(500).json({
      error
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersObj = await User.find({}, { __v: 0 });
    logger.info(`returning users array, array length :${usersObj.length}`);
    return res.status(200).send(usersObj);
  } catch (error) {
    logger.error(`returning users failed, error message: ${error}`);
    return res.status(500).json({
      error
    });
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  // getting the user id from the request header - I'm not validating the url for now
  // later will add another middleware to return the actual user object if necessarily
  const userId = req.params._id;
  // returning the userObject
  try {
    const userObj = await User.findById(userId).exec();
    logger.info(`returning user, user params:${userObj}`);
    req.CurrentUserObject = { username: userObj?.username, _id: userObj?._id };
    next();
    return;
  } catch (error) {
    logger.error(`returning user failed, error message: ${error}`);
    return res.status(500).json({
      error
    });
  }
};
export default { createUser, getAllUsers, getUser };
