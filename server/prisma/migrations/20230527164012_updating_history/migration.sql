/*
  Warnings:

  - Added the required column `invoiceNUMBER` to the `invoiceHISTORY` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoiceHISTORY" ADD COLUMN     "invoiceNUMBER" TEXT NOT NULL;
