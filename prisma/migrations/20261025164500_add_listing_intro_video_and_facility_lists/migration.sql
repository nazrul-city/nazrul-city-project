-- Keep existing facility text as the first list item. An empty value becomes an empty list.

ALTER TABLE "plots"
ADD COLUMN "short_intro" VARCHAR(150) NOT NULL DEFAULT '',
ADD COLUMN "youtube_video_link" VARCHAR(2000) NOT NULL DEFAULT '';

ALTER TABLE "plots"
ALTER COLUMN "facilities" DROP DEFAULT,
ALTER COLUMN "facilities" TYPE TEXT[] USING (
  CASE
    WHEN btrim("facilities") = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY["facilities"]::TEXT[]
  END
),
ALTER COLUMN "facilities" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "facilities" SET NOT NULL;

ALTER TABLE "flats"
ADD COLUMN "short_intro" VARCHAR(150) NOT NULL DEFAULT '',
ADD COLUMN "bed_room" VARCHAR(120) NOT NULL DEFAULT '',
ADD COLUMN "youtube_video_link" VARCHAR(2000) NOT NULL DEFAULT '';

ALTER TABLE "flats"
ALTER COLUMN "facilities" DROP DEFAULT,
ALTER COLUMN "facilities" TYPE TEXT[] USING (
  CASE
    WHEN btrim("facilities") = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY["facilities"]::TEXT[]
  END
),
ALTER COLUMN "facilities" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "facilities" SET NOT NULL;
