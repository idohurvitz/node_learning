import express from 'express';
import routes from './routes';
import logger from './utils/logger';
import config from 'config';
import mongoConnector from './utils/mongoConnector';
const cors = require('cors');

const port = config.get<number>('port');
const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded -- freecodecamp tests
app.listen(port, async () => {
  logger.info(`App is running at http://hostname:${port}`);
  await mongoConnector();
  routes(app);
});

export default app;
