-- Cap hero notice message at 200 characters.
ALTER TABLE "site_notices"
ALTER COLUMN "message" TYPE VARCHAR(200);
