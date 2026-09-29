-- CreateTable
CREATE TABLE "supplementary_collection_allocations" (
    "id" UUID NOT NULL,
    "supplementary_collection_id" UUID NOT NULL,
    "supplementary_charge_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplementary_collection_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplementary_collection_allocations_supplementary_collecti_idx" ON "supplementary_collection_allocations"("supplementary_collection_id");

-- CreateIndex
CREATE INDEX "supplementary_collection_allocations_supplementary_charge_i_idx" ON "supplementary_collection_allocations"("supplementary_charge_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplementary_collection_allocations_supplementary_collecti_key" ON "supplementary_collection_allocations"("supplementary_collection_id", "supplementary_charge_id");

-- AddForeignKey
ALTER TABLE "supplementary_collection_allocations" ADD CONSTRAINT "supplementary_collection_allocations_supplementary_collect_fkey" FOREIGN KEY ("supplementary_collection_id") REFERENCES "supplementary_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplementary_collection_allocations" ADD CONSTRAINT "supplementary_collection_allocations_supplementary_charge__fkey" FOREIGN KEY ("supplementary_charge_id") REFERENCES "supplementary_charges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
