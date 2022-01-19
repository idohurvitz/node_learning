import express from 'express';
import routes from './routes';
import logger from './utils/logger';
const port = 3001;
const hostname = 'localhost';

const app = express()
app.listen(port, () => {
    // logger.info(`App is running at http://${hostname}:${port}`)
    console.log('test')
    logger.info('new test')

}
)
routes(app);


export default app;