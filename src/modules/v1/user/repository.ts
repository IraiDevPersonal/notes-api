import type { UserResources } from './models/user-resources.model';

export abstract class UserRepository {
  abstract getUserResources(userId: string): Promise<UserResources | null>;
}
