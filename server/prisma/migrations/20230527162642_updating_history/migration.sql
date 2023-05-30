/*
  Warnings:

  - Added the required column `receiverPhone` to the `invoiceHISTORY` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoiceHISTORY" ADD COLUMN     "receiverPhone" TEXT NOT NULL;
