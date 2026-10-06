import { tracks } from './content/index.js';
import { runCpp, normalize } from './runner.js';

const APP_VERSION = '1.2.0';
const STORE_KEY = 'codedojo.v1';

/* ---------- small helpers ---------- */

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

// Replace an element's children, skipping empty slots.
function put(el, ...kids) {
  el.replaceChildren(...kids.flat().filter((k) => k != null && k !== false));
}

// Text with `inline code` in backticks -> array of nodes.
function rich(text) {
  return String(text).split('`').map((part, i) => (i % 2 ? h('code', { class: 'inline' }, part) : part));
}

const ICONS = {
  check: '<path d="M5 12l5 5 9-10"/>',
  cross: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  out: '<path d="M8 16L16 8M9 8h7v7"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  today: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  track: '<path d="M4 6h16M4 12h10M4 18h13"/>',
  progress: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
  redo: '<path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5"/>',
};
function icon(name, size = 18, label) {
  const span = document.createElement('span');
  span.style.display = 'inline-flex';
  span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${ICONS[name]}</svg>`;
  return span.firstChild;
}
function playIcon(size = 14) {
  const span = document.createElement('span');
  span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>`;
  return span.firstChild;
}

const dayKey = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const addDays = (n, from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return d;
};
function hashString(s) {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 16777619);
  return x >>> 0;
}

/* ---------- saved progress ---------- */

const blank = () => ({ v: 1, lessons: {}, done: {}, review: {}, days: [], code: {}, hints: {}, daily: null, tab: 'cpp' });
let state = blank();
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  if (saved && saved.v === 1) state = { ...blank(), ...saved };
} catch { /* start fresh */ }

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}
function markDay() {
  const t = dayKey();
  if (!state.days.includes(t)) state.days.push(t);
}
function streak() {
  const days = new Set(state.days);
  let d = new Date();
  if (!days.has(dayKey(d))) d = addDays(-1, d);
  let n = 0;
  while (days.has(dayKey(d))) { n++; d = addDays(-1, d); }
  return n;
}

/* ---------- content ---------- */

let loaded = [];      // chapters that have content: { num, title, lessons, challenges }
let lessonById = {};
let challengeById = {};
let allLessons = [];
let allChallenges = [];

async function loadContent() {
  const out = [];
  for (const track of tracks) {
    for (const ch of track.chapters) {
      if (!ch.load) continue;
      try {
        const data = (await ch.load()).default;
        out.push({ ...ch, ...data, track: track.id, unit: track.unit });
      } catch (err) {
        console.warn('Could not load', ch.num, err);
      }
    }
  }
  loaded = out;
  allLessons = out.flatMap((c) => c.lessons.map((l, i) => ({ ...l, chapter: c.num, track: c.track, unit: c.unit, n: i + 1, of: c.lessons.length })));
  allChallenges = out.flatMap((c) => c.challenges.map((x) => ({ ...x, chapter: c.num })));
  lessonById = Object.fromEntries(allLessons.map((l) => [l.id, l]));
  challengeById = Object.fromEntries(allChallenges.map((c) => [c.id, c]));
}

const KIND = { write: 'Write code', bughunt: 'Bug hunt', predict: 'Read the code', project: 'Mini project' };
const kindLabel = (c) => (c.noVerify ? 'Concept check' : KIND[c.kind]);
const nextLesson = (trackId) => allLessons.find((l) => !state.lessons[l.id] && (!trackId || l.track === trackId));
const dueReviews = () => {
  const t = dayKey();
  return Object.entries(state.review).filter(([id, due]) => due <= t && challengeById[id]).map(([id]) => challengeById[id]);
};

// One challenge per day, picked at random from unsolved challenges whose lesson is finished.
function dailyChallenge() {
  const t = dayKey();
  if (state.daily && state.daily.date === t && challengeById[state.daily.id]) return challengeById[state.daily.id];
  const pool = allChallenges.filter((c) => !state.done[c.id] && state.lessons[c.lesson] && c.kind !== 'project');
  if (!pool.length) return null;
  const pick = pool[hashString(t) % pool.length];
  state.daily = { date: t, id: pick.id };
  save();
  return pick;
}

