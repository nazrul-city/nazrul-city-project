-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('PROJECT_VISIT', 'REGISTRATION', 'BOOKING', 'CUSTOMER_MOMENTS', 'PROJECT_ACTIVITIES', 'CORPORATE');

-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" "GalleryCategory" NOT NULL,
    "image_url" VARCHAR(2000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gallery_photos_category_idx" ON "gallery_photos"("category");

-- CreateIndex
CREATE INDEX "gallery_photos_created_at_idx" ON "gallery_photos"("created_at");
