import { NextFunction, Response } from 'express';
import { createError } from '../errors/ErrorFactory';
import { StoryService } from '../services/StoryService';
import { AuthRequest } from '../types/AuthTypes';
import { UserRole } from '../entities/User';
import { logger } from '../config/Logger';

const storyService = new StoryService();

export const modifyUserAccessHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  const currentUser = req.user!;
  const targetUserId = req.params.id;
  const isDelete = req.method === 'DELETE';
  const isOwner = currentUser.userId === targetUserId;

  // Delete check
  if (isDelete && !(currentUser.role === UserRole.ADMIN || isOwner)) {
    throw createError('Forbidden', 'You do not have permission to delete this user');
  }

  // Update check
  if (!isDelete) {
    const keys = Object.keys(req.body);

    // Prevent owners from updating role
    if (isOwner && keys.includes('role')) {
      throw createError('Forbidden', 'You cannot change your own role');
    }

    if (!isOwner) {
      if (currentUser.role === UserRole.ADMIN) {
        const allowedFields = ['role'];
        const invalidFields = keys.filter((k) => !allowedFields.includes(k));
        if (invalidFields.length > 0) {
          throw createError(
            'Forbidden',
            `Admins can only modify the following fields: ${allowedFields.join(', ')}`,
          );
        }
      } else {
        throw createError('Forbidden', 'You do not have permission to update this user');
      }
    }
  }

  next();
};

export const modifyStoryAccessHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user!;
  const storyId = req.params.id;
  const ownerId = await storyService.getOwnerId(storyId);
  logger.debug(ownerId);
  logger.debug('Now logging current usre');
  logger.debug(currentUser.userId);
  const isOwner = ownerId === currentUser.userId;
  const isDelete = req.method === 'DELETE';

  if (isDelete) {
    // Admins can delete anything, owners can delete their own stories
    if (!(currentUser.role === UserRole.ADMIN || isOwner)) {
      throw createError('Forbidden', 'You cannot delete this story');
    }
  } else {
    // Updates: only owner can modify
    if (!isOwner) {
      throw createError('Forbidden', 'You cannot update this story');
    }
  }

  next();
};
