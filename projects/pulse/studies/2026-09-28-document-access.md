# Pulse: simplifying document access for agents

## Identity and question

- **ID:** pulse-document-access-2026-09-28; revision 1.
- **Owner/lane:** Pulse contribution to the Lab's project studies; implementation
  remains Pulse-owned.
- **Status:** completed retrospective technical study. No comparative trial.
- **Question:** can an agent acquire complete, identifiable Pulse documents
  through known HTTP URLs and read them locally without a hosted browsing
  reader, website rendering, GitHub retrieval, or live RPC?

The motivating suggestion was that simpler tools make communication with
agents more stable. This case supports a narrower practice: **keep required
operations simple, make exchanged data explicit, and make failures observable.**
It does not establish a reliability gain across agents or providers.

## Scope and method

This is infrastructure relevant to projects that give agents public knowledge.
It does not evaluate Agent intention, artwork quality, pricing theory, or
whether Pulse itself constitutes Agent Art. The Lab's distinctions between
evidence classes and its retrospective method are reused.

The sequence is reconstructed after the refactor. Earlier retrieval problems
motivated the changes; the study question and proposed lesson were not
preregistered. A fresh read-only check supplements source inspection and
session-reported history. There is no matched before/after cohort, controlled
assignment, or measured success-rate difference.

The implementation snapshot is Pulse commit
`32adfe39e1bf775f387ddab698780f256ed0cc81`, tagged `pulse-site-v1.0.2`.
The public index revision examined is `2026-09-27-r7`. These identify source
and document revisions, not an attestation that every deployed byte matches
that Git commit. Intermediate failed reader attempts lack an exact retained
runtime/build identity in this collection.

The operator authorized sharing the case. Actions here are source inspection,
public document reads, local validation and PR publication. No private history
retrieval, live agent experiment, pricing execution, RPC, wallet action or
deployment is part of this study. No paid trial was commissioned; time, token
use and infrastructure cost were not measured. Permission denials must use the
host's approval process; tool substitution is not a permission bypass.

## Evidence inventory

| Evidence | Class and observer | Access | Establishes | Limits |
| --- | --- | --- | --- | --- |
| [Download format][format], [prompt][prompt], [generator][generator] and [catalog][catalog] at the pinned commit | Source inspection by the contributing agent | Public source | Explicit acquisition contract and build design | Design alone is not observed agent compliance. |
| [Knowledge tests][tests] and [standalone client][client] | Source inspection; prior successful runs are session-reported | Public test implementation; historical raw logs not retained here | Checks cover exact source reconstruction, deterministic generation, missing RPC and saved-file replay | This contribution does not relabel inspected tests as freshly executed tests or semantic understanding. |
| Public index and ten document downloads, 2026-09-28 | Direct read-only check by the contributing agent | Public endpoints; procedure below | Current acquisition and file/source verification on one client path | Mutable URLs; one environment, no comparative reliability estimate. |
| Earlier hosted-reader failures and public-access changes | Retrospective session report | Sanitized account below; raw traces unavailable here | Motivation and possible confounds | Original reader failure cause remains unconfirmed. |
| An answer addressed prompt validation after a floor-policy question | Retrospective session report | Sanitized account; private conversation not exported | Reported task-following failure despite relevant retrieval | Not independently reproducible here; no failure-rate estimate. |

## What changed

The client contract became:

1. Download the known index into an authorized workspace.
2. Select relevant entries and download their complete `download.url` files.
3. Check byte length and hashes when possible; parse each JSON envelope.
4. Read or search the complete `content` locally, in portions if helpful.
5. Answer from those sources, citing downloaded URLs and revisions; distinguish
   original-source provenance from evidence actually fetched.

The index is a small discovery map, not all website content in one JSON file.
Each export contains one whole logical source. All ten current sources are text
and have no required companion media. Outbound references are not automatically
downloaded. A question that depends on one still requires deliberate retrieval.

Same-origin exports remove GitHub from the consumer's required retrieval path
for those sources. Build-time generation still needs the pinned Git objects.
The authored index in the repository is enriched with download descriptors
during generation; it is not byte-identical to the served index.

The source hash identifies the original UTF-8 content. A separate download hash
identifies the serialized envelope. Keeping JSON source inside a string avoids
rewriting its integer literals or formatting. The checks cover Unicode, BOM,
CRLF and large integer text. Hash agreement establishes byte identity relative
to the index, not truth, freshness or independent authenticity.

Static documents are separate from the playground's runtime and read-only RPC
gateway. The inspected tests exercise document access with missing RPC and a
503 status response. Historical chain records remain historical documents;
downloading them today does not verify today's chain or application state.

## Dated observations and reproduction

**Before this study, reported during the Pulse refactor:** a hosted browsing
reader could not consistently retrieve the public sources, while ordinary HTTP
retrieval later succeeded. Public-access security configuration also changed.
Prompt wording, published content and runtime dependencies changed during the
work. These are confounds: success cannot be attributed to simpler tools alone.
The hosted reader's original failure cause remains unknown; a cache explanation
was considered, not established.

**2026-09-28:** the contributing agent inspected the pinned implementation,
then ran the existing standalone Python client against the production index
and all ten exports. Both download verification and a separate saved-file
replay exited successfully. Each reported ten complete downloads and matching
source/file hashes. This was one acquisition pass and one replay, not repeated
network trials or a new agent trial.

