import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// 既存のTypeScript依存を使い、テスト用ランナーの追加なしでヘルパーを実行する。
const source = await readFile(new URL("../app/_libs/passwordRecovery.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { hasRecoveryMethod, isPasswordRecoverySession } = await import(
  `data:text/javascript,${encodeURIComponent(outputText)}`
);

function session(method) {
  const payload = Buffer.from(JSON.stringify({ amr: [{ method, timestamp: 1 }] })).toString("base64url");
  return { access_token: `header.${payload}.signature` };
}

for (const method of ["recovery", "otp"]) {
  test(`${method}のメールリンク認証を再設定対象・API制限対象とする`, () => {
    assert.equal(hasRecoveryMethod([{ method }]), true);
    assert.equal(isPasswordRecoverySession(session(method)), true);
  });
}

for (const method of ["password", "oauth"]) {
  test(`${method}の通常ログインを再設定対象としない`, () => {
    assert.equal(hasRecoveryMethod([{ method }]), false);
    assert.equal(isPasswordRecoverySession(session(method)), false);
  });
}

test("セッションなし・不正なJWT・認証方法なしでは再設定を許可しない", () => {
  assert.equal(isPasswordRecoverySession(null), false);
  assert.equal(isPasswordRecoverySession({ access_token: "invalid" }), false);
  assert.equal(hasRecoveryMethod(undefined), false);
  assert.equal(hasRecoveryMethod([]), false);
});
