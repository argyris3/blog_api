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

import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-__v').lean().exec();

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      code: 'Server Error',
      message: 'Internal Server error',
      error: err,
    });
    logger.error('Error while getting current user', err);
  }
};

export default getCurrentUser;
