# THOUGHT runtime-model acquisition diagnostic

- Study date: 2026-09-20; portable derivative v1.
- Method: retrospective diagnostic case review.
- Status: diagnostic complete; supported acquisition/product repair unresolved.
- Related record: [THOUGHT collection](../README.md).
- Shared method: [Guidance](../../../GUIDANCE.md).

## Question and artistic boundary

Why did a real Codex run stop after claim with `AGENT_START_FAILED` /
`Model unavailable` while a deterministic unavailable-runtime test passed?

The run never reached creative input or produced a work. It supplies no evidence
of intentional participation, interpretation or artwork quality. This was not
a preregistered experiment, controlled comparison or live rerun.

## Evidence and access

This account derives from OPS inspection and source-review findings recorded in
Applications. Original evidence is privately retained and unavailable here.
Private task/turn/run/command locators are omitted. The source documents were
uncommitted; no exact original deployed commit or handoff hash was established.

### Command behavior, attributed to OPS inspection

The first command encountered a sandbox network failure. A subsequent command
claimed the run then used this retained nonsecret lookup excerpt:

```text
runtime_model=claim.get('model') or claim.get('runtimeModel') or claim.get('runtime',{}).get('model') or claim.get('agent',{}).get('model')
```

When no value was present it posted the missing-model failure and exited `0`.
No host-metadata lookup tool call was observed. The final response reported claim
success but no creative result/receipt. Exit `0` establishes command completion,
not THOUGHT completion.

OPS separately observed stored host context `model: gpt-5.5`, `effort: low`.
That establishes stored metadata, not original agent access or provider
attestation.

### Recorded source-review findings

The handoff required a nonempty host-issued model before readiness. The App
claim service supplied run/control information, not executing-host identity.
The deterministic fixture supplied `gpt-5-lab`; its unavailable-runtime case
intentionally posted failure and checked fixture state `failed`.

A passing test established expected simulated failure handling, not actual
model acquisition. An optional model in the result schema did not override
the readiness requirement. Accepting unknown identity would change that contract.

These are findings about inspected source, not an immutable deployed-build
attestation. No universal absence of a supported host lookup was established.

## Diagnosis and competing conclusions

The fixture supplied a value that the real command did not demonstrate how to
obtain. The real lookup searched App data while the requirement concerned
the executing host. These exercised different acquisition paths.

This explains why fixture PASS and product failure are not contradictory.
It does not establish why the Agent omitted a lookup, whether a supported
lookup was available, or a causal effect of wording, model or policy.

Stored host values contradict a blanket claim that identity did not exist;
they do not settle agent access. A later successful canary would not erase
this failed observation or identify its exact historical environment.

## Method evaluation

Evidence separation helped distinguish failure handling from acquisition.
Actual-command inspection exposed the lookup and bounded the summary's claim.
Keeping source ownership explicit avoided inventing a model or silently
weakening the readiness requirement.

The original investigation omitted a completed study record and evaluation of
the Lab method. Operator feedback prompted retrospective recording and this
feedback into Guidance. No time saving, control comparison or causal benefit
of the foundation was measured. A tested fix is still absent.

## Transfer and checkpoint

Provisional lesson: fixture-supplied capabilities alone do not establish
real-Agent acquisition. Record/test the acquisition path separately when it
matters. See [findings](../../../findings/REGISTER.md).

Support is one failed run plus source comparison, not replicated generality.
Revisit the case diagnosis if original evidence shows real host acquisition;
later evidence of a shared supported acquisition mechanism can close the
project gap without changing the original record.

Applications owns the technical follow-up. Guessing a model or treating
configured/App data as runtime fact does not establish acquisition.
This diagnostic fixes no product and waives no release requirement.

For the central Lab, the next task is a usable practice/record handoff and a
proposed practice-led inquiry, not THOUGHT repair.
