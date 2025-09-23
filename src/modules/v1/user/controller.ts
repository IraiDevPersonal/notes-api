import type { Request, Response } from 'express';
import type { UserService } from './service';

export class UserController {
  private readonly service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  getUserResources = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) throw new Error('User ID is required');

      const result = await this.service.getUserResources(userId);

      if (!result) throw new Error('User not found');

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get user resources' });
    }
  };
}