/* ---------- code editor ---------- */

const SYMBOLS = ['{', '}', '(', ')', ';', '<<', '>>', '"', "'", '=', '+', '-', '*', '/', '\\n', '<', '>', '#', ':', ',', '&', '!', '[', ']', '_'];

function makeEditor(initial, { onChange, symbols = true } = {}) {
  const ta = h('textarea', {
    class: 'code-input', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', wrap: 'off',
    'aria-label': 'Code editor',
  });
  const gutter = h('pre', { class: 'gutter', 'aria-hidden': 'true' });
  const sync = () => {
    const n = ta.value.split('\n').length;
    gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n');
    ta.rows = n;
  };
  const changed = () => { sync(); if (onChange) onChange(ta.value); };
  const insert = (text) => {
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
    changed();
  };

  ta.value = initial;
  sync();

  ta.addEventListener('input', () => {
    // Phone keyboards swap in curly quotes, which C++ rejects.
    if (/[‘’“”]/.test(ta.value)) {
      const pos = ta.selectionStart;
      ta.value = ta.value.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
      ta.setSelectionRange(pos, pos);
    }
    changed();
  });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      insert('  ');
    }
  });
  ta.addEventListener('beforeinput', (e) => {
    if (e.inputType !== 'insertLineBreak') return;
    e.preventDefault();
    const before = ta.value.slice(0, ta.selectionStart);
    const line = before.slice(before.lastIndexOf('\n') + 1);
    const indent = line.match(/^\s*/)[0] + (/\{\s*$/.test(line) ? '  ' : '');
    insert('\n' + indent);
  });

  const parts = [h('div', { class: 'editor' }, gutter, ta)];
  if (symbols) {
    parts.push(h('div', { class: 'symbols', role: 'group', 'aria-label': 'Insert symbol' },
      SYMBOLS.map((s) => h('button', {
        type: 'button', 'aria-label': 'Insert ' + s,
        onpointerdown: (e) => e.preventDefault(),
        onclick: () => { ta.focus(); insert(s); },
      }, s))));
  }
  return {
    parts,
    get value() { return ta.value; },
    set value(v) { ta.value = v; changed(); },
  };
}

/* ---------- running code ---------- */

const tidy = (s) => (s || '').replace(/^(?:<source>|prog\.cc): /gm, '').replace(/(?:<source>|prog\.cc|\S*example\.cpp):(\d+):(?:\d+:)?/g, 'line $1:').trim();

function showResult(r, box) {
  put(box);
  const block = (label, text, cls = '', right = '') => box.append(h('div', null,
    h('div', { class: 'output-label' }, h('span', null, label), h('span', null, right)),
    h('pre', { class: 'output ' + cls }, text)));

  if (r.status === 'service-error') return block('Could not run', r.message, 'error');
  if (r.status === 'compile-error') return block('Compiler error', tidy(r.compileOutput), 'error', 'nothing was run');
  if (r.status === 'timeout') block('Stopped', 'The program ran for too long and was stopped. Look for a loop that never ends.', 'error');
  block('Output', r.stdout || '(the program printed nothing)', '', r.exitCode ? 'exit code ' + r.exitCode : '');
  if (r.stderr && r.stderr.trim()) block('Error output', r.stderr.trim(), 'error');
  if (r.warnings && r.warnings.trim()) block('Compiler warnings', tidy(r.warnings));
}

async function busy(button, work) {
  const row = button.closest('.btn-row') || button.parentElement;
  const buttons = [...row.querySelectorAll('button')];
  const original = [...button.childNodes];
  buttons.forEach((b) => { b.disabled = true; });
  put(button, h('span', { class: 'spin', 'aria-hidden': 'true' }), 'Running…');
  try {
    await work();
  } finally {
    put(button, ...original);
    buttons.forEach((b) => { b.disabled = false; });
  }
}

/* ---------- views ---------- */

const app = document.getElementById('app');
const tabs = document.getElementById('tabs');
let lastTab = 'today';

