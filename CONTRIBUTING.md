# Contributing and publication

## Smallest contribution

Use the [project intake](templates/PROJECT.md) for a new work and the
[study template](templates/STUDY.md) for an inquiry. Add it to the project's
index; link any justified lesson from the [findings register](findings/REGISTER.md).
A study can be useful without new code, paid runs or a generalized mechanism.

Read [agent instructions](AGENTS.md) first. Preserve originals and add dated
corrections. A diagnostic's status and its underlying product-fix status are
separate.

## Review before merging

- Is the question and actual method clear?
- Are source versions, evidence access and missing inputs stated?
- Are simulation, live observations and interpretation kept distinct?
- Are unsupported generalizations, unknowns and contradictory outcomes visible?
- Does any proposed practice state scope and when it should be reviewed?
- Is the method evaluation honest about unmeasured benefits/costs?
- Does the record avoid credentials, private raw prompts, account data, private
  source locators and unnecessary personal paths?
- Does the next step stay in the current lane and existing authority?

Run `python3 -B scripts/check.py` and
`python3 -B -m unittest discover -s tests`.
Check the diff manually; a passing checker is not proof that all secrets,
private creative content or rights issues have been removed.

## Publication boundary

This edition is a reviewed derivative of internal documents; the originals are
not deleted, moved or rewritten. [Provenance](PROVENANCE.json) identifies them by
owning repository, relative path and observed byte hash. Some source documents
were uncommitted when inspected: their base commit is context, not their identity.

Underlying private transcripts and pilot reports are not published. No
credential or private evidence should be added merely to make a study look
reproducible. State the limitation.

Before the first GitHub push, confirm repository owner/name and visibility,
review the exact tracked file set, and settle whether any reuse license is
desired. Absence of a license is not an open-source grant. Third-party sources
remain links and attributed summaries, not imported full papers.

No GitHub Actions, publishing bot, paid service, secret store or live runner is
configured by this v0. Ordinary repository review can be added when there is a
concrete need.
