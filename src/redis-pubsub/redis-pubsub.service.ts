import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { serverConfig } from '../config/server';
const {
  redis: { host, port, pw, defaultTimeout },
} = serverConfig;

const options = pw
  ? {
      password: pw.length ? pw : undefined,
      tls:
        process.env.NODE_ENV !== 'development'
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
      // return_buffers: true,
    }
  : {};

@Injectable()
export class RedisPubsubService extends RedisPubSub implements OnModuleInit {
  private readonly logger = new ConsoleLogger(RedisPubsubService.name);
  constructor() {
    super({
      connection: {
        port,
        host,
        connectTimeout: defaultTimeout,
        ...options,
      },
    });
  }
  async onModuleInit() {
    this.logger.log('Try to connect redis...');
    const redisClient = this.getPublisher();
    if (redisClient) {
      this.logger.log('Connected.');
    }
    this.logger.log('Failed to connect.');
  }
  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore prisma type error
    this.$on('beforeExit', async () => {
      this.logger.log('Wait for application closing...');
      await app.close();
    });
  }
}