function topbar(title) {
  return h('div', { class: 'topbar' },
    h('a', { class: 'icon-btn', 'aria-label': 'Back', href: '#/' + lastTab }, icon('back', 22)),
    h('div', { class: 'grow small muted' }, title));
}
function statusIcon(kind) {
  if (kind === 'done') return h('span', { class: 'status done' }, icon('check', 18, 'Completed'));
  if (kind === 'review') return h('span', { class: 'status review' }, icon('redo', 16, 'Due for review'));
  return h('span', { class: 'status todo', role: 'img', 'aria-label': 'Not started' });
}
function challengeRow(c) {
  const t = dayKey();
  const kind = state.review[c.id] && state.review[c.id] <= t ? 'review' : state.done[c.id] ? 'done' : 'todo';
  return h('a', { class: 'item', href: '#/challenge/' + c.id },
    statusIcon(kind),
    h('span', { class: 'grow' }, c.title, h('div', { class: 'sub' }, `${kindLabel(c)} · ${c.character}`)),
    h('span', { class: 'sub' }, c.level));
}
function lessonRow(lesson, withUnit) {
  const l = lessonById[lesson.id];
  return h('a', { class: 'item', href: '#/lesson/' + l.id },
    statusIcon(state.lessons[l.id] ? 'done' : 'todo'),
    h('span', { class: 'grow' }, l.title,
      h('div', { class: 'sub' }, `${withUnit ? `${l.unit} ${l.chapter} · ` : ''}Lesson ${l.n} · ${l.character}`)));
}
function chapterProgress(ch) {
  const total = ch.lessons.length + ch.challenges.length;
  const done = ch.lessons.filter((l) => state.lessons[l.id]).length + ch.challenges.filter((c) => state.done[c.id]).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function viewToday() {
  const now = new Date();
  const s = streak();
  const days = new Set(state.days);
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(-i, now);
    const done = days.has(dayKey(d));
    week.push(h('div', { class: (i === 0 ? 'today ' : '') + (done ? 'done' : '') },
      h('span', null, d.toLocaleDateString(undefined, { weekday: 'short' })),
      h('span', { class: 'dot' }, done ? icon('check', 16, 'Practised') : d.getDate())));
  }

  const daily = dailyChallenge();
  const nexts = tracks.map((t) => nextLesson(t.id)).filter(Boolean);
  const next = nexts[0];
  const more = daily ? nexts : nexts.slice(1);
  let main;
  if (daily) {
    const solved = !!state.done[daily.id];
    main = h('section', { class: 'card' },
      h('div', { class: 'row between' },
        h('span', { class: 'eyebrow' }, `${daily.character} · ${daily.show}`),
        h('span', { class: 'small muted' }, solved ? 'Solved today' : "Today's challenge")),
      h('h1', { class: 'h-title' }, daily.title),
      h('p', { class: 'soft' }, rich(daily.prompt)),
      h('div', { class: 'tags' },
        h('span', { class: 'tag mono' }, 'C++'),
        h('span', { class: 'tag' }, kindLabel(daily)),
        h('span', { class: 'tag level' }, daily.level)),
      h('a', { class: 'btn primary', href: '#/challenge/' + daily.id }, solved ? 'Open again' : 'Start challenge', icon('arrow')));
  } else if (next) {
    main = h('section', { class: 'card' },
      h('div', { class: 'row between' },
        h('span', { class: 'eyebrow' }, `${next.character} · ${next.show}`),
        h('span', { class: 'small muted' }, Object.keys(state.lessons).length ? 'Next lesson' : 'Start here')),
      h('h1', { class: 'h-title' }, next.title),
      h('p', { class: 'soft' }, 'Daily challenges unlock as you finish lessons, so the first step is a short lesson.'),
      h('a', { class: 'btn primary', href: '#/lesson/' + next.id }, 'Start lesson', icon('arrow')));
  } else {
    main = h('section', { class: 'card' },
      h('h1', { class: 'h-title' }, 'All caught up'),
      h('p', { class: 'soft' }, 'You have finished every lesson and challenge that is available. New chapters arrive when the app is updated. Until then, anything on the Tracks tab can be replayed.'),
      h('a', { class: 'btn', href: '#/track' }, 'Browse the track'));
  }

  const reviews = dueReviews();
  put(app, 
    h('header', { class: 'row between' },
      h('div', null,
        h('div', { class: 'h-page' }, 'Code Dojo'),
        h('div', { class: 'small muted' }, now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }))),
      h('div', { class: 'pill' }, h('span', { style: 'color: var(--warn); display: inline-flex' }, icon('flame', 16)), `${s} day streak`)),
    h('div', { class: 'week' }, week),
    main,
    more.length ? h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Continue learning'),
      h('div', { class: 'list' }, more.map((l) => lessonRow(l, true)))) : null,
    reviews.length ? h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Due for review'),
      h('p', { class: 'note' }, 'Challenges you needed help with come back after two days.'),
      h('div', { class: 'list' }, reviews.map(challengeRow))) : null,
    h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Your tracks'),
      loaded.map((ch) => {
        const p = chapterProgress(ch);
        return h('a', { class: 'item', href: '#/track', onclick: () => { state.tab = ch.track; save(); }, style: 'flex-direction: column; align-items: stretch; gap: 8px; padding: 14px 16px' },
          h('div', { class: 'row between' }, h('span', null, `${ch.unit} ${ch.num}: ${ch.title}`), h('span', { class: 'sub' }, `${p.done} of ${p.total}`)),
          h('div', { class: 'bar' }, h('div', { style: `width: ${p.pct}%` })));
      })));
}

