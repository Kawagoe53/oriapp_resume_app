ALTER TABLE "contacts" ADD COLUMN "subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN "notification_sent_at" TIMESTAMP(3);
CREATE INDEX "contacts_email_created_at_idx" ON "contacts"("email", "created_at");
