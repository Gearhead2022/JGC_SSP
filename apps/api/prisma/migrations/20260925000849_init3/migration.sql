/*
  Warnings:

  - You are about to drop the column `monthly_charge` on the `supplementary_collections` table. All the data in the column will be lost.
  - Added the required column `charge_amount` to the `supplementary_collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "supplementary_collections" DROP COLUMN "monthly_charge",
ADD COLUMN     "charge_amount" DECIMAL(12,2) NOT NULL;
