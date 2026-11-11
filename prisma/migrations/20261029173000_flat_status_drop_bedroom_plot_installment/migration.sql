-- Drop bedrooms from flats; availability uses the shared PlotStatus enum.
ALTER TABLE "flats" DROP COLUMN IF EXISTS "bed_room";

ALTER TABLE "flats"
ADD COLUMN IF NOT EXISTS "status" "PlotStatus" NOT NULL DEFAULT 'AVAILABLE';

-- Plots can store the same optional installment note as flats.
ALTER TABLE "plots"
ADD COLUMN IF NOT EXISTS "installment_facility" VARCHAR(500);
