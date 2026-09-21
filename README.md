# Agent-Art-Lab

Agent-Art-Lab is a shared practice and annotated archive for **Agent Art:
art in which an Agent participates at the level of intention**.

The name is **Agent-Art-Lab**. Its scope is Agent Art, not only prompt acceptance,
THOUGHT, or website deployment. It helps projects research a question, refine a
study, observe what happens, analyze the result, and develop revisable practices.
Each artwork keeps its own artistic aims and implementation.

## Start here

1. Read [agent instructions](AGENTS.md) and [Guidance](GUIDANCE.md).
2. Read [handoff and current status](HANDOFF.md).
3. Browse the [THOUGHT collection](projects/thought/README.md), our first case.
4. Use the [project intake](templates/PROJECT.md) and [study template](templates/STUDY.md)
   for a new inquiry.

**Current state:** standalone v0 candidate; public publication authorized on
2026-09-21 to `agent-art-collective/Agent-Art-Lab`, with the first push pending.
It contains a usable documentation practice and reviewed derivative records,
not a validated universal method, portable runtime, or complete artwork archive.
The shared Agent Art organization is
[agent-art-collective](https://github.com/agent-art-collective), registered by
the operator and verified on 2026-09-21. The repository name is `Agent-Art-Lab`.
Repository visibility is public. No reuse license has been selected. See the
[organization context and task split](docs/ORGANIZATION_AND_SPLIT.md).

## What lives here

| Component | Purpose |
| --- | --- |
| [Guidance](GUIDANCE.md) | Shared foundations and methods, not a fixed creative recipe. |
| [Research notes](research/README.md) | Sources, what they suggest, and where transfer is unsupported. |
| [Project collections](projects/thought/README.md) | Project-specific studies, observations and evidence limits. |
| [Findings register](findings/REGISTER.md) | Observations and scoped provisional practices; no automatic promotion to theory. |
| [Templates](templates/STUDY.md) | Lightweight records adapted to the work, including retrospective diagnosis. |
| [Boundaries](docs/BOUNDARIES.md) | Lab, project tooling, live trials, canaries and releases have different aims. |
| [Provenance](PROVENANCE.json) | Source-document identities and changes made for this portable edition. |

## Working rhythm

**Question → research → refine the study → observe/test → analyze/compare →
record → revise Guidance when justified.**

Practice-led exploration need not be a controlled experiment. A comparison does
need declared factors, measures and limits. Technical completion, intentional
participation, creative interpretation and artwork judgment remain distinct.

Projects instantiate their own small labs when useful. With a few materially
different artworks expected per year, shared text and good records are the
default. A generalized runner is not a prerequisite.

## Check this repository

Requires Python 3.10+ standard library only:

```sh
python3 -B scripts/check.py
python3 -B -m unittest discover -s tests
```

These offline checks validate packaging, local links, JSON and selected
publication-risk patterns. They do not verify historical claims, remote links,
model behavior, artwork quality or every possible secret.

## Scope of this edition

The THOUGHT records distinguish simulations, real-Agent fixture observations,
product canaries and source inspection. Some underlying evidence is privately
retained and unavailable here. No raw chats, run credentials, local account
configuration, live batch settings or application source are included.

This repo can be handed to a new agent without the originating conversation.
It cannot reproduce private canaries or run THOUGHT by itself. See
[Handoff](HANDOFF.md) for the exact next task and limits.

This edition retains its existing public definition sources at Inshell:
[Agent Art](https://inshell.art/docs/agent-art) and
[THOUGHT](https://inshell.art/docs/thought).
This repository does not supersede those sources. That attribution identifies
the source of this edition's definition, not Agent-Art-Lab's organizational ownership.

## Publication and reuse

Public repository publication was authorized by the operator on 2026-09-21.
No open-source or Creative Commons license has been selected. Do not infer
redistribution rights for third-party research or private evidence.
See [contribution and publication rules](CONTRIBUTING.md).
