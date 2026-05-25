-- CreateEnum
CREATE TYPE "StockBatchStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'MONEY_MISSING');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PARTIAL', 'OWING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_batches" (
    "id" TEXT NOT NULL,
    "batchNumber" INTEGER NOT NULL,
    "quantityBought" INTEGER NOT NULL,
    "quantitySold" INTEGER NOT NULL DEFAULT 0,
    "quantityRemaining" INTEGER NOT NULL,
    "costPerBag" DECIMAL(10,2) NOT NULL,
    "sellingPricePerBag" DECIMAL(10,2) NOT NULL,
    "totalCost" DECIMAL(10,2) NOT NULL,
    "expectedRevenue" DECIMAL(10,2) NOT NULL,
    "expectedProfit" DECIMAL(10,2) NOT NULL,
    "actualRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "moneyMissing" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "moneyOwed" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "suppliedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "StockBatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amountExpected" DECIMAL(10,2) NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "customerName" TEXT,
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stockBatchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debt_payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "debt_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stock_batches_userId_idx" ON "stock_batches"("userId");

-- CreateIndex
CREATE INDEX "stock_batches_status_idx" ON "stock_batches"("status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_batches_userId_batchNumber_key" ON "stock_batches"("userId", "batchNumber");

-- CreateIndex
CREATE INDEX "sales_stockBatchId_idx" ON "sales"("stockBatchId");

-- CreateIndex
CREATE INDEX "sales_soldAt_idx" ON "sales"("soldAt");

-- CreateIndex
CREATE INDEX "debt_payments_saleId_idx" ON "debt_payments"("saleId");

-- CreateIndex
CREATE INDEX "debt_payments_paidAt_idx" ON "debt_payments"("paidAt");

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_stockBatchId_fkey" FOREIGN KEY ("stockBatchId") REFERENCES "stock_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
