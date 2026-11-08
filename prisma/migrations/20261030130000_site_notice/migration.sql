-- Singleton hero marquee notice for the public home page.
CREATE TABLE "site_notices" (
    "id" TEXT NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_notices_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_notices" ("id", "message", "is_enabled", "updated_at")
VALUES (
    'default',
    'সেরা আবাসন সমাধান, যা আপনার স্বপ্নকে বাস্তবে রূপ দেওয়ার জন্য তৈরি। কল করুন: +8801837777777 | +8801910100100',
    true,
    CURRENT_TIMESTAMP
);
