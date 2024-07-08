import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';
import { Request } from 'express';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Counselor Portal Apis')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Swagger For Counselor Portal Apis',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
    customfavIcon:
      'https://d4.alternativeto.net/qPJxLR6y7ew2Y88cUjcBt-wVI0Oa_EHvpHsMZkD-GJU/rs:fit:280:280:0/g:ce:0:0/exar:1/YWJzOi8vZGlzdC9pY29ucy9zd2FnZ2VyLWlvXzY1NDY5LnBuZw.png',
    swaggerOptions: {
      requestInterceptor: (req: Request) => {
        const token = localStorage.getItem('jwt'); // Assume JWT is stored in localStorage
        if (token) {
          req.headers['Authorization'] =
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdkNzBiMDMyLWU3ODgtNGM5OC04MDZlLTJhMTI5ZGZhM2E4NCIsInJvbGUiOiJjb3Vuc2Vsb3IiLCJlbWFpbCI6InJhc2Ftcml0YWdhdXIucm5zQGdtYWlsLmNvbSIsImlhdCI6MTcxNzAyMjc1MiwiZXhwIjoxNzE4MzE4NzUyfQ.XLedMWb2_6I4St-pCWdDAws7xYKwNKz0KeaywzuPPcc`;
        }
        return req;
      },
    } as SwaggerUiOptions,
  });
}
