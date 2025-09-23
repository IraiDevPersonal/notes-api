import { Router } from 'express';
import { UserController } from './controller';
import { UserService } from './service';

export class UserRoutesV1 {
  private static readonly service = new UserService();
  private static readonly controller = new UserController(this.service);

  static get routes(): Router {
    const router = Router();

    router.get('/resources/:userId', this.controller.getUserResources);

    return router;
  }
}
