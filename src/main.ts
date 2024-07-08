import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger-static/swagger';
import { NextFunction, Request, Response } from 'express';
import { AllExceptionsFilter } from './filters/AllException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://counselor-portal-main.vercel.app',
      'http://localhost:3000',
      'https://css.sanjivanipune.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Origin',
        'https://counselor-portal-main.vercel.app',
      );
      res.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization',
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(204).send();
    }
    next();
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  setupSwagger(app);
  await app.listen(4000);
}
bootstrap();
