-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'CLOSED', 'RENEWED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('PENDING', 'POSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupplementaryChargeStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(191),
    "password" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "pensioners" (
    "id" UUID NOT NULL,
    "pensioner_id" INTEGER NOT NULL,
    "last_name" VARCHAR(30) NOT NULL,
    "first_name" VARCHAR(40) NOT NULL,
    "middle_name" VARCHAR(40),
    "birth_date" DATE NOT NULL,
    "actual_pension" DECIMAL(12,2) NOT NULL,
    "contingency_date" DATE,
    "bank_name" VARCHAR(100),
    "account_number" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pensioners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "computation_slips" (
    "id" UUID NOT NULL,
    "counter_no" INTEGER NOT NULL,
    "ctr_no" VARCHAR(30) NOT NULL,
    "account_no" VARCHAR(50) NOT NULL,
    "branch_name" VARCHAR(100) NOT NULL,
    "pensioner_uuid" UUID NOT NULL,
    "transaction_date" DATE NOT NULL,
    "effectivity_date" DATE NOT NULL,
    "transaction_type" VARCHAR(30) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "installment" DECIMAL(12,2) NOT NULL,
    "terms" INTEGER NOT NULL,
    "supplementary" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "supplementary_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "principal_amount" DECIMAL(12,2) NOT NULL,
    "udi" DECIMAL(12,2) NOT NULL,
    "collection_fee" DECIMAL(12,2) NOT NULL,
    "processing_fee" DECIMAL(12,2) NOT NULL,
    "loan_protection_fee" DECIMAL(12,2) NOT NULL,
    "icod" DECIMAL(12,2) NOT NULL,
    "gross_cash_out" DECIMAL(12,2) NOT NULL,
    "net_cash_out" DECIMAL(12,2) NOT NULL,
    "total_cash_out" DECIMAL(12,2) NOT NULL,
    "renewed_from_id" UUID,
    "closing_balance" DECIMAL(12,2),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "computation_slips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_collections" (
    "id" UUID NOT NULL,
    "computation_slip_id" UUID NOT NULL,
    "collection_date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "beginning_balance" DECIMAL(12,2) NOT NULL,
    "ending_balance" DECIMAL(12,2) NOT NULL,
    "status" "CollectionStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" VARCHAR(255),
    "posted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_counters" (
    "id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "computation_slip_counter" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplementary_collections" (
    "id" UUID NOT NULL,
    "computation_slip_id" UUID NOT NULL,
    "collection_date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "beginning_balance" DECIMAL(12,2) NOT NULL,
    "ending_balance" DECIMAL(12,2) NOT NULL,
    "monthly_charge" DECIMAL(12,2) NOT NULL,
    "available_charge_months" INTEGER NOT NULL,
    "paid_charge_months" INTEGER NOT NULL,
    "remaining_charge_months" INTEGER NOT NULL,
    "charge_amount" DECIMAL(12,2) NOT NULL,
    "charge_paid" DECIMAL(12,2) NOT NULL,
    "principal_paid" DECIMAL(12,2) NOT NULL,
    "remaining_charge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "CollectionStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" VARCHAR(255),
    "posted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplementary_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplementary_charges" (
    "id" UUID NOT NULL,
    "computation_slip_id" UUID NOT NULL,
    "charge_month" DATE NOT NULL,
    "principal_basis" DECIMAL(12,2) NOT NULL,
    "rate" DECIMAL(8,4) NOT NULL,
    "charge_amount" DECIMAL(12,2) NOT NULL,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "SupplementaryChargeStatus" NOT NULL DEFAULT 'UNPAID',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplementary_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pensioners_pensioner_id_key" ON "pensioners"("pensioner_id");

-- CreateIndex
CREATE INDEX "computation_slips_status_idx" ON "computation_slips"("status");

-- CreateIndex
CREATE INDEX "computation_slips_renewed_from_id_idx" ON "computation_slips"("renewed_from_id");

-- CreateIndex
CREATE INDEX "computation_slips_pensioner_uuid_idx" ON "computation_slips"("pensioner_uuid");

-- CreateIndex
CREATE INDEX "computation_slips_transaction_date_idx" ON "computation_slips"("transaction_date");

-- CreateIndex
CREATE INDEX "computation_slips_effectivity_date_idx" ON "computation_slips"("effectivity_date");

-- CreateIndex
CREATE UNIQUE INDEX "computation_slips_branch_name_counter_no_key" ON "computation_slips"("branch_name", "counter_no");

-- CreateIndex
CREATE UNIQUE INDEX "computation_slips_branch_name_ctr_no_key" ON "computation_slips"("branch_name", "ctr_no");

-- CreateIndex
CREATE UNIQUE INDEX "computation_slips_account_no_key" ON "computation_slips"("account_no");

-- CreateIndex
CREATE INDEX "loan_collections_computation_slip_id_idx" ON "loan_collections"("computation_slip_id");

-- CreateIndex
CREATE INDEX "loan_collections_collection_date_idx" ON "loan_collections"("collection_date");

-- CreateIndex
CREATE UNIQUE INDEX "loan_collections_computation_slip_id_collection_date_key" ON "loan_collections"("computation_slip_id", "collection_date");

-- CreateIndex
CREATE UNIQUE INDEX "branch_counters_branch_id_key" ON "branch_counters"("branch_id");

-- CreateIndex
CREATE INDEX "supplementary_collections_computation_slip_id_idx" ON "supplementary_collections"("computation_slip_id");

-- CreateIndex
CREATE INDEX "supplementary_collections_collection_date_idx" ON "supplementary_collections"("collection_date");

-- CreateIndex
CREATE INDEX "supplementary_charges_computation_slip_id_idx" ON "supplementary_charges"("computation_slip_id");

-- CreateIndex
CREATE INDEX "supplementary_charges_charge_month_idx" ON "supplementary_charges"("charge_month");

-- CreateIndex
CREATE UNIQUE INDEX "supplementary_charges_computation_slip_id_charge_month_key" ON "supplementary_charges"("computation_slip_id", "charge_month");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "computation_slips" ADD CONSTRAINT "computation_slips_pensioner_uuid_fkey" FOREIGN KEY ("pensioner_uuid") REFERENCES "pensioners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "computation_slips" ADD CONSTRAINT "computation_slips_renewed_from_id_fkey" FOREIGN KEY ("renewed_from_id") REFERENCES "computation_slips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_collections" ADD CONSTRAINT "loan_collections_computation_slip_id_fkey" FOREIGN KEY ("computation_slip_id") REFERENCES "computation_slips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplementary_collections" ADD CONSTRAINT "supplementary_collections_computation_slip_id_fkey" FOREIGN KEY ("computation_slip_id") REFERENCES "computation_slips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplementary_charges" ADD CONSTRAINT "supplementary_charges_computation_slip_id_fkey" FOREIGN KEY ("computation_slip_id") REFERENCES "computation_slips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