function viewTrack() {
  const track = tracks.find((t) => t.id === state.tab) || tracks[0];
  const rows = track.chapters.map((ch) => {
    const data = loaded.find((c) => c.num === ch.num);
    if (!data) {
      return h('div', { class: 'item plain' },
        h('span', { class: 'num' }, ch.num), h('span', { class: 'grow' }, ch.title), h('span', { class: 'sub' }, 'Coming soon'));
    }
    const p = chapterProgress(data);
    return h('section', { class: 'chapter-open' },
      h('div', { class: 'row' },
        h('span', { class: 'num', style: 'width: 28px; font-family: var(--mono); font-size: 12px; color: var(--accent-text)' }, data.num),
        h('h2', { class: 'h-section grow' }, data.title),
        h('span', { class: 'small muted' }, `${p.done} of ${p.total}`)),
      h('div', { class: 'bar' }, h('div', { style: `width: ${p.pct}%` })),
      h('div', { class: 'group-label' }, 'Lessons'),
      data.lessons.map((l) => lessonRow(l)),
      h('div', { class: 'group-label' }, 'Challenges'),
      data.challenges.map(challengeRow));
  });
  put(app, 
    h('header', { class: 'stack' },
      h('div', { class: 'h-page' }, 'Tracks'),
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Track' }, tracks.map((t) => h('button', {
        type: 'button', 'aria-pressed': String(t.id === track.id),
        onclick: () => { state.tab = t.id; save(); viewTrack(); },
      }, t.title))),
      h('div', { class: 'small muted' }, track.blurb,
        track.id === 'cpp' ? [' Chapters follow the order of ',
          h('a', { href: 'https://www.learncpp.com/', target: '_blank', rel: 'noopener' }, 'LearnCpp.com'), '.'] : null)),
    h('div', { class: 'list' }, rows));
}

