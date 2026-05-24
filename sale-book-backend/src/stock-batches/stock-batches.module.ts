import { Module } from '@nestjs/common';
import { StockBatchesService } from './stock-batches.service';
import { StockBatchesController } from './stock-batches.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [StockBatchesService, PrismaService],
  controllers: [StockBatchesController],
})
export class StockBatchesModule {}
