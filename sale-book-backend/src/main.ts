import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    methods: configService.get<string>('cors.methods'),
    allowedHeaders: configService.get<string>('cors.allowedHeaders'),
  });

  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('port') ?? 8000;

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
