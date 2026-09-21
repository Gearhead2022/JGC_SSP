/*
  Warnings:

  - A unique constraint covering the columns `[computation_slip_id,collection_date]` on the table `loan_collections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('PENDING', 'POSTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "loan_collections" ADD COLUMN     "status" "CollectionStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "loan_collections_computation_slip_id_collection_date_key" ON "loan_collections"("computation_slip_id", "collection_date");
