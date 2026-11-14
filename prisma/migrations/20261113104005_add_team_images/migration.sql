-- AlterTable
ALTER TABLE "hero_stats" ALTER COLUMN "id" SET DEFAULT 'default';

-- AlterTable
ALTER TABLE "site_contacts" ALTER COLUMN "id" SET DEFAULT 'default';

-- AlterTable
ALTER TABLE "site_notices" ALTER COLUMN "id" SET DEFAULT 'default';

-- CreateTable
CREATE TABLE "team_images" (
    "id" TEXT NOT NULL,
    "caption" VARCHAR(200) NOT NULL,
    "image_url" VARCHAR(2000) NOT NULL,
    "order_pos" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_images_pkey" PRIMARY KEY ("id")
);
