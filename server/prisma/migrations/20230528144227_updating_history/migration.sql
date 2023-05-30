/*
  Warnings:

  - Made the column `companyName` on table `invoiceHISTORY` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "invoiceHISTORY" DROP CONSTRAINT "invoiceHISTORY_companyName_fkey";

-- AlterTable
ALTER TABLE "invoiceHISTORY" ALTER COLUMN "companyName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invoiceHISTORY" ADD CONSTRAINT "invoiceHISTORY_companyName_fkey" FOREIGN KEY ("companyName") REFERENCES "company"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
