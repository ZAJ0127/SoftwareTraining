// Runs C++ by sending it to a public online compiler.
// Tries Compiler Explorer first, then Wandbox. Neither needs an account or key.
//
// runCpp(source, stdin) resolves to one of:
//   { status: 'ok', stdout, stderr, exitCode, warnings, via }
//   { status: 'compile-error', compileOutput, via }
//   { status: 'timeout', stdout, stderr, via }
//   { status: 'service-error', message }

const TIMEOUT_MS = 30000;
const FLAGS = '-std=c++20 -Wall -Wextra';

const stripAnsi = (s) => (s || '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
const lines = (arr) => (arr || []).map((l) => (typeof l === 'string' ? l : l.text)).join('\n');

async function postJson(url, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function compilerExplorer(source, stdin) {
  const r = await postJson('https://godbolt.org/api/compiler/g132/compile', {
    source,
    compiler: 'g132',
    options: {
      userArguments: FLAGS,
      executeParameters: { args: [], stdin },
      compilerOptions: { executorRequest: true },
      filters: { execute: true },
      tools: [],
      libraries: [],
    },
    lang: 'c++',
    allowStoreCodeDebug: true,
  });
  const via = 'Compiler Explorer';
  const build = r.buildResult || {};
  const buildOut = stripAnsi(lines(build.stderr) || lines(build.stdout));
  const buildFailed = (build.code !== undefined && build.code !== 0) || r.didExecute === false;
  if (buildFailed) {
    return { status: 'compile-error', compileOutput: buildOut || stripAnsi(lines(r.stderr)) || 'The compiler reported an error.', via };
  }
  return {
    status: r.timedOut ? 'timeout' : 'ok',
    stdout: lines(r.stdout),
    stderr: stripAnsi(lines(r.stderr)),
    exitCode: r.code,
    warnings: buildOut,
    via,
  };
}

async function wandbox(source, stdin) {
  const r = await postJson('https://wandbox.org/api/compile.json', {
    code: source,
    compiler: 'gcc-13.2.0',
    options: 'warning',
    stdin,
    'compiler-option-raw': '-std=c++20',
    save: false,
  });
  const via = 'Wandbox';
  const compileOut = stripAnsi(r.compiler_error || r.compiler_message || '');
  const ran = r.program_output != null || r.program_error != null || r.signal != null;
  if (String(r.status) !== '0' && !ran && compileOut) {
    return { status: 'compile-error', compileOutput: compileOut, via };
  }
  return {
    status: 'ok',
    stdout: r.program_output || '',
    stderr: stripAnsi(r.program_error || '') + (r.signal ? `\n${r.signal}` : ''),
    exitCode: Number(r.status || 0),
    warnings: compileOut,
    via,
  };
}

export async function runCpp(source, stdin = '') {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { status: 'service-error', message: "You're offline. Running C++ needs an internet connection." };
  }
  let last;
  for (const service of [compilerExplorer, wandbox]) {
    try {
      return await service(source, stdin);
    } catch (err) {
      last = err;
    }
  }
  const why = last && last.name === 'AbortError' ? 'The compiler took too long to answer.' : 'Could not reach the online compiler.';
  return { status: 'service-error', message: why + ' Check your connection and try again in a moment.' };
}

// Output comparison ignores trailing spaces and trailing blank lines.
export const normalize = (s) =>
  (s || '').replace(/\r/g, '').split('\n').map((l) => l.trimEnd()).join('\n').trim();

// Removes // and /* */ comments, so source checks ignore planning notes.
// (Good enough for checking learner code; it does not handle // inside strings.)
export const stripComments = (src) => (src || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
