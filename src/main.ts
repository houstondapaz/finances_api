import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { MorganMiddleware } from './shared/middlware/morgan.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded } from 'express';

export const EXPOSE_HEADERS = [
  'DNT',
  'X-CustomHeader',
  'Keep-Alive',
  'User-Agent',
  'X-Requested-With',
  'If-Modified-Since',
  'Cache-Control',
  'Content-Type',
  'Authorization',
  'X-Total',
  'X-Pages',
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.enableCors({
    exposedHeaders: EXPOSE_HEADERS.concat(
      EXPOSE_HEADERS.map((headerName) => headerName.toLowerCase()),
    ).join(','),
  });
  app.use(urlencoded({ extended: true }));
  app.use(MorganMiddleware());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
