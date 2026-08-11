import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Create uploads folder if it doesn't exist
  const uploadPath = join(process.cwd(), 'uploads');

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  // Serve uploaded files
  app.use('/uploads', express.static(uploadPath));

  await app.listen(process.env.PORT ?? 5000);

  console.log(
    `🚀 Server running at http://localhost:${process.env.PORT ?? 5000}`,
  );
}

void bootstrap();