/**
 * custom modules
 */

import { logger } from '@/lib/winston';

/**
 * models
 */

import User from '@/models/user';

/**
 * types
 */
import type { Request, Response, NextFunction } from 'express';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();
      if (!user) {
        res.status(404).json({
          code: 'Not Found',
          message: 'User not found',
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied,insufficient permissions',
        });
        return;
      }
      return next();
    } catch (err) {
      res.status(500).json({
        code: 'Server Error',
        message: 'Internal Server error',
        error: err,
      });
      logger.error('Error while authorizing user', err);
    }
  };
};

export default authorize;
