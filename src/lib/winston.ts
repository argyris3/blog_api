import winston from 'winston';

import config from '@/config';
import { format } from '../../node_modules/logform/index.d';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

// if the application is not running in production,add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}]:${message}${metaStr}`;
        })
      ),
    })
  );
}

//create a logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()), //use json for logging messages
  transports,
  silent: config.NODE_ENV === 'test', //disable logging
});

export { logger };
