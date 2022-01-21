import express from 'express';
import routes from './routes';
import logger from './utils/logger';
import config from "config";

const port = config.get<number>('port');

const app = express();
// app.use(express.json());

app.listen(port, () => {
    logger.info(`App is running at http://hostname:${port}`)

}
)
routes(app);


export default app;