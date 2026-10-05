import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = process.cwd();
function load(relativePath, mocks = {}) {
  const filename = path.resolve(root, relativePath);
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith('@/')) return load(`${name.slice(2)}.ts`, mocks);
    if (name.startsWith('.')) return load(`${path.relative(root, path.resolve(path.dirname(filename), name))}.ts`, mocks);
    return require(name);
  };
  new Function('require', 'module', 'exports', source)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { questions } = load('app/_constants/questions.ts');
const { isResumeAnswered } = load('app/_libs/resumeProgress.ts');
const answered = () => questions.flatMap(({ stepNumber, question }) => [
  { role: 'ASSISTANT', stepNumber, content: question },
  { role: 'USER', stepNumber, content: '回答' },
]);

test('completion requires a nonempty user answer for every required step', () => {
  assert.equal(isResumeAnswered([]), false);
  assert.equal(isResumeAnswered(answered()), true);
  assert.equal(isResumeAnswered(answered().slice(0, -1)), false);
  assert.equal(isResumeAnswered(answered().filter((m) => m.stepNumber !== 3)), false);
  assert.equal(isResumeAnswered(answered().map((m) => m.role === 'USER' && m.stepNumber === 3 ? { ...m, content: '  ' } : m)), false);
  assert.equal(isResumeAnswered([...answered().slice(0, -1), ...answered().slice(0, 2)]), false);
});

function fixture({ status = 'DRAFT', messages = answered(), acquired = true, failAI = false, failSave = false } = {}) {
  let persistedStatus = status;
  let usage = 0;
  let aiCalls = 0;
  const tx = {
    $queryRaw: async () => [{ acquired }],
    resume: {
      findFirst: async () => ({ id: 'resume', status: persistedStatus }),
      update: async ({ data }) => { persistedStatus = data.status; },
    },
    chatMessage: { findMany: async () => messages, create: async ({ data }) => { return data; } },
    jobExperience: { deleteMany: async () => {}, createMany: async () => { if (failSave) throw new Error('save failed'); } },
    aiUsage: { count: async () => usage, create: async () => { usage++; } },
  };
  const prisma = {
    ...tx,
    $transaction: async (callback) => {
      const before = { persistedStatus, usage };
      try { return await callback(tx); }
      catch (error) { persistedStatus = before.persistedStatus; usage = before.usage; throw error; }
    },
  };
  const mocks = {
    '@/app/_libs/prisma': { prisma },
    '@/app/_libs/getUserId': { default: async () => 'owner' },
    '@/app/generated/prisma/enums': { ResumeStatus: { DRAFT: 'DRAFT', COMPLETED: 'COMPLETED' } },
    '@/app/_libs/openai': { openai: { responses: { parse: async () => {
      aiCalls++;
      if (failAI) throw new Error('AI failed');
      return { output_parsed: { jobExperiences: [], skills: [], certificate: [] } };
    } } } },
    'openai/helpers/zod': { zodTextFormat: () => ({}) },
  };
  return { mocks, state: () => ({ persistedStatus, usage, aiCalls }) };
}
const context = { params: Promise.resolve({ id: 'resume' }) };

test('chat GET restores answered state and rejects extra answers', async () => {
  const f = fixture();
  const route = load('app/api/resumes/[id]/chat/route.ts', f.mocks);
  assert.equal((await (await route.GET({}, context)).json()).isAnswered, true);
  assert.equal((await route.POST({ json: async () => ({ content: 'extra' }) }, context)).status, 409);
});

test('chat continues intermediate steps and records final completion', async () => {
  for (const count of [1, questions.length * 2 - 1]) {
    const f = fixture({ messages: answered().slice(0, count) });
    const route = load('app/api/resumes/[id]/chat/route.ts', f.mocks);
    const response = await route.POST({ json: async () => ({ content: '回答' }) }, context);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).isAnswered, count > 1);
  }
});

test('generation rejects incomplete answers and concurrent generation without calling AI', async () => {
  for (const [options, expected] of [[{ messages: answered().slice(0, -1) }, 400], [{ acquired: false }, 409]]) {
    const f = fixture(options);
    const { POST } = load('app/api/resumes/[id]/generate/route.ts', f.mocks);
    assert.equal((await POST({}, context)).status, expected);
    assert.equal(f.state().aiCalls, 0);
  }
});

test('successful generation completes resume once; repeated requests preserve usage', async () => {
  const f = fixture();
  const { POST } = load('app/api/resumes/[id]/generate/route.ts', f.mocks);
  assert.equal((await POST({}, context)).status, 200);
  assert.equal((await POST({}, context)).status, 200);
  assert.deepEqual(f.state(), { persistedStatus: 'COMPLETED', usage: 1, aiCalls: 1 });
});

test('AI and persistence failures keep draft status and do not count usage', async () => {
  for (const options of [{ failAI: true }, { failSave: true }]) {
    const f = fixture(options);
    const { POST } = load('app/api/resumes/[id]/generate/route.ts', f.mocks);
    assert.equal((await POST({}, context)).status, 400);
    assert.deepEqual(f.state(), { persistedStatus: 'DRAFT', usage: 0, aiCalls: 1 });
  }
});
