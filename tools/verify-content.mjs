// Checks every chapter's content with a local g++:
//   - lesson examples compile and run
//   - each challenge solution passes all of its tests
//   - each bug-hunt starter fails at least one test (so there is a bug to find)
//   - each "predict" answer matches what the code really prints
// Usage: node tools/verify-content.mjs

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chapters } from '../content/index.js';

const dir = mkdtempSync(join(tmpdir(), 'dojo-'));
let n = 0;
let failures = 0;

const norm = (s) => s.replace(/\r/g, '').split('\n').map((l) => l.trimEnd()).join('\n').trim();

function build(src) {
  const base = join(dir, `p${n++}`);
  writeFileSync(base + '.cpp', src);
  const r = spawnSync('g++', ['-std=c++20', '-o', base, base + '.cpp'], { encoding: 'utf8' });
  return r.status === 0 ? base : null;
}
function run(bin, stdin) {
  return execFileSync(bin, { input: stdin || '', encoding: 'utf8', timeout: 5000 });
}
function fail(msg) {
  failures++;
  console.log('FAIL  ' + msg);
}

const ids = new Set();
for (const ch of chapters) {
  if (!ch.load) continue;
  const data = (await ch.load()).default;
  const lessonIds = new Set(data.lessons.map((l) => l.id));

  for (const l of data.lessons) {
    if (ids.has(l.id)) fail(`duplicate id ${l.id}`);
    ids.add(l.id);
    for (const b of l.body) {
      if (!b.code) continue;
      const bin = build(b.code);
      if (!bin) fail(`${l.id}: lesson example does not compile`);
      else run(bin, b.stdin);
    }
    if (!(l.check.answer >= 0 && l.check.answer < l.check.options.length)) fail(`${l.id}: bad check answer`);
  }

  for (const c of data.challenges) {
    if (ids.has(c.id)) fail(`duplicate id ${c.id}`);
    ids.add(c.id);
    if (!lessonIds.has(c.lesson)) fail(`${c.id}: unknown lesson ${c.lesson}`);

    if (c.kind === 'predict') {
      const bin = build(c.code);
      if (!bin) { fail(`${c.id}: predict code does not compile`); continue; }
      const out = norm(run(bin, ''));
      if (out !== c.options[c.answer]) fail(`${c.id}: prints "${out}" but answer says "${c.options[c.answer]}"`);
      continue;
    }

    const sol = build(c.solution);
    if (!sol) { fail(`${c.id}: solution does not compile`); continue; }
    for (const t of c.tests) {
      const out = norm(run(sol, t.stdin));
      if (out !== norm(t.expected)) fail(`${c.id} / ${t.name}: got "${out}", expected "${t.expected}"`);
    }

    const start = build(c.starter);
    let starterPasses = !!start;
    if (start) {
      starterPasses = c.tests.every((t) => {
        try { return norm(run(start, t.stdin)) === norm(t.expected); } catch { return false; }
      });
    }
    if (starterPasses) fail(`${c.id}: starter code already passes every test`);
  }
  console.log(`chapter ${data.num}: ${data.lessons.length} lessons, ${data.challenges.length} challenges checked`);
}

console.log(failures ? `${failures} problem(s)` : 'All content OK');
process.exit(failures ? 1 : 0);
