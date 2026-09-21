/*
  Warnings:

  - You are about to drop the column `close_at` on the `computation_slips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "computation_slips" DROP COLUMN "close_at",
ADD COLUMN     "closed_at" TIMESTAMP(3);
