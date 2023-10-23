import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

// this is needed to stop creating a new instance of Prisma everytime the server restarts
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }
  prisma = global.__db;
}

export { prisma };
