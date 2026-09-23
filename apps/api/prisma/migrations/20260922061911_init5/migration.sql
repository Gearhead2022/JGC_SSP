-- CreateTable
CREATE TABLE "supplementary_collections" (
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

    CONSTRAINT "supplementary_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplementary_collections_computation_slip_id_idx" ON "supplementary_collections"("computation_slip_id");

-- CreateIndex
CREATE INDEX "supplementary_collections_collection_date_idx" ON "supplementary_collections"("collection_date");

-- CreateIndex
CREATE UNIQUE INDEX "supplementary_collections_computation_slip_id_collection_da_key" ON "supplementary_collections"("computation_slip_id", "collection_date");

-- AddForeignKey
ALTER TABLE "supplementary_collections" ADD CONSTRAINT "supplementary_collections_computation_slip_id_fkey" FOREIGN KEY ("computation_slip_id") REFERENCES "computation_slips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