// A runnable example inside a lesson.
function exampleBlock(block) {
  const ed = makeEditor(block.code, { symbols: false });
  const out = h('div', { class: 'stack-sm' });
  const stdin = block.stdin != null
    ? h('textarea', { class: 'stdin', rows: '1', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', id: 'in-' + hashString(block.code) }, block.stdin)
    : null;
  const runBtn = h('button', { class: 'btn primary small', type: 'button' }, playIcon(), 'Run');
  runBtn.addEventListener('click', () => busy(runBtn, async () => showResult(await runCpp(ed.value, stdin ? stdin.value : ''), out)));
  return h('div', { class: 'stack-sm' },
    h('div', { class: 'code-box' },
      h('div', { class: 'code-head' }, h('span', null, 'Try it. Edit and run.'), runBtn),
      ed.parts),
    stdin ? h('div', null, h('label', { class: 'field-label', for: stdin.id }, 'Input (what std::cin reads)'), stdin) : null,
    out);
}

function quiz({ q, options, answer, explain, mono, onAnswer, answered }) {
  const note = h('div', { class: 'stack-sm' });
  const buttons = options.map((text, i) => h('button', { class: 'option' + (mono ? ' mono' : ''), type: 'button' }, h('span', null, rich(text))));
  let locked = false;
  const choose = (i, silent) => {
    if (locked) return;
    locked = true;
    buttons.forEach((b, j) => {
      b.disabled = true;
      if (j === answer) { b.classList.add('right'); b.append(h('span', { class: 'mark' }, 'Correct answer')); }
      else if (j === i) { b.classList.add('wrong'); b.append(h('span', { class: 'mark' }, 'Your answer')); }
    });
    note.append(h('p', { class: 'soft' }, h('b', { style: `color: var(${i === answer ? '--pass' : '--warn'})` }, i === answer ? 'Correct. ' : 'Not this time. '), rich(explain)));
    if (!silent && onAnswer) onAnswer(i === answer);
  };
  buttons.forEach((b, i) => b.addEventListener('click', () => choose(i)));
  if (answered) choose(answer, true);
  return h('div', { class: 'stack' }, q ? h('p', { class: 'soft' }, rich(q)) : null, h('div', { class: 'options' }, buttons), note);
}

function viewLesson(id) {
  const lesson = lessonById[id];
  if (!lesson) return viewMissing();
  const idx = allLessons.findIndex((l) => l.id === id);
  const following = allLessons[idx + 1] && allLessons[idx + 1].track === lesson.track ? allLessons[idx + 1] : null;
  const practice = allChallenges.filter((c) => c.lesson === id);
  const done = !!state.lessons[id];

  const finish = () => {
    if (!state.lessons[id]) { state.lessons[id] = dayKey(); markDay(); save(); }
    location.hash = following ? '#/lesson/' + following.id : '#/track';
  };

  put(app, 
    topbar(`${lesson.unit} ${lesson.chapter} · Lesson ${lesson.n} of ${lesson.of}`),
    h('header', { class: 'stack-sm' },
      h('span', { class: 'eyebrow' }, `${lesson.character} · ${lesson.show}`),
      h('h1', { class: 'h-title' }, lesson.title)),
    h('div', { class: 'prose' }, lesson.body.map((b) => {
      if (b.p) return h('p', null, rich(b.p));
      if (b.tip) return h('div', { class: 'tip' }, h('b', null, 'Tip: '), rich(b.tip));
      if (b.code) return exampleBlock(b);
      if (b.listing) return h('div', { class: 'code-box' }, h('pre', { class: 'code-static' }, b.listing));
      return null;
    })),
    h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Quick check'),
      quiz({ ...lesson.check })),
    lesson.refs && lesson.refs.length ? h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Read the full lesson'),
      h('div', { class: 'list' }, lesson.refs.map((r) => h('a', { class: 'item plain dashed', href: r.url, target: '_blank', rel: 'noopener', style: 'color: var(--accent-text)' },
        h('span', { class: 'grow' }, 'LearnCpp ' + r.label), icon('out', 16))))) : null,
    practice.length ? h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Practice'),
      h('div', { class: 'list' }, practice.map(challengeRow))) : null,
    h('button', { class: 'btn primary', type: 'button', onclick: finish },
      done ? (following ? 'Next lesson: ' + following.title : 'Back to the track') : (following ? 'Mark complete and continue' : 'Mark complete'),
      icon('arrow')));
}

