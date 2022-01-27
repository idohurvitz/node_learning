import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';
async function connect() {
  const dbUri = config.get<string>('dbUri');

  try {
    const connection = await mongoose.connect(dbUri);
    logger.info('DB connected | dburi: ' + dbUri);
  } catch (error: any) {
    logger.error(`Could not connect to db | error: ${error} | error message: ${error.message}`);
    // process.exit(1); // in order to stop the server from dealing with different requests, even if currently working on.
  }
}

export default connect;
