import express from "express";
import routes from "./routes";
import logger from "./utils/logger";
import config from "config";
import mongoConnector from "./utils/mongoConnector";
const port = config.get<number>("port");

const app = express();
app.use(express.json());

app.listen(port, async () => {
  logger.info(`App is running at http://hostname:${port}`);
  await mongoConnector();
  routes(app);
});

export default app;
