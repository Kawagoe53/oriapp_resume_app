/*
  Warnings:

  - Changed the type of `content` on the `chat_messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;
