/**
 * custom modules
 */

import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * models
 */

import Token from '@/models/token';

/**
 * types
 */

import type { Request, Response } from 'express';
import refreshToken from './refresh_token';

const logout = async (req: Request, res: Response): Promise<void> => {
  const logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken as string;

      if (refreshToken) {
        await Token.deleteOne({ token: refreshToken });
        logger.info('User refresh token deleted successfully', {
          userId: req.userId,
          token: refreshToken,
        });
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(204);

      logger.info('User logged out successfully', {
        userId: req.userId,
      });
    } catch (err) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err,
      });
      logger.error('Error during logout', err);
    }
  };
};

export default logout;
