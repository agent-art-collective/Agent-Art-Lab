# THOUGHT: native tools and explicit execution prerequisites

- Date: 2026-10-01; retrospective technical study.
- Status: sanitized documentation contribution authorized by the operator on
  2026-10-01; connecting guidance remains provisional.
- Lane: Lab project learning. Applications retains implementation and OPS retains
  release coordination.
- Related: [THOUGHT collection](../README.md),
  [boundary follow-up](2026-09-24-boundaries-and-canary-follow-up.md),
  [Pulse study](../../pulse/studies/2026-09-28-document-access.md), and
  [P-04–P-07](../../../findings/REGISTER.md).

## Question and evidence access

How do the earlier plain/raw exchange direction and the later native-client
and permission observations inform a small, explicit execution contract?

The Lab read OPS's sanitized draft
`agent-art-lab-native-explicit-lessons-2026-10-01.md` and the existing Lab
records above. The new runtime observations below are **OPS reports**, including
OPS's accounts of source inspection, probes and operator-run staging canaries.
The Lab did not inspect their underlying private chronology, commands, edge
events, ACKs or saved artwork; it did not rerun probes or access deployed systems.
Private evidence is not independently reproducible from this repository.

The source draft identifies the observations by sequence, but this derivative
does not establish exact deployed commits, tool versions or handoff hashes for
them. Private paths, account/run identifiers, credentials and artwork are omitted.
This is retrospective diagnosis, not a preregistered or controlled comparison.

## Two distinct lessons

| Reported evidence | Bounded interpretation |
| --- | --- |
| Earlier THOUGHT instructions permitted a host-approved raw HTTP tool. An earlier successful run selected curl; later runs selected Python urllib. OPS found matching normalized delivery instructions. | Client choice varied without a reported application migration to Python. Why the Agent selected that client is unknown. |
| Credential-free probes reached the App handler with ordinary curl, while Python's default client identity received HTTP 403/error 1010. OPS attributes the second historical 403 to Browser Integrity Check from a retained edge event. | Client/edge compatibility mattered on this path. The first generic failure remains unattributed; this does not establish that every Python request fails or that every historical failure had this cause. |
| A narrow edge exception did not remove the live Python block despite simulated rule evaluation. The product then specified installed native curl with its normal identity, exact raw stdin, bounded execution, no redirects or automatic retries, and ACK checking. | Simulation did not establish live compatibility. Naming the tested client reduced ambiguity in this project's contract; it does not justify a universal curl requirement. |
| A later run used curl inside an interpreter but did not request network approval for the enclosing command. It failed locally with curl exit 7/HTTP 000 at the proxy boundary. A credential-free diagnostic with the same command structure failed in the default sandbox and reached the protected site in an approved network context. | Tool selection and execution permission are separate prerequisites. This reported local connection failure is distinct from a remote 403, refusal or lost ACK. A curl prefix permission alone did not establish permission for the interpreter invocation. |
| The handoff was revised to require network permission for the complete delivery command, including an enclosing interpreter, before one submission. | State material permissions before dispatch. If permission is unavailable or denied, stop before delivery; changing tools does not authorize the denied outcome. |

These observations refine the execution contract. They do not ask the Lab to
change a provider, edge policy, product, host permission or release procedure.

## One connecting principle

**Use the smallest supported native path, state its tools and permissions
explicitly, and verify completion.**

Here, "smallest" means sufficient for the task and its required checks, not the
fewest checks. "Native" means an existing tool supported in the actual host and
destination context, using its normal identity. It is not a tool brand or an
instruction to invent a worker, install a client or impersonate another client.

- **Plain/raw describes the exchange and representation.** Supply complete task
  input and a sufficient return format; specify exact bytes where required.
  Raw text is THOUGHT's project choice, not a ban on structured data.
- **Native describes the supported means.** Name a client when compatibility
  materially constrains the path; report an unavailable prerequisite instead
  of silently substituting one.
- **Explicit describes the execution contract.** State material tool,
  destination, permission, representation and completion requirements, including
  the command or process that actually executes. Preserve the Agent's artistic
  choices within the work's bounds.

This connects P-04's representation boundaries, P-05's final execution context,
P-06's failure/completion evidence and P-07's simple acquisition contract. Their
original scopes remain intact; P-05 does not require introducing workers.

The retained Pulse study reports successful document acquisition using Python's
standard-library HTTP client. It is counterevidence to "always curl," not a
matched comparison with THOUGHT. Static public GET acquisition and authenticated
state-changing delivery have different contracts. Native tools grant no authority.

## Completion and unresolved claims

OPS reports that two fresh staging canaries, one Codex and one Claude, returned
after the final staging publication. OPS checked actual sender ACKs, exact saved
records and browser reload/Load exports. Those are reported completion checks
for those two runs, not direct Lab verification, production promotion or proof
of full instruction compliance, provider/model identity, Agent intention or
artistic quality.

OPS also reports a plain THOUGHT refactor: complete creative brief, one raw-text
return, and App-owned validation, representation, storage and display. The
operator reported faster runs. No controlled timing, reliability or cost study
was conducted. Multiple changes preceded the later success; their individual
effects are not isolated. Stability remains a design aim, not a measured result.

## Method review and next action

The Lab's evidence distinctions helped this editorial review keep reported
client compatibility, local permission failure and external completion separate.
The Pulse comparison prevented a tool-specific lesson from becoming universal.
The retrospective method cannot recover absent runtime identities, raw evidence
or comparative measurements; its time cost and causal benefit were not measured.
The change is a connecting Guidance paragraph, with no new framework,
runner or numbered practice needed.

Revisit the guidance when a host lacks the stated prerequisites, another client
is supported, representation requirements change, or a declared comparison
contradicts the expected benefit. Preserve uncertain commit states and the
project's recovery rules; no arbitrary replay follows from a failure summary.

Initially prepared as a local draft on 2026-10-01 without publication authority.
The operator subsequently authorized publication of this sanitized documentation
item that day. This dated addition supersedes the initial local-only status;
it does not authorize private evidence publication or further runtime actions.

Next action: revisit the scoped guidance when relevant new evidence is available.
This contribution initiates no live trial, product repair, permission change or
release action.
