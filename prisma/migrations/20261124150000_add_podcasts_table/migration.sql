-- CreateTable
CREATE TABLE "podcasts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "youtube_url" VARCHAR(2000) NOT NULL,
    "thumbnail_url" VARCHAR(2000) NOT NULL,
    "duration" VARCHAR(20) NOT NULL,
    "order_pos" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "client_name" VARCHAR(120) DEFAULT '',
    "client_designation" VARCHAR(120) DEFAULT '',
    "project_name" VARCHAR(120) DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "podcasts_order_pos_idx" ON "podcasts"("order_pos");

-- CreateIndex
CREATE INDEX "podcasts_published_idx" ON "podcasts"("published");

