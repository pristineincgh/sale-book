import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStockBatchDto } from './dto/create-stock-batch.dto';
import { StockBatchStatus } from 'src/generated/prisma/enums';
import { UpdateStockBatchDto } from './dto/update-stock-batch.dto';

@Injectable()
export class StockBatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createStockBatchDto: CreateStockBatchDto) {
    const activeBatch = await this.prisma.stockBatch.findFirst({
      where: {
        userId,
        status: StockBatchStatus.ACTIVE,
      },
    });

    if (activeBatch) {
      throw new BadRequestException(
        'You already have an active stock batch. Complete it before adding a new one.',
      );
    }

    const batchNumber = await this.generateNextBatchNumber(userId);

    const quantityBought = createStockBatchDto.quantityBought;
    const costPerBag = createStockBatchDto.costPerBag;
    const sellingPricePerBag = createStockBatchDto.sellingPricePerBag;

    const totalCost = quantityBought * costPerBag;
    const expectedRevenue = quantityBought * sellingPricePerBag;
    const expectedProfit = expectedRevenue - totalCost;

    return this.prisma.stockBatch.create({
      data: {
        userId,
        batchNumber,

        quantityBought,
        quantitySold: 0,
        quantityRemaining: quantityBought,

        costPerBag,
        sellingPricePerBag,

        totalCost,
        expectedRevenue,
        expectedProfit,

        actualRevenue: 0,
        moneyMissing: 0,
        moneyOwed: 0,

        suppliedAt: createStockBatchDto.suppliedAt
          ? new Date(createStockBatchDto.suppliedAt)
          : new Date(),

        status: StockBatchStatus.ACTIVE,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.stockBatch.findMany({
      where: { userId },
      orderBy: {
        suppliedAt: 'desc',
      },
      include: {
        sales: true,
      },
    });
  }

  async findActive(userId: string) {
    const activeBatch = await this.prisma.stockBatch.findFirst({
      where: {
        userId,
        status: StockBatchStatus.ACTIVE,
      },
      include: {
        sales: {
          orderBy: {
            soldAt: 'desc',
          },
        },
      },
    });

    if (!activeBatch) {
      throw new NotFoundException('No active stock batch found');
    }

    return activeBatch;
  }

  async findOne(userId: string, id: string) {
    const batch = await this.prisma.stockBatch.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        sales: {
          orderBy: {
            soldAt: 'desc',
          },
          include: {
            debtPayments: true,
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException('Stock batch not found');
    }

    return batch;
  }

  async update(
    userId: string,
    id: string,
    updateStockBatchDto: UpdateStockBatchDto,
  ) {
    const batch = await this.findOne(userId, id);

    if (batch.quantitySold > 0) {
      throw new BadRequestException(
        'Cannot edit batch pricing or quantity after sales have been recorded.',
      );
    }

    const quantityBought =
      updateStockBatchDto.quantityBought ?? batch.quantityBought;

    const costPerBag =
      updateStockBatchDto.costPerBag !== undefined
        ? updateStockBatchDto.costPerBag
        : Number(batch.costPerBag);

    const sellingPricePerBag =
      updateStockBatchDto.sellingPricePerBag !== undefined
        ? updateStockBatchDto.sellingPricePerBag
        : Number(batch.sellingPricePerBag);

    const totalCost = quantityBought * costPerBag;
    const expectedRevenue = quantityBought * sellingPricePerBag;
    const expectedProfit = expectedRevenue - totalCost;

    return this.prisma.stockBatch.update({
      where: { id },
      data: {
        quantityBought,
        quantityRemaining: quantityBought,

        costPerBag,
        sellingPricePerBag,

        totalCost,
        expectedRevenue,
        expectedProfit,

        suppliedAt: updateStockBatchDto.suppliedAt
          ? new Date(updateStockBatchDto.suppliedAt)
          : batch.suppliedAt,

        status: updateStockBatchDto.status ?? batch.status,
      },
    });
  }

  async complete(userId: string, id: string) {
    const batch = await this.findOne(userId, id);

    if (batch.status !== StockBatchStatus.ACTIVE) {
      throw new BadRequestException('Only an active batch can be completed');
    }

    if (batch.quantityRemaining > 0) {
      throw new BadRequestException(
        'This batch still has stock remaining. You cannot complete it yet.',
      );
    }

    const moneyMissing =
      Number(batch.expectedRevenue) - Number(batch.actualRevenue);

    const status =
      moneyMissing > 0
        ? StockBatchStatus.MONEY_MISSING
        : StockBatchStatus.COMPLETED;

    return this.prisma.stockBatch.update({
      where: { id },
      data: {
        status,
        moneyMissing: moneyMissing > 0 ? moneyMissing : 0,
        completedAt: new Date(),
      },
    });
  }

  async remove(userId: string, id: string) {
    const batch = await this.findOne(userId, id);

    if (batch.quantitySold > 0) {
      throw new BadRequestException(
        'Cannot delete a batch that already has sales recorded.',
      );
    }

    await this.prisma.stockBatch.delete({
      where: { id },
    });

    return {
      message: 'Stock batch deleted successfully',
    };
  }

  private async generateNextBatchNumber(userId: string) {
    const lastBatch = await this.prisma.stockBatch.findFirst({
      where: { userId },
      orderBy: {
        batchNumber: 'desc',
      },
      select: {
        batchNumber: true,
      },
    });

    return lastBatch ? lastBatch.batchNumber + 1 : 1;
  }
}
