BEGIN;

-- Reject non-string JSON rather than silently changing its meaning.
LOCK TABLE "chat_messages" IN ACCESS EXCLUSIVE MODE;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "chat_messages"
    WHERE jsonb_typeof("content") IS DISTINCT FROM 'string'
  ) THEN
    RAISE EXCEPTION 'chat_messages.content contains non-string JSON';
  END IF;
END $$;

-- Extract the string value, preserving quotes, line breaks and Unicode.
ALTER TABLE "chat_messages"
  ALTER COLUMN "content" TYPE TEXT USING ("content" #>> '{}');

COMMIT;
