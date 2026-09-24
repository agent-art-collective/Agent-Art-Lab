# THOUGHT: representation, worker boundaries and canary follow-up

- Date: 2026-09-24; retrospective technical case update.
- Status: documentation complete; corrections and production delivery reported
  complete by OPS. No Lab-run experiment or deployment was performed.
- Related: [collection](../README.md), [earlier diagnostic](2026-09-20-model-acquisition.md),
  and [scoped findings](../../../findings/REGISTER.md).

## Question and evidence access

What did the later hash and worker corrections address, and what do successful
canaries establish about execution and compliance?

This record draws on the three 2026-09-24 learning-list bullets in OPS's
`MEMO.md`, and its operational reports
`docs/thought-start-text-hashes-2026-09-24.md` and
`docs/thought-worker-boundary-2026-09-24.md`. Those reports were read for
sanitized facts only; their private originals are not included here. Historical
intermediate states in the reports are superseded by their dated completion
entries, not silently relabeled as successful at the earlier time.

Public references supplied by OPS are implementation/regression PRs
[#209](https://github.com/inshell-art/inshell.art/pull/209) and
[#210](https://github.com/inshell-art/inshell.art/pull/210), sanitized canary
evidence [#211](https://github.com/inshell-art/inshell.art/pull/211), and production
promotion [#212](https://github.com/inshell-art/inshell.art/pull/212).
The Lab did not independently inspect those PRs, rerun checks or query deployed
systems. Runtime observations below are attributed to OPS inspection and
operator reports, not direct Lab observation. No raw transcript, credentials,
artwork, private run locator or personal history path was imported.

## Observations and corrections

| Evidence layer | Reported observation | Supported conclusion and limit |
| --- | --- | --- |
| OPS source inspection and synthetic reproduction | Codex-47 compared bare digests with prefixed incoming hashes. An earlier result-hash fix left `/start` wording ambiguous. | The validator had a sufficient representation defect; the missing historical response prevents claiming it was the only failed predicate. |
| Patch and negative regression cases | Incoming text/hash instructions specify exact decoded text encoded as UTF-8, a `sha256:` prefix, and no trimming, normalization or JSON-string hashing. | Tests cover plausible wrong translations as well as the correct helper. Separately encoded contract hashes keep their own rules. Agent compliance is not established by helper correctness. |
| OPS inspection of Codex-48 execution | A parent shell passed a no-echo check, then an interactive child echoed credential-bearing source into its private tool transcript. | A protection proved in the parent did not carry into the final execution context. External disclosure and a causal link to the HTTP failure were not established. |
| Fake-only process regression and revised instructions | The unsafe process transition was reproduced with fake input; revised handoff binds private input and its proof to the final non-interactive worker. | The tested path is supported. Instructions and reference tests do not prove arbitrary Agent-generated workers follow that path. |
| Actual retained Codex-48 output, reported by OPS | `THOUGHT_STOP stage=http class=transport`; one catch covered claim/ready/start and JSON parsing, without verified intermediate success markers. | Its final claim-stage attribution and a specific network cause were unproven. Source inspection alone does not identify which operation failed at runtime. |

A matching endpoint and valid JSON/error envelope do not by themselves prove
that an operation did not commit: OPS found the App could wrap arbitrary internal
throws in a valid envelope. Retain bounded operation/class markers without
secrets; distinguish transport, parse, schema and HTTP outcomes. Recovery must
follow the operation's established contract. Uncertainty grants no arbitrary
replay, especially for a dispatched operation whose commit state is unknown.

## Fresh staging canaries and production delivery

OPS reports that fresh Codex-49 and Claude-49 both returned, with operator
confirmation of success. These are functional successes and are not relabeled
as failed work. There was one fresh run per cell, not a replicated comparison.

Codex-49 had a preclaim input-exhaustion failure, then used a secret-free local
worker. It skipped the prescribed fake-nonce/ECHO_OK proof and omitted some
claim/readiness checks. Its returned result therefore does not establish full
instruction compliance, a privacy attestation, or first-attempt reliability.
Claude's success does not establish that it exhibited or resolved Codex-48's
process defect. Neither cell supports a causal effect or provider reliability
estimate, and neither receipt assesses artistic quality or intentional participation.

OPS's verification record distinguishes:

- **Synthetic/source checks:** 44 focused patch tests and the full release
  checks passed. These cover checked implementations and conditions.
- **Live staging qualification:** both fresh manual canaries above succeeded
  against tested source `339d53930bcf0e737c3c5eb9d3a2398da785ca27`, with the
  compliance limitations retained.
- **Production delivery:** normal protected promotion and both production
  deployments completed, followed by API smoke and three desktop/narrow-viewport
  render checks. OPS reports production commit
  `024ba2ab218b5ad3e535c495cf0f85996871d387` has the same tree as the
  evidence-qualified tree `8af98fd767c849ba5e7b08ee8a48cbcb36d37d1c`.
  The evidence update added sanitized records, not a new tested implementation.

No production Agent run was executed by OPS. Delivery checks do not turn the
staging canaries into production Agent trials. No live trial was run by the Lab.

## Outcome, method evaluation and next action

The practical additions are scoped practices P-04–P-06 in the findings register.
Evidence separation kept successful returns, compliance gaps, synthetic passes
and deployment status visible at the same time. The earlier result-only review
missed an incoming representation boundary; the parent-shell proof missed the
worker transition; the catch-all diagnostic prevented operation attribution.
No time/cost improvement or causal benefit of the Lab method was measured.

Use the bounded practices when a project next changes a representation or an
execution boundary. Revisit this record if authorized evidence identifies the
historical failing operation or contradicts the reported execution. Further
compliance or reliability claims require evidence beyond these two canaries.
The earlier model-acquisition diagnosis remains a dated record; this follow-up
does not retroactively verify its missing historical acquisition path.

Applications retains product implementation; OPS retains release coordination.
This documentation update adds no release gate, framework, runner or live test
requirement. The OPS handoff originally authorized local preparation only; the
operator subsequently authorized committing and pushing the sanitized record
on 2026-09-24. Next: revisit the scoped practices when relevant new evidence is
available, without initiating a live trial or product action by implication.
