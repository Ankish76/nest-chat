require('dotenv').config();

import session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/server';

const {
  session: { secret },
} = serverConfig;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
