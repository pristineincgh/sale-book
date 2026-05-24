import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    methods: configService.get<string>('cors.methods'),
    allowedHeaders: configService.get<string>('cors.allowedHeaders'),
  });

  const port = configService.get<number>('port') ?? 8000;

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
