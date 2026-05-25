import { Injectable } from '@nestjs/common';
import { PaymentStatus, StockBatchStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayReport(userId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const sales = await this.prisma.sale.findMany({
      where: {
        stockBatch: { userId },
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
            costPerBag: true,
            sellingPricePerBag: true,
          },
        },
      },
    });

    const totalBagsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    const expectedRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.amountExpected),
      0,
    );

    const actualRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.amountPaid),
      0,
    );

    const moneyOwed = expectedRevenue - actualRevenue;

    const costOfSoldBags = sales.reduce((sum, sale) => {
      return sum + sale.quantity * Number(sale.stockBatch.costPerBag);
    }, 0);

    const expectedProfit = expectedRevenue - costOfSoldBags;
    const actualProfit = actualRevenue - costOfSoldBags;

    return {
      date: new Date(),
      totalSalesCount: sales.length,
      totalBagsSold,
      expectedRevenue,
      actualRevenue,
      moneyOwed,
      expectedProfit,
      actualProfit,
      sales,
    };
  }

  async getActiveBatchReport(userId: string) {
    const activeBatch = await this.prisma.stockBatch.findFirst({
      where: {
        userId,
        status: StockBatchStatus.ACTIVE,
      },
      include: {
        sales: {
          include: {
            debtPayments: true,
          },
          orderBy: {
            soldAt: 'desc',
          },
        },
      },
    });

    if (!activeBatch) {
      return null;
    }

    return this.buildBatchReport(activeBatch);
  }

  async getBatchReport(userId: string, batchId: string) {
    const batch = await this.prisma.stockBatch.findFirst({
      where: {
        id: batchId,
        userId,
      },
      include: {
        sales: {
          include: {
            debtPayments: true,
          },
          orderBy: {
            soldAt: 'desc',
          },
        },
      },
    });

    if (!batch) {
      return null;
    }

    return this.buildBatchReport(batch);
  }

  async getSummaryReport(userId: string) {
    const batches = await this.prisma.stockBatch.findMany({
      where: { userId },
      include: {
        sales: true,
      },
      orderBy: {
        suppliedAt: 'desc',
      },
    });

    const totalBatches = batches.length;

    const totalBagsBought = batches.reduce(
      (sum, batch) => sum + batch.quantityBought,
      0,
    );

    const totalBagsSold = batches.reduce(
      (sum, batch) => sum + batch.quantitySold,
      0,
    );

    const totalCost = batches.reduce(
      (sum, batch) => sum + Number(batch.totalCost),
      0,
    );

    const expectedRevenue = batches.reduce(
      (sum, batch) => sum + Number(batch.expectedRevenue),
      0,
    );

    const actualRevenue = batches.reduce(
      (sum, batch) => sum + Number(batch.actualRevenue),
      0,
    );

    const moneyOwed = batches.reduce(
      (sum, batch) => sum + Number(batch.moneyOwed),
      0,
    );

    const moneyMissing = batches.reduce(
      (sum, batch) => sum + Number(batch.moneyMissing),
      0,
    );

    const expectedProfit = batches.reduce(
      (sum, batch) => sum + Number(batch.expectedProfit),
      0,
    );

    const actualProfit = actualRevenue - totalCost;

    const activeBatch = batches.find(
      (batch) => batch.status === StockBatchStatus.ACTIVE,
    );

    return {
      totalBatches,
      totalBagsBought,
      totalBagsSold,
      totalCost,
      expectedRevenue,
      actualRevenue,
      moneyOwed,
      moneyMissing,
      expectedProfit,
      actualProfit,
      activeBatch: activeBatch
        ? {
            id: activeBatch.id,
            batchNumber: activeBatch.batchNumber,
            quantityBought: activeBatch.quantityBought,
            quantitySold: activeBatch.quantitySold,
            quantityRemaining: activeBatch.quantityRemaining,
            suppliedAt: activeBatch.suppliedAt,
          }
        : null,
    };
  }

  async getOutstandingDebtsReport(userId: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        stockBatch: { userId },
        paymentStatus: {
          in: [PaymentStatus.OWING, PaymentStatus.PARTIAL],
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

    return sales.map((sale) => ({
      saleId: sale.id,
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

  private buildBatchReport(batch: any) {
    const totalSalesCount = batch.sales.length;

    const totalBagsSold = batch.sales.reduce(
      (sum: number, sale: any) => sum + sale.quantity,
      0,
    );

    const expectedRevenue = batch.sales.reduce(
      (sum: number, sale: any) => sum + Number(sale.amountExpected),
      0,
    );

    const actualRevenue = batch.sales.reduce(
      (sum: number, sale: any) => sum + Number(sale.amountPaid),
      0,
    );

    const moneyOwed = expectedRevenue - actualRevenue;
    const totalCost = Number(batch.totalCost);
    const costOfSoldBags = totalBagsSold * Number(batch.costPerBag);

    return {
      id: batch.id,
      batchNumber: batch.batchNumber,
      status: batch.status,

      suppliedAt: batch.suppliedAt,
      completedAt: batch.completedAt,

      quantityBought: batch.quantityBought,
      quantitySold: batch.quantitySold,
      quantityRemaining: batch.quantityRemaining,

      costPerBag: batch.costPerBag,
      sellingPricePerBag: batch.sellingPricePerBag,

      totalCost,
      expectedRevenue: Number(batch.expectedRevenue),
      expectedProfit: Number(batch.expectedProfit),

      actualRevenue,
      moneyOwed,
      moneyMissing: Number(batch.moneyMissing),

      totalSalesCount,
      totalBagsSold,
      costOfSoldBags,
      expectedProfitSoFar: expectedRevenue - costOfSoldBags,
      actualProfitSoFar: actualRevenue - costOfSoldBags,

      sales: batch.sales,
    };
  }
}
