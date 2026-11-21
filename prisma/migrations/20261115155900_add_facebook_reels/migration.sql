-- CreateTable
CREATE TABLE "facebook_reels" (
    "id" TEXT NOT NULL,
    "video_url" VARCHAR(2000) NOT NULL,
    "thumbnail_url" VARCHAR(2000) NOT NULL,
    "views" VARCHAR(6) NOT NULL,
    "duration" VARCHAR(10) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facebook_reels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "facebook_reels_priority_idx" ON "facebook_reels"("priority");
