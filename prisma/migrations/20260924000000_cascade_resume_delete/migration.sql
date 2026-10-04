BEGIN;

-- Delete resume-owned data when its resume is deleted.
ALTER TABLE "job_experiences" DROP CONSTRAINT "job_experiences_resume_id_fkey";
ALTER TABLE "job_experiences" ADD CONSTRAINT "job_experiences_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_resume_id_fkey";
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
