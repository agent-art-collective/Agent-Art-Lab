import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { extractLessonExcerpts } from '../scripts/lesson-excerpts.mjs';

test('wrapped introductory paragraphs retain every line without taking support bullets', () => {
  const intro = 'Record actual action separately from\nsummaries and interpretation. Neither proves\nartistic intention.';
  const [lesson] = extractLessonExcerpts(`### P-01: preserve evidence\n\n${intro}\n\n- Support: reported observation.\n- Limits: one case.\n`);
  assert.deepEqual(lesson, { id: 'P-01', title: 'preserve evidence', slug: 'p-01-preserve-evidence', intro });
  assert.ok(!lesson.intro.includes('Support:'));
});

test('adjacent headings and end of file bound the correct paragraphs', () => {
  const lessons = extractLessonExcerpts('### P-01: first\nFirst line\nand complete second line.\n### P-02: second\n\nLast paragraph\nwithout a final newline.');
  assert.deepEqual(lessons.map(({ id, intro }) => ({ id, intro })), [
    { id: 'P-01', intro: 'First line\nand complete second line.' },
    { id: 'P-02', intro: 'Last paragraph\nwithout a final newline.' },
  ]);
});

test('a missing introductory paragraph cannot borrow another section or support list', () => {
  for (const following of ['### P-02: another\n\nAnother paragraph.', '## History\n\nHistory paragraph.', '- Support: only a bullet.']) {
    assert.throws(() => extractLessonExcerpts(`### P-01: empty\n\n${following}`), /P-01 has no introductory paragraph/);
  }
});

test('Markdown parsing excludes fenced heading examples and respects CRLF paragraphs', () => {
  const source = '```md\r\n### P-90: example only\r\n\r\nExample text.\r\n```\r\n\r\n### P-01: actual\r\n\r\nFirst line\r\nlast line.\r\n';
  assert.deepEqual(extractLessonExcerpts(source).map(({ id, intro }) => ({ id, intro })), [
    { id: 'P-01', intro: 'First line\nlast line.' },
  ]);
});

test('all seven published practices retain their complete first paragraph and order', () => {
  const register = readFileSync(new URL('../findings/REGISTER.md', import.meta.url), 'utf8');
  const lessons = extractLessonExcerpts(register);
  assert.deepEqual(lessons.map(lesson => lesson.id), ['P-01', 'P-02', 'P-03', 'P-04', 'P-05', 'P-06', 'P-07']);
  const paragraphs = [
    'Record actual action and observation separately from summaries and interpretation. Fixture success, process exit, product acceptance and artwork judgment do not substitute for each other.',
    'A capability supplied by a fixture does not establish that a real agent can acquire its equivalent. Record the acquisition path separately when material.',
    'Record what the Lab method helped reveal and what it failed to capture. Distinguish qualitative usefulness from measured time savings or causal effects.',
    'After finding a representation error, inspect other producers and consumers of the same value. State the bytes, encoding and envelope precisely; test plausible wrong interpretations as well as a correct reference helper.',
    'Exercise the actual process/channel transition with fake input. Bind the proof to the worker that will receive protected data; inspect whether a later process or terminal change invalidates it.',
    "Record bounded, secret-free operation and failure-class markers. Keep parsing, transport, schema and HTTP outcomes separate. Attribute conclusions to actual output; do not infer a no-commit state or replay permission from a generic error or a valid error envelope. Apply the operation's existing recovery contract.",
    'For static project knowledge, prefer known URLs, a small discovery index and complete sources that agents can inspect with permitted ordinary HTTP and local reading tools. State revisions, provenance, integrity checks and failure behavior. Keep optional interactive or live services outside documentation readiness.',
  ];
  assert.deepEqual(lessons.map(lesson => lesson.intro.replace(/\s+/g, ' ').trim()), paragraphs);
  assert.equal(lessons.at(-1).slug, 'p-07-simplify-acquisition-and-make-the-data-contract-explicit');
});
