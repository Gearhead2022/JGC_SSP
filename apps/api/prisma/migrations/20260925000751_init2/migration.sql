/*
  Warnings:

  - You are about to alter the column `rate` on the `supplementary_charges` table. The data in that column could be lost. The data in that column will be cast from `Decimal(8,4)` to `Decimal(8,2)`.
  - You are about to drop the column `charge_amount` on the `supplementary_collections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "supplementary_charges" ALTER COLUMN "rate" SET DATA TYPE DECIMAL(8,2);

-- AlterTable
ALTER TABLE "supplementary_collections" DROP COLUMN "charge_amount";
