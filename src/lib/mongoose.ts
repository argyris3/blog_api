import mongoose from 'mongoose';
import { logger } from './winston';
/**
 * custom modules
 */

import config from '@/config';

/**
 * Types
 */

import type { ConnectOptions } from 'mongoose';

/**
 * Client Option
 */

const clientOptions: ConnectOptions = {
  dbName: 'blog_db',
  appName: 'Blog_Api',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('Mongo URI is not defined in the configuration');
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to the database magka mou!!', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    logger.error('Error sto connect leme!!!', err);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Egine disconnect apo database', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    logger.error('Error sto disconnect ', err);
  }
};
