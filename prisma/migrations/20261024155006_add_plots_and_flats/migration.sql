-- CreateEnum
CREATE TYPE "PlotStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "FlatPropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'BOTH');

-- CreateEnum
CREATE TYPE "FlatConstructionStatus" AS ENUM ('READY', 'UNDER_CONSTRUCTION', 'UPCOMING');

-- CreateTable
CREATE TABLE "plots" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" VARCHAR(20000) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "facilities" VARCHAR(500) NOT NULL DEFAULT '',
    "address" VARCHAR(500) NOT NULL,
    "district" VARCHAR(120) NOT NULL,
    "landmark" VARCHAR(500) NOT NULL DEFAULT '',
    "shotangsho_price" VARCHAR(120) NOT NULL,
    "land_area" VARCHAR(120) NOT NULL,
    "drive_link" VARCHAR(2000) NOT NULL DEFAULT '',
    "map_embed_url" VARCHAR(2000) NOT NULL DEFAULT '',
    "special_offer" VARCHAR(500) NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "PlotStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plot_images" (
    "id" TEXT NOT NULL,
    "plot_id" TEXT NOT NULL,
    "image_url" VARCHAR(2000) NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plot_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flats" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "property_type" "FlatPropertyType" NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "district" VARCHAR(120) NOT NULL,
    "description" VARCHAR(20000) NOT NULL,
    "building_total_floors" INTEGER NOT NULL,
    "price_per_sqft" VARCHAR(120) NOT NULL,
    "landmark" VARCHAR(500) NOT NULL DEFAULT '',
    "facilities" VARCHAR(500) NOT NULL DEFAULT '',
    "special_offer" VARCHAR(500) NOT NULL DEFAULT '',
    "construction_status" "FlatConstructionStatus" NOT NULL,
    "handover_date" VARCHAR(120) NOT NULL DEFAULT '',
    "drive_link" VARCHAR(2000) NOT NULL DEFAULT '',
    "map_embed_url" VARCHAR(2000) NOT NULL DEFAULT '',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "installment_facility" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_images" (
    "id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "image_url" VARCHAR(2000) NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flat_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plots_name_key" ON "plots"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plots_slug_key" ON "plots"("slug");

-- CreateIndex
CREATE INDEX "plots_published_idx" ON "plots"("published");

-- CreateIndex
CREATE INDEX "plot_images_plot_id_idx" ON "plot_images"("plot_id");

-- CreateIndex
CREATE UNIQUE INDEX "flats_name_key" ON "flats"("name");

-- CreateIndex
CREATE UNIQUE INDEX "flats_slug_key" ON "flats"("slug");

-- CreateIndex
CREATE INDEX "flats_published_idx" ON "flats"("published");

-- CreateIndex
CREATE INDEX "flat_images_flat_id_idx" ON "flat_images"("flat_id");

-- AddForeignKey
ALTER TABLE "plot_images" ADD CONSTRAINT "plot_images_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_images" ADD CONSTRAINT "flat_images_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
