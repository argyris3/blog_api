/**
 * @copyright
 * @license Apache-2.0
 */
/**
 * Node Modules
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom Modules
 */

import config from '@/config';
import limiter from './lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from './lib/winston';
/**
 * Router
 */
import v1Routes from '@/routes/v1';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */

const app = express();

const contentSecurityPolicy = require('helmet-csp');

//configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      //reject requests from non whitelist origins
      callback(new Error(`CORS error:${origin} is not allowed by Cors`), false);
      logger.warn(`CORS error:${origin} is not allowed by CORS`);
    }
  },
};

//Apply Cors middleware

app.use(cors(corsOptions));

//enable JSON requests body parsing
app.use(express.json());

//enable URL-encoded request body parsing with extented mode
//extented true allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Enable response compression to reduce payload size and improve perfomance
app.use(
  compression({
    threshold: 1024, //only compress response larger than 1KB
  })
);

//Use helmet to enhance security by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

//Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();
    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server akouei sta:http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);
  }
  if (config.NODE_ENV === 'production') {
    process.exit(1);
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server eixame');
    process.exit(0);
  } catch (err) {
    logger.error('Error sto kleisimo tou server', err);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