function recordSolved(c, peeked) {
  if (!state.done[c.id]) state.done[c.id] = { date: dayKey(), usedSolution: peeked };
  else if (!peeked) state.done[c.id].usedSolution = false;
  if (peeked) state.review[c.id] = dayKey(addDays(2));
  else delete state.review[c.id];
  markDay();
  save();
}
function nextChallengeAfter(c) {
  const i = allChallenges.findIndex((x) => x.id === c.id);
  return allChallenges.slice(i + 1).concat(allChallenges.slice(0, i)).find((x) => !state.done[x.id]);
}
function afterLinks(c) {
  const nxt = nextChallengeAfter(c);
  return h('div', { class: 'btn-row' },
    h('a', { class: 'btn', href: '#/today' }, 'Today'),
    nxt ? h('a', { class: 'btn primary', href: '#/challenge/' + nxt.id }, 'Next challenge') : null);
}

function viewChallenge(id) {
  const c = challengeById[id];
  if (!c) return viewMissing();
  const lesson = lessonById[c.lesson];
  const head = [
    topbar(kindLabel(c)),
    h('header', { class: 'stack-sm' },
      h('span', { class: 'eyebrow' }, `${c.character} · ${c.show}`),
      h('h1', { class: 'h-title' }, c.title),
      h('div', { class: 'tags' },
        h('span', { class: 'tag mono' }, 'C++'), h('span', { class: 'tag' }, kindLabel(c)), h('span', { class: 'tag level' }, c.level))),
    h('p', { class: 'soft' }, rich(c.prompt)),
    c.steps ? h('ol', { class: 'steps' }, c.steps.map((step) => h('li', null, rich(step)))) : null,
  ];
  const lessonLink = lesson ? h('a', { class: 'item plain', href: '#/lesson/' + lesson.id },
    h('span', { class: 'grow' }, 'Lesson: ' + lesson.title), icon('arrow', 16)) : null;

  if (c.kind === 'predict') {
    const after = h('div');
    put(app, ...head,
      c.code ? h('div', { class: 'code-box' }, h('pre', { class: 'code-static' }, c.code)) : null,
      quiz({
        options: c.options, answer: c.answer, explain: c.explain, mono: !c.noVerify,
        onAnswer: (right) => {
          if (right) recordSolved(c, false);
          else { state.review[c.id] = dayKey(addDays(2)); markDay(); save(); }
          put(after, afterLinks(c));
        },
      }),
      after, lessonLink);
    return;
  }

  let peeked = false;
  const sample = c.tests[0];
  const usesInput = c.tests.some((t) => t.stdin);
  const ed = makeEditor(state.code[id] ?? c.starter, { onChange: (v) => { state.code[id] = v; save(); } });
  const stdin = usesInput
    ? h('textarea', { class: 'stdin', id: 'stdin', rows: '1', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off' }, sample.stdin)
    : null;
  const results = h('div', { class: 'stack', 'aria-live': 'polite' });
  const runBtn = h('button', { class: 'btn', type: 'button' }, playIcon(), 'Run');
  const checkBtn = h('button', { class: 'btn primary', type: 'button' }, icon('check'), 'Check answer');

  runBtn.addEventListener('click', () => busy(runBtn, async () => {
    showResult(await runCpp(ed.value, stdin ? stdin.value : ''), results);
  }));

  checkBtn.addEventListener('click', () => busy(checkBtn, async () => {
    const rows = [];
    let stop = null;
    for (const t of c.tests) {
      const r = await runCpp(ed.value, t.stdin);
      if (r.status === 'service-error' || r.status === 'compile-error') { stop = r; break; }
      const got = r.status === 'timeout' ? '(stopped: ran too long)' : r.stdout;
      rows.push({ t, pass: r.status === 'ok' && normalize(got) === normalize(t.expected), got });
    }
    if (stop) return showResult(stop, results);
    const passed = rows.filter((r) => r.pass).length;
    const all = passed === rows.length;
    put(results, 
      h('div', null,
        h('div', { class: 'row between' },
          h('h2', { class: 'h-section' }, 'Tests'),
          h('span', { class: 'small', style: `font-weight: 600; color: var(${all ? '--pass' : '--warn'})` }, `${passed} of ${rows.length} passing`)),
        rows.map(({ t, pass, got }) => h('div', { class: 'test ' + (pass ? 'pass' : 'fail') },
          h('span', { class: 'status ' + (pass ? 'done' : '') }, icon(pass ? 'check' : 'cross', 16, pass ? 'Passed' : 'Failed')),
          h('div', { class: 'grow' }, t.name,
            pass ? null : h('div', { class: 'detail' },
              (t.stdin ? `input:    ${t.stdin.replace(/\n/g, ' ')}\n` : '') +
              `expected: ${normalize(t.expected).replace(/\n/g, '\n          ')}\n` +
              `got:      ${(normalize(got) || '(nothing)').replace(/\n/g, '\n          ')}`))))));
    if (all) {
      recordSolved(c, peeked);
      results.append(h('div', { class: 'banner' },
        h('b', null, 'Solved'),
        h('span', null, rich(c.explain)),
        peeked ? h('span', { class: 'small' }, 'You looked at the solution, so this one will come back for review in two days.') : null),
        afterLinks(c));
    }
  }));

  // Hints, revealed one at a time.
  const hintBox = h('div', { class: 'stack-sm' });
  const drawHints = () => {
    const shown = Math.min(state.hints[id] || 0, c.hints.length);
    put(hintBox, 
      ...c.hints.slice(0, shown).map((text, i) => h('div', { class: 'hint' }, h('span', { class: 'n' }, 'Hint ' + (i + 1)), rich(text))),
      shown < c.hints.length
        ? h('button', { class: 'btn small dashed', type: 'button', onclick: () => { state.hints[id] = shown + 1; save(); drawHints(); } },
          `Show hint ${shown + 1} of ${c.hints.length}`)
        : null);
  };
  drawHints();

  // Solution, behind a confirmation.
  const solBox = h('div', { class: 'stack-sm' });
  const drawSolution = (stage) => {
    if (stage === 'closed') {
      put(solBox, h('button', { class: 'btn small', type: 'button', onclick: () => drawSolution('ask') }, 'Show solution'));
    } else if (stage === 'ask') {
      put(solBox, 
        h('p', { class: 'note' }, 'Seeing the solution sends this challenge to your review queue, so you get another go at it in two days.'),
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn small', type: 'button', onclick: () => drawSolution('closed') }, 'Keep trying'),
          h('button', { class: 'btn small primary', type: 'button', onclick: () => drawSolution('open') }, 'Show it')));
    } else {
      peeked = true;
      state.review[id] = dayKey(addDays(2));
      save();
      put(solBox, 
        h('div', { class: 'code-box' },
          h('div', { class: 'code-head' }, h('span', null, 'Solution'),
            h('button', { class: 'btn small ghost', type: 'button', onclick: () => { ed.value = c.solution; window.scrollTo({ top: 0 }); } }, 'Load into editor')),
          h('pre', { class: 'code-static' }, c.solution)),
        h('p', { class: 'soft' }, rich(c.explain)));
    }
  };
  drawSolution('closed');

  put(app, ...head,
    h('div', null,
      h('div', { class: 'output-label' }, h('span', null, 'Expected output'), h('span', null, sample.stdin ? 'for the input ' + sample.stdin.replace(/\n/g, ' ') : '')),
      h('pre', { class: 'output expected' }, sample.expected)),
    h('div', { class: 'code-box' },
      h('div', { class: 'code-head' }, h('span', null, 'main.cpp'),
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => { ed.value = c.starter; } }, 'Reset code')),
      ed.parts),
    stdin ? h('div', null, h('label', { class: 'field-label', for: 'stdin' }, 'Input for Run (what std::cin reads)'), stdin) : null,
    h('div', { class: 'btn-row' }, runBtn, checkBtn),
    results,
    h('section', { class: 'stack' }, h('h2', { class: 'h-section' }, 'Stuck?'), hintBox, solBox),
    lessonLink);
}

