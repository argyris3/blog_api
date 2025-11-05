/**
 * node modules
 */

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * custom modules
 */
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * types
 */

import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  //if there is no bearer,respond with 401 unauthorized
  if (!authHeader?.startsWith('Bearer')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied,no token provided',
    });
    return;
  }
  //split out the token from bearer prefix
  const [_, token] = authHeader.split(' ');

  try {
    //verify the token and extract the userId from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    //attach the userId to the request object for later use
    req.userId = jwtPayload.userId;

    //proceed to the next middleware or route handler
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired,request a new one with refresh token',
      });
      return;
    }
    //Handle invalid token error
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }
    //Catch-all for others errors
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error during authentication', err);
  }
};

export default authenticate;
