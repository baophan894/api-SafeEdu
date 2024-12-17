import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from '@configs/api-docs.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationError } from 'class-validator';
import { ERRORS_DICTIONARY } from './constraints/error-dictionary.constraint';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configSwagger(app);
  const config_service = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, './served'));

  // Use global validation pipe with custom error handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorDetails = errors.map((error) => {
          // Loop through each error and get the constraint message or custom message
          return Object.values(error.constraints || {}).map(
            (message) => `${error.property}: ${message}`,
          );
        }).flat();

        // Check if there are any validation errors, and return a detailed BadRequestException
        return new BadRequestException({
          message: ERRORS_DICTIONARY.VALIDATION_ERROR,
          details: errorDetails,
        });
      },
    }),
  );

  const port = process.env.PORT || config_service.get('PORT') || 4000;

  await app.listen(port, () =>
    logger.log(`🚀 Server running on: http://localhost:${port}/api-docs`),
  );
}

bootstrap();
