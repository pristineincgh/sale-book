import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus } from 'src/generated/prisma/enums';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DebtPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createDebtPaymentDto: CreateDebtPaymentDto) {
    const sale = await this.prisma.sale.findFirst({
      where: {
        id: createDebtPaymentDto.saleId,
        stockBatch: {
          userId,
        },
      },
      include: {
        stockBatch: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const amountExpected = Number(sale.amountExpected);
    const currentAmountPaid = Number(sale.amountPaid);
    const outstandingAmount = amountExpected - currentAmountPaid;

    if (outstandingAmount <= 0) {
      throw new BadRequestException('This sale has already been fully paid');
    }

    if (createDebtPaymentDto.amount > outstandingAmount) {
      throw new BadRequestException(
        `Payment cannot be more than outstanding amount of GHS ${outstandingAmount}`,
      );
    }

    const newAmountPaid = currentAmountPaid + createDebtPaymentDto.amount;

    const newPaymentStatus =
      newAmountPaid === amountExpected
        ? PaymentStatus.PAID
        : PaymentStatus.PARTIAL;

    return this.prisma.$transaction(async (tx) => {
      const debtPayment = await tx.debtPayment.create({
        data: {
          saleId: sale.id,
          amount: createDebtPaymentDto.amount,
          paidAt: createDebtPaymentDto.paidAt
            ? new Date(createDebtPaymentDto.paidAt)
            : new Date(),
        },
      });

      await tx.sale.update({
        where: { id: sale.id },
        data: {
          amountPaid: newAmountPaid,
          paymentStatus: newPaymentStatus,
        },
      });

      await tx.stockBatch.update({
        where: { id: sale.stockBatchId },
        data: {
          actualRevenue: {
            increment: createDebtPaymentDto.amount,
          },
          moneyOwed: {
            decrement: createDebtPaymentDto.amount,
          },
        },
      });

      return debtPayment;
    });
  }

  async findAll(userId: string) {
    return this.prisma.debtPayment.findMany({
      where: {
        sale: {
          stockBatch: {
            userId,
          },
        },
      },
      include: {
        sale: {
          include: {
            stockBatch: {
              select: {
                id: true,
                batchNumber: true,
                suppliedAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        paidAt: 'desc',
      },
    });
  }

  async findOutstanding(userId: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        stockBatch: {
          userId,
        },
        paymentStatus: {
          in: [PaymentStatus.OWING, PaymentStatus.PARTIAL],
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
        debtPayments: {
          orderBy: {
            paidAt: 'desc',
          },
        },
      },
      orderBy: {
        soldAt: 'desc',
      },
    });

    return sales.map((sale) => ({
      id: sale.id,
      customerName: sale.customerName,
      quantity: sale.quantity,
      amountExpected: sale.amountExpected,
      amountPaid: sale.amountPaid,
      amountOutstanding: Number(sale.amountExpected) - Number(sale.amountPaid),
      paymentStatus: sale.paymentStatus,
      soldAt: sale.soldAt,
      stockBatch: sale.stockBatch,
      debtPayments: sale.debtPayments,
    }));
  }

  async findBySale(userId: string, saleId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: {
        id: saleId,
        stockBatch: {
          userId,
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.prisma.debtPayment.findMany({
      where: {
        saleId,
      },
      orderBy: {
        paidAt: 'desc',
      },
    });
  }
}
