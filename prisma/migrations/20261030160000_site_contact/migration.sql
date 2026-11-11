-- Singleton public contact details (admin-editable phones, WhatsApp, email).
CREATE TABLE "site_contacts" (
    "id" TEXT NOT NULL,
    "primary_phone" VARCHAR(20) NOT NULL,
    "secondary_phone" VARCHAR(20) NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_contacts_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_contacts" ("id", "primary_phone", "secondary_phone", "whatsapp", "email", "updated_at")
VALUES (
    'default',
    '+8801837777777',
    '+8801910100100',
    '+8801910100100',
    'info@nazrulcity.com',
    CURRENT_TIMESTAMP
);
