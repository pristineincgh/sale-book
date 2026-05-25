/*
  Warnings:

  - Made the column `customerName` on table `sales` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "customerName" SET NOT NULL;
