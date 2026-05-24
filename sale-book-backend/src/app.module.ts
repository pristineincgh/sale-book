import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { configuration, envValidationSchema } from './config/env.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StockBatchesModule } from './stock-batches/stock-batches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    UsersModule,
    AuthModule,
    StockBatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
