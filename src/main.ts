/* eslint-disable @typescript-eslint/no-var-requires */
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/server';

const {
  session: { secret },
} = serverConfig;

async function bootstrap() {
  require('dotenv').config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // [TODO] make it strict to frontend and based on env
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
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
