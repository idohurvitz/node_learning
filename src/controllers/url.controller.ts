import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Url from '../models/url.model';
import logger from '../utils/logger';
import { urlInterface } from '../middleware/validateYupRequest';
const createUrl = async (req: Request, res: Response) => {
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
  try {
    const resultObj = await url.save();
    logger.info(`adding url successfully : ${JSON.stringify(resultObj)}`);
    return res.status(201).json({ original_url: resultObj.url, short_url: resultObj.short_url });
  } catch (error: any) {
    logger.error(`adding url failed, error message: ${error.message}`);
    return res.status(500).json({
      message: error.message,
      error
    });
  }
};

const getUrl = async (req: Request, res: Response) => {
  logger.info(`got new request for handling url, request params: ${JSON.stringify(req.params)}`);
  logger.info(`shorturl type is: ${typeof req.params}`);
  const urlId = parseInt(req.params.shortUrl);
  try {
    const resultObj = await Url.find({ short_url: urlId }).exec();
    logger.info(`redirecting url, url tuple:${resultObj[0]}`);
    res.redirect(resultObj[0].url);
  } catch (error) {
    logger.error(`returning url failed, error message: ${error}`);
    return res.status(500).json({
      message: error,
      error
    });
  }
};
export default { createUrl, getUrl };
