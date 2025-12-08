import { NextFunction, Response } from 'express';
import { ErrorFactory } from '../errors/ErrorFactory';
import { StoryService } from '../services/StoryService';
import { AuthRequest } from '../types/AuthTypes';
import { UserRole } from '../entities/User';
import { logger } from '../config/Logger';
import { injectable } from 'tsyringe';
// import { logger } from '../config/Logger';

@injectable()
export class AuthorizationMiddleware {
  constructor(private storyService: StoryService) {}
  modifyUserAccessHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    const currentUser = req.user!;
    const targetUserId = req.params.id;
    const isDelete = req.method === 'DELETE';
    const isOwner = currentUser.userId === targetUserId;
    logger.debug(`${currentUser.userId} == ${targetUserId}`);
    const isModify = !isDelete;

    // Delete check
    if (isDelete && !(currentUser.role === UserRole.ADMIN || isOwner)) {
      // throw createError('Forbidden', 'You do not have permission to delete this user');
      ErrorFactory.unauthorized('You do not have permission to delete this user');
    }

    // Update check
    if (isModify && !isOwner) {
      throw ErrorFactory.unauthorized('You do not have permission to update this user');
    }

    next();
  };

  modifyStoryAccessHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const currentUser = req.user!;
    const storyId = req.params.id;
    const ownerId = await this.storyService.getOwnerId(storyId);
    // logger.debug(ownerId);
    // logger.debug('Now logging current usre');
    // logger.debug(currentUser.userId);
    const isOwner = ownerId === currentUser.userId;
    const isDelete = req.method === 'DELETE';

    if (isDelete) {
      // Admins can delete anything, owners can delete their own stories
      if (!(currentUser.role === UserRole.ADMIN || isOwner)) {
        // throw createError('Forbidden', 'You cannot delete this story');
        throw ErrorFactory.forbidden('You cannot delete this story');
      }
    } else {
      // Updates: only owner can modify
      if (!isOwner) {
        // throw createError('Forbidden', 'You cannot update this story');
        ErrorFactory.forbidden('You cannot update this story');
      }
    }

    next();
  };

  roleChangeAccessHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    const currentUser = req.user!;

    if (currentUser.role !== UserRole.ADMIN) {
      // throw createError('Forbidden', 'Only admins can change user roles');
      throw ErrorFactory.forbidden('Only admins can change user roles');
    }

    next();
  };
}
