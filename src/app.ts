import express from 'express';
import routes from './routes';
import logger from './utils/logger';
const port = 3001;
const hostname = 'localhost';

const app = express();
// app.use(express.json());

app.listen(port, () => {
    logger.info(`App is running at http://${hostname}:${port}`)

}
)
routes(app);


export default app;