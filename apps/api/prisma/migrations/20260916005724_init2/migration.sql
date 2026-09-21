-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'CLOSED', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "computation_slips" ADD COLUMN     "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "computation_slips_status_idx" ON "computation_slips"("status");
