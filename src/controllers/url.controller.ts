import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Url from '../models/url.model';
import logger from '../utils/logger';
import { urlInterface } from '../middleware/validateYupRequest';
const createUrl = async (req: Request, res: Response, next: NextFunction) => {
  const urlObj: urlInterface = req.body;
  // here i can assume the req.body passed the validation and therefore i can predict the type (will be used later)
  logger.info(`got new request for creating url, request body: ${JSON.stringify(req.body)}`);
  try {
    const currentUrlCounter = await Url.find().count();
    urlObj.short_url = currentUrlCounter + 1;
  } catch (error: any) {
    logger.error(`adding url failed,problem with connecting to the db error message: ${error.message}`);
    return res.status(500).json({
      message: error.message,
      error
    });
  }
  const uniqueId = { _id: new mongoose.Types.ObjectId() };
  const url = new Url({ ...uniqueId, ...urlObj }); // concat more then two objects (bloody ecma6)

  return url
    .save()
    .then((resultObj: any) => {
      logger.info(`adding url successfully : ${JSON.stringify(resultObj)}`);
      return res.status(201).json({ original_url: resultObj.url, short_url: resultObj.short_url });
    })
    .catch((error: any) => {
      logger.error(`adding url failed, error message: ${error.message}`);
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};

const getUrl = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`got new request for handling url, requesrt params: ${JSON.stringify(req.params)}`);
  logger.info(`shorturl type is: ${typeof req.params}`);
  const urlId = parseInt(req.params.shortUrl);
  Url.find({ short_url: urlId })
    .exec()
    .then((result: any) => {
      logger.info(`redirecting url, url tuple:${result[0]}`);
      res.redirect(result[0].url);
      next();
      return;
    })
    .catch((error: any) => {
      logger.error(`returning url failed, error message: ${error.message}`);
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};
export default { createUrl, getUrl };
