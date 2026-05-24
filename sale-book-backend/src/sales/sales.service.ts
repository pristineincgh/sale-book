import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PaymentStatus, StockBatchStatus } from 'src/generated/prisma/enums';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createSaleDto: CreateSaleDto) {
    const activeBatch = await this.prisma.stockBatch.findFirst({
      where: {
        userId,
        status: StockBatchStatus.ACTIVE,
      },
    });

    if (!activeBatch) {
      throw new NotFoundException('No active stock batch found');
    }

    if (createSaleDto.quantity > activeBatch.quantityRemaining) {
      throw new BadRequestException('Not enough stock remaining in this batch');
    }

    const sellingPricePerBag = Number(activeBatch.sellingPricePerBag);
    const amountExpected = createSaleDto.quantity * sellingPricePerBag;
    const amountPaid = createSaleDto.amountPaid;

    if (amountPaid > amountExpected) {
      throw new BadRequestException(
        'Amount paid cannot be more than expected amount',
      );
    }

    const amountOwed = amountExpected - amountPaid;

    const paymentStatus =
      amountPaid === amountExpected
        ? PaymentStatus.PAID
        : amountPaid > 0
          ? PaymentStatus.PARTIAL
          : PaymentStatus.OWING;

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          stockBatchId: activeBatch.id,
          quantity: createSaleDto.quantity,
          amountExpected,
          amountPaid,
          paymentStatus,
          customerName: createSaleDto.customerName,
          soldAt: createSaleDto.soldAt
            ? new Date(createSaleDto.soldAt)
            : new Date(),
        },
      });

      await tx.stockBatch.update({
        where: { id: activeBatch.id },
        data: {
          quantitySold: {
            increment: createSaleDto.quantity,
          },
          quantityRemaining: {
            decrement: createSaleDto.quantity,
          },
          actualRevenue: {
            increment: amountPaid,
          },
          moneyOwed: {
            increment: amountOwed,
          },
        },
      });

      return sale;
    });
  }

  async findAll(userId: string) {
    return this.prisma.sale.findMany({
      where: {
        stockBatch: {
          userId,
        },
      },
      include: {
        stockBatch: {
          select: {
            id: true,
            batchNumber: true,
            suppliedAt: true,
          },
        },
        debtPayments: true,
      },
      orderBy: {
        soldAt: 'desc',
      },
    });
  }

  async findToday(userId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.prisma.sale.findMany({
      where: {
        stockBatch: {
          userId,
        },
        soldAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        stockBatch: {
          select: {
            id: true,
            batchNumber: true,
          },
        },
        debtPayments: true,
      },
      orderBy: {
        soldAt: 'desc',
      },
    });
  }

  async findByBatch(userId: string, batchId: string) {
    const batch = await this.prisma.stockBatch.findFirst({
      where: {
        id: batchId,
        userId,
      },
    });

    if (!batch) {
      throw new NotFoundException('Stock batch not found');
    }

    return this.prisma.sale.findMany({
      where: {
        stockBatchId: batchId,
      },
      include: {
        debtPayments: true,
      },
      orderBy: {
        soldAt: 'desc',
      },
    });
  }

  async findOne(userId: string, saleId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: {
        id: saleId,
        stockBatch: {
          userId,
        },
      },
      include: {
        stockBatch: {
          select: {
            id: true,
            batchNumber: true,
            suppliedAt: true,
          },
        },
        debtPayments: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }
}