The check ran on macOS with Python 3.14.6 and its standard-library HTTP client.
No model/runtime identity is inferred from the assistant's configured label.

The fetched [index](https://pulse.inshell.art/docs/agent-index.json) had revision
`2026-09-27-r7` and serialized-byte SHA-256
`18285e4476ca5032a4de05d1ee06bfef489759618ba5331c4c18d92a26aa8595`.
Verified export IDs were `proposition`, `playground`, `core-api`, `integration`,
`core-build`, `core-sepolia`, `core-abi`, `core-handoff`, `site-release`, and
`projects`, each at `https://pulse.inshell.art/docs/documents/<id>.json`.
For example, the [Core API download](https://pulse.inshell.art/docs/documents/core-api.json)
had source revision
`sha256:6faa430c09e64bbfa2ff46c381bf70a4754accac40124718fd8d5f85cb82c720`.
This record retains result summaries and identities, not an immutable archive
of HTTP responses. Future public content can differ.

A reproducer with permitted network access and an authorized local workspace
can obtain the [client][client] at the pinned revision, inspect it, and run:

```sh
python3 smoke-public-access.py https://pulse.inshell.art --save-dir downloads
python3 smoke-public-access.py --offline-dir downloads
```

The client uses Python's standard library and default User-Agent. It requests
GET and HEAD for the index and exports, checks media types and `nosniff`, then
verifies saved lengths, envelope/source hashes, revisions and identities. It
extracts text, checks selected API terms and parses the ABI. It requests no
website runtime, GitHub source, status endpoint or RPC during document use.
Acquiring the checker itself is a separate setup step, not a prerequisite for
agents using their own permitted HTTP tools.

During local analysis the client replaces Python socket/DNS/urllib functions
with rejecting functions. The separate replay starts with that guard enabled.
This is an in-process check, **not OS-level network isolation**. The output's
word “analyzed” means parsing, integrity checks, extraction and limited search;
it does not measure comprehension or answer correctness.

## Outcome, counterevidence and transfer limits

The architecture supplies complete inspectable inputs with fewer required
runtime dependencies. It makes failed retrieval, missing storage and hash
mismatches explicit. This is a demonstrated path and a reasoned design benefit,
not a measured reduction in overall agent failure probability.

A reported conversation mistake is particularly relevant: after fetching the
appropriate documents for a question about the proposition and Core V1's floor
policy, the assistant answered about prompt validation instead. Successful
transport does not guarantee attention to the user's question or a correct
answer. Retrieval, interpretation and task completion require separate evidence.

Other limits remain:

- The initial server, network or tool may be unavailable or denied. A different
  permitted HTTP client may help unsupported retrieval; it cannot guarantee it.
- This particular prompt requires local storage. Agents without an authorized
  filesystem cannot complete it. Simpler operations do not mean fewer required
  capabilities for every host.
- Rich media and linked sources need an explicit dependency policy. The current
  text-only exports are not a complete offline copy of the website or repository.
- A valid saved document can be stale or factually wrong. Live questions require
  separately authorized live evidence.
- More metadata adds maintenance: source hashes, revisions, export coverage and
  tests must stay aligned. No maintenance or token-cost savings were measured.

## Evaluate the Lab method

The evidence inventory exposed where claims depended on missing reader traces
and separated public source inspection from fresh checks and session reports.
The outcome distinction preserved the task-following counterexample instead of
treating a download as full success. These are concrete editorial benefits.

The retrospective record cannot recover omitted before/after measurements or
the original reader's exact runtime. It did not measure the method's time cost
or causal effect. No general framework change or shared runner is justified.
The small proposed addition is [P-07 in the findings register][practice].

## Handoff

This record completes the bounded technical case; it leaves comparative
reliability and original failure attribution unresolved. Lab maintainers review
the proposed practice. Pulse retains implementation and release ownership.
Review the practice if agents lack local storage, documents require media or
live state, metadata causes drift, or a declared comparison contradicts the
expected benefit. No such trial is initiated by this contribution.

This public derivative excludes private transcripts, operator configuration and
raw historical logs. It adds a new study without modifying source originals or
the historical standalone edition's provenance identities.

[format]: https://github.com/inshell-art/pulse/blob/32adfe39e1bf775f387ddab698780f256ed0cc81/evm/playground/docs/document-format.md
[prompt]: https://github.com/inshell-art/pulse/blob/32adfe39e1bf775f387ddab698780f256ed0cc81/evm/playground/docs/agent-prompt.txt
[generator]: https://github.com/inshell-art/pulse/blob/32adfe39e1bf775f387ddab698780f256ed0cc81/evm/playground/generate-knowledge.js
[catalog]: https://github.com/inshell-art/pulse/blob/32adfe39e1bf775f387ddab698780f256ed0cc81/evm/playground/knowledge-catalog.js
[tests]: https://github.com/inshell-art/pulse/blob/32adfe39e1bf775f387ddab698780f256ed0cc81/evm/playground/knowledge.test.js
[client]: https://github.com/inshell-art/pulse/blob/32adfe39e1bf775f387ddab698780f256ed0cc81/evm/playground/smoke-public-access.py
[practice]: ../../../findings/REGISTER.md#p-07-simplify-acquisition-and-make-the-data-contract-explicit
