import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import logger from "../utils/logger";
const createUser = (req: Request, res: Response, next: NextFunction) => {
  let usernameObj = req.body;
  logger.info(
    `got new request for creating user, request body: ${JSON.stringify(
      req.body
    )}`
  );
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: usernameObj["username"], // TODO understand why you cant put object inside of object
  });

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
