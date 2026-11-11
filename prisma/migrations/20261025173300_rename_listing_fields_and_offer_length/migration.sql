-- Rename columns so existing text stays. Offers longer than 200 characters keep the first 200.

ALTER TABLE "plots" RENAME COLUMN "land_area" TO "land_area_size";
ALTER TABLE "plots" RENAME COLUMN "youtube_video_link" TO "youtube_video_url";
ALTER TABLE "plots" RENAME COLUMN "map_embed_url" TO "map_embed_link";

UPDATE "plots"
SET "special_offer" = left("special_offer", 200)
WHERE char_length("special_offer") > 200;

ALTER TABLE "plots" ALTER COLUMN "special_offer" SET DATA TYPE VARCHAR(200);

ALTER TABLE "flats" RENAME COLUMN "youtube_video_link" TO "youtube_video_url";
ALTER TABLE "flats" RENAME COLUMN "map_embed_url" TO "map_embed_link";

UPDATE "flats"
SET "special_offer" = left("special_offer", 200)
WHERE char_length("special_offer") > 200;

ALTER TABLE "flats" ALTER COLUMN "special_offer" SET DATA TYPE VARCHAR(200);
