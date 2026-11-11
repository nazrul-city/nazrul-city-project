-- Singleton homepage hero statistics (three admin-editable display values).
CREATE TABLE "hero_stats" (
    "id" TEXT NOT NULL,
    "plots_sold" VARCHAR(20) NOT NULL,
    "happy_clients" VARCHAR(20) NOT NULL,
    "properties_listed" VARCHAR(20) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_stats_pkey" PRIMARY KEY ("id")
);

INSERT INTO "hero_stats" ("id", "plots_sold", "happy_clients", "properties_listed", "updated_at")
VALUES (
    'default',
    '২৫০+',
    '৯৮০+',
    '৮৫০+',
    CURRENT_TIMESTAMP
);
