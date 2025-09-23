import { PrismaClient } from '@prisma/client';

export class UserService {
  private readonly bd: PrismaClient;

  constructor() {
    this.bd = new PrismaClient();
  }

  getUserResources = async (userId: string) => {
    try {
      return await this.bd.user.findFirst({
        where: { id: userId },
        select: {
          folders: true,
          notes: true,
          shareFolders: {
            include: {
              folder: {
                include: {
                  shareFolders: {
                    omit: {
                      userId: true,
                      folderId: true,
                      id: true,
                      permission: true,
                    },
                    include: {
                      user: {
                        select: {
                          id: true,
                          userName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          shareNotes: {
            include: {
              note: {
                include: {
                  shareNotes: {
                    omit: {
                      userId: true,
                      noteId: true,
                      id: true,
                      permission: true,
                    },
                    include: {
                      user: {
                        select: {
                          id: true,
                          userName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (_) {
      throw new Error('Error queuing user resources');
    }
  };
}
