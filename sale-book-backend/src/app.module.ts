import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { configuration, envValidationSchema } from './config/env.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StockBatchesModule } from './stock-batches/stock-batches.module';
import { SalesModule } from './sales/sales.module';
import { DebtPaymentsModule } from './debt-payments/debt-payments.module';
import { ReportsModule } from './reports/reports.module';

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
    SalesModule,
    DebtPaymentsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