function viewProgress() {
  const solved = Object.keys(state.done).filter((id) => challengeById[id]);
  const clean = solved.filter((id) => !state.done[id].usedSolution).length;
  const lessonsDone = Object.keys(state.lessons).filter((id) => lessonById[id]).length;
  const msg = h('p', { class: 'note', 'aria-live': 'polite' });
  const resetBox = h('div', { class: 'stack-sm' });

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ app: 'code-dojo', exported: new Date().toISOString(), state }, null, 2)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `code-dojo-backup-${dayKey()}.json` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    msg.textContent = 'Backup file created.';
  };
  const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, 'aria-label': 'Backup file' });
  file.addEventListener('change', async () => {
    try {
      const data = JSON.parse(await file.files[0].text());
      const incoming = data.state || data;
      if (!incoming || incoming.v !== 1) throw new Error('not a backup');
      state = { ...blank(), ...incoming };
      save();
      render();
    } catch {
      msg.textContent = 'That file is not a Code Dojo backup.';
    }
    file.value = '';
  });
  const drawReset = (ask) => {
    put(resetBox, ask
      ? h('div', { class: 'stack-sm' },
        h('p', { class: 'note' }, 'This erases your streak, completed lessons, solved challenges and saved code on this device. It cannot be undone.'),
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn small', type: 'button', onclick: () => drawReset(false) }, 'Cancel'),
          h('button', { class: 'btn small primary', type: 'button', onclick: () => { state = blank(); save(); render(); } }, 'Erase everything')))
      : h('button', { class: 'btn small', type: 'button', onclick: () => drawReset(true) }, 'Reset progress'));
  };
  drawReset(false);

  put(app, 
    h('header', null, h('div', { class: 'h-page' }, 'Progress')),
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', null, streak()), h('span', null, 'day streak')),
      h('div', { class: 'stat' }, h('b', null, state.days.length), h('span', null, 'days practised')),
      h('div', { class: 'stat' }, h('b', null, `${lessonsDone}/${allLessons.length}`), h('span', null, 'lessons finished')),
      h('div', { class: 'stat' }, h('b', null, `${solved.length}/${allChallenges.length}`), h('span', null, 'challenges solved')),
      h('div', { class: 'stat' }, h('b', null, clean), h('span', null, 'solved without the solution')),
      h('div', { class: 'stat' }, h('b', null, Object.keys(state.review).filter((id) => challengeById[id]).length), h('span', null, 'in the review queue'))),
    h('section', { class: 'stack' },
      h('h2', { class: 'h-section' }, 'Backup'),
      h('p', { class: 'note' }, 'Progress is stored on this device only. Export a backup to move it to another phone or computer, then import it there.'),
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn small', type: 'button', onclick: exportData }, 'Export backup'),
        h('button', { class: 'btn small', type: 'button', onclick: () => file.click() }, 'Import backup')),
      file, msg),
    h('section', { class: 'stack' }, h('h2', { class: 'h-section' }, 'Start over'), resetBox),
    h('p', { class: 'note' }, `Version ${APP_VERSION}. Running C++ needs an internet connection: your code is sent to a public online compiler (Compiler Explorer, or Wandbox as a backup) and nothing else is sent with it.`));
}

function viewMissing() {
  put(app, 
    h('div', { class: 'h-page' }, 'Not found'),
    h('p', { class: 'soft' }, 'That page does not exist. It may belong to a newer version of the app.'),
    h('a', { class: 'btn', href: '#/today' }, 'Go to Today'));
}

/* ---------- routing ---------- */

function drawTabs(current) {
  const tab = (id, label, ic) => h('a', { href: '#/' + id, 'aria-current': current === id ? 'page' : null }, icon(ic, 22), h('span', null, label));
  put(tabs, tab('today', 'Today', 'today'), tab('track', 'Tracks', 'track'), tab('progress', 'Progress', 'progress'));
}

function render() {
  const [route, arg] = location.hash.replace(/^#\/?/, '').split('/');
  const full = route === 'lesson' || route === 'challenge';
  document.body.classList.toggle('no-tabs', full);
  if (route === 'lesson') viewLesson(arg);
  else if (route === 'challenge') viewChallenge(arg);
  else if (route === 'track') viewTrack();
  else if (route === 'progress') viewProgress();
  else viewToday();
  if (!full) lastTab = ['track', 'progress'].includes(route) ? route : 'today';
  drawTabs(route || 'today');
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

await loadContent();
render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
