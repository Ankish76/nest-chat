import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new ConsoleLogger(PrismaService.name);
  constructor() {
    super({
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
  async onModuleInit() {
    this.logger.log('Try to connect database...');

    await this.$connect();
    this.logger.log('Connected.');
  }
  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore prisma type error
    this.$on('beforeExit', async () => {
      this.logger.log('Wait for application closing...');
      await app.close();
    });
  }
}
