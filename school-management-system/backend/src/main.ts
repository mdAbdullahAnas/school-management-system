import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription('School Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Swagger Document
  const document = SwaggerModule.createDocument(app, config);

  // Swagger Route
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors();

  // Start Server
  await app.listen(process.env.PORT ?? 3001);

  console.log(`Application running on: http://localhost:3001`);
  console.log(`Swagger running on: http://localhost:3001/api`);
}

bootstrap();