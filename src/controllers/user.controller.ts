import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import logger from "../utils/logger";
import { userInputInterface } from "../middleware/validateYupRequest";
const createUser = (req: Request, res: Response, next: NextFunction) => {
  const usernameObj: userInputInterface = req.body; // here i can assume the req.body passed the validation and therefore i can predict the type (will be used later)
  logger.info(
    `got new request for creating user, request body: ${JSON.stringify(
      req.body
    )}`
  );
  const uniqueId = { _id: new mongoose.Types.ObjectId() };
  const user = new User({ ...uniqueId, ...usernameObj }); // concat more then two objects (bloody ecma6)

  return user
    .save()
    .then((result: object) => {
      return res.status(201).json({
        user: result,
      });
    })
    .catch((error: any) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .exec()
    .then((users: Array<object>) => {
      return res.status(200).json({
        users: users,
        count: users.length,
      });
    })
    .catch((error: any) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default { createUser, getAllUsers };
