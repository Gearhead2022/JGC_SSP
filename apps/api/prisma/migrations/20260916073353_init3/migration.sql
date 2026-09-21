-- AlterEnum
ALTER TYPE "LoanStatus" ADD VALUE 'RENEWED';

-- AlterTable
ALTER TABLE "computation_slips" ADD COLUMN     "close_at" TIMESTAMP(3),
ADD COLUMN     "closing_balance" DECIMAL(12,2);
