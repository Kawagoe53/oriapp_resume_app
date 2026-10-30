-- 問い合わせはサーバーのPrisma接続からのみ操作する。
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "contacts" FROM anon, authenticated;
