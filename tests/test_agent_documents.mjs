import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { buildAgentDocuments, documentId } from '../scripts/agent-documents.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const fixture = overrides => ({
  id: 'test-record', title: 'Complete record', path: 'projects/test/record.md',
  page: '/Agent-Art-Lab/projects/test/record.html',
  bytes: Buffer.from('# Complete record\n\nObservation.\n\n## Limits\nNot a reliability result.\n'),
  ...overrides,
});

test('complete Markdown survives UTF-8 BOM, CRLF, Unicode and integer text unchanged', () => {
  const bytes = Buffer.from('\ufeff# Record\r\n\r\n雪 / café / 🎨\r\n900719925474099312345\r\n\r\n## Limits\r\nUnknown.\r\n');
  const result = buildAgentDocuments([fixture({ bytes })]);
  const body = result.documents.get('test-record');
  const document = JSON.parse(body);
  const descriptor = result.index.documents[0];
  assert.deepEqual(Buffer.from(document.content, 'utf8'), bytes);
  assert.equal(document.source.sha256, hash(bytes));
  assert.equal(document.source.byteLength, bytes.length);
  assert.equal(document.revision, `sha256:${hash(bytes)}`);
  assert.equal(descriptor.download.sha256, hash(body));
  assert.equal(descriptor.download.byteLength, body.length);
  assert.notEqual(descriptor.download.sha256, document.source.sha256);
  assert.equal(document.contentFormat, 'markdown');
  assert.deepEqual(document.assets, []);
});

test('index revision describes the serialized contract and builds are deterministic', () => {
  const first = buildAgentDocuments([fixture()]);
  const second = buildAgentDocuments([fixture()]);
  assert.deepEqual(first.indexBytes, second.indexBytes);
  assert.deepEqual(first.documents, second.documents);
  const { revision, ...unsigned } = first.index;
  assert.equal(revision, `sha256:${hash(Buffer.from(JSON.stringify(unsigned, null, 2) + '\n'))}`);
  assert.deepEqual(JSON.parse(first.indexBytes), first.index);
});

test('content changes update both byte identities and the index revision', () => {
  const first = buildAgentDocuments([fixture()]);
  const changed = buildAgentDocuments([fixture({ bytes: Buffer.from('# Changed\n\nStill unverified.\n') })]);
  const before = first.index.documents[0];
  const after = changed.index.documents[0];
  assert.notEqual(before.source.sha256, after.source.sha256);
  assert.notEqual(before.download.sha256, after.download.sha256);
  assert.notEqual(first.index.revision, changed.index.revision);
});

test('study status and evidence remain in both discovery and the complete document', () => {
  const study = { project: 'THOUGHT', date: '2026-09-20', status: 'Study proposal', evidence: 'Unrun; review material not available' };
  const result = buildAgentDocuments([fixture({ study })], { basePath: '' });
  assert.deepEqual(result.index.documents[0].study, study);
  assert.deepEqual(JSON.parse(result.documents.get('test-record')).study, study);
  assert.equal(result.index.documents[0].download.url, '/documents/test-record.json');
});

test('metadata changes are distinct from changes to canonical source bytes', () => {
  const first = buildAgentDocuments([fixture()]);
  const changed = buildAgentDocuments([fixture({ title: 'Corrected title' })]);
  assert.equal(first.index.documents[0].source.sha256, changed.index.documents[0].source.sha256);
  assert.notEqual(first.index.documents[0].download.sha256, changed.index.documents[0].download.sha256);
  assert.notEqual(first.index.revision, changed.index.revision);
});

test('malformed UTF-8 cannot silently replace source bytes', () => {
  for (const bytes of [Buffer.from([0xc3, 0x28]), Buffer.from([0xff]), Buffer.from([0xed, 0xa0, 0x80])]) {
    assert.throws(() => buildAgentDocuments([fixture({ bytes })]));
  }
});

test('unsafe identifiers, source paths, duplicate IDs and duplicate sources fail', () => {
  for (const id of ['../record', 'nested/record', 'Record', '', 'test_record', '-record', 'record-']) {
    assert.throws(() => buildAgentDocuments([fixture({ id })]));
  }
  for (const path of ['/record.md', '../record.md', 'test/../record.md', 'test/./record.md', 'test//record.md', 'test\\record.md', 'record.json']) {
    assert.throws(() => buildAgentDocuments([fixture({ path })]));
  }
  assert.throws(() => buildAgentDocuments([fixture(), fixture({ path: 'other.md' })]));
  assert.throws(() => buildAgentDocuments([fixture(), fixture({ id: 'other-record' })]));
  assert.throws(() => buildAgentDocuments([fixture()], { basePath: '/../bad' }));
  assert.equal(documentId('docs/AGENT_ACCESS.md'), 'docs-agent-access');
});
