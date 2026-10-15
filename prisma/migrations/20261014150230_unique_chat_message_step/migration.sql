/*
  Warnings:

  - A unique constraint covering the columns `[resume_id,role,step_number]` on the table `chat_messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chat_messages_resume_id_role_step_number_key" ON "chat_messages"("resume_id", "role", "step_number");
