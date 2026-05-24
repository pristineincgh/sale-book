import { Module } from '@nestjs/common';
import { DebtPaymentsService } from './debt-payments.service';
import { DebtPaymentsController } from './debt-payments.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [DebtPaymentsService, PrismaService],
  controllers: [DebtPaymentsController],
  exports: [DebtPaymentsService],
})
export class DebtPaymentsModule {}
