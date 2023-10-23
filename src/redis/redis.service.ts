import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

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
export class RedisService extends Redis implements OnModuleInit {
  private readonly logger = new ConsoleLogger(RedisService.name);
  constructor() {
    super({
      port,
      host,
      connectTimeout: defaultTimeout,
      ...options,
    });
  }
  async onModuleInit() {
    this.logger.log('Try to connect redis...');
    this.on('error', (error) => {
      this.logger.log('Redis error.', error);
    });
    this.on('connect', () => {
      this.logger.log(`Redis connected ${host}:${port}`);
    });
    this.on('reconnecting', () => {
      this.logger.log(`Redis reconnecting ${host}:${port}`);
    });
    this.on('end', () => {
      this.logger.log('Redis disconnected');
    });
  }
  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore prisma type error
    this.$on('beforeExit', async () => {
      this.logger.log('Wait for application closing...');
      await app.close();
    });
  }
}
