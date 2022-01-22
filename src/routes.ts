import { Express, Request, Response } from "express";
import logger from "./utils/logger";
import validateRequest from "./middleware/validateRequest";
import config from "config";
import userController from "./controllers/user.controller";

// TODO import the config file onload instead of handling every request ( for better practice)

function routes(app: Express) {
  app.get("/api/whoami", (req: Request, res: Response) => {
    logger.info(
      `route /api/whoami | got new request, headers are: ${req.hostname}`
    );
    res.json({
      software: req.headers["user-agent"],
      language: req.headers["accept-language"],
      ipaddress: req.ip,
    });
  });
  app.get("/api/users", userController.getAllUsers);
  app.post("/api/users", userController.createUser);
  app.get("/api/:date?", validateRequest, (req: Request, res: Response) => {
    // here I assume the input if one of the three formats - unix timestamp / string date / empty
    logger.info(
      "route /api/:date | got new request, params are: " +
        JSON.stringify(req.params)
    );
    const userInputType: string = req.userInputType;
    logger.info("route /api/:date | user input type is: " + userInputType);
    const userInput: { [index: string]: any } = req.params;

    if (userInputType === config.get<string>("unixtimeStampInputType")) {
      let dateObject: Date = new Date(parseInt(userInput["date"]));
      const resposneBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString(),
      };
      logger.info(
        `returning request to client. request body: ${JSON.stringify(
          resposneBody
        )}`
      );
      res.json(resposneBody);
    } else if (userInputType === config.get<string>("dateStringInputType")) {
      let dateObject: Date = new Date(userInput["date"]);
      const resposneBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString(),
      };
      logger.info(
        `returning request to client. request body: ${JSON.stringify(
          resposneBody
        )}`
      );
      res.json(resposneBody);
    } else if (userInputType === config.get<string>("emptyInputType")) {
      let dateObject: Date = new Date();
      const resposneBody: object = {
        unix: dateObject.getTime(),
        utc: dateObject.toUTCString(),
      };
      logger.info(
        `returning request to client. request body: ${JSON.stringify(
          resposneBody
        )}`
      );
      res.json(resposneBody);
    } else {
      logger.info(
        `invalid Date, sending error | user input was: ${JSON.stringify(
          req.params
        )}`
      );
      res.json({ error: config.get<string>("invalidDateError") });
    }
  });
}
export default routes;
