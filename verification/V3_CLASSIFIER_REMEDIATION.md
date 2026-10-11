# v3 classifier remediation candidate — deployment required

The v2 deployment remains immutable and its evidence remains valid. This document describes the undeployed v3 candidate in `contracts/AgentSpendFirewallV3.py`.

## Diagnosed cause

v2 converts three materially different outcomes into identical `UNKNOWN / INSUFFICIENT`: a valid uncertain semantic verdict, malformed model output, and provider/runtime exception. Because validators compare only purpose and confidence, two technical failures can agree as if they were a valid semantic decision. The prompt also stated provenance limitations without explicitly telling the model those limitations must not reduce confidence in classifying the *declared purpose*. The live receipt for the renewed conflict assessment contains a provider `SocketTimeoutError` retry and ultimately returned REVIEW_REQUIRED; it cannot prove whether the decisive UNKNOWN was semantic or technical because v2 erased that distinction.

## v3 changes

- Adds diagnostic outcomes: `CLASSIFIED`, `SEMANTIC_UNCERTAINTY`, `INVALID_MODEL_OUTPUT`, `MODEL_CALL_FAILED`.
- Technical failures/malformed schema cannot satisfy validator equivalence.
- Technical retry is bounded to two calls. A valid uncertain verdict is never retried inside `_observe`.
- Requires strict keys/types/exact citation and independent validator agreement on purpose, confidence and diagnostic.
- Clarifies that SUFFICIENT concerns only purpose classification; it never proves invoice authenticity, delivery or payment.
- Retains permanent invoice binding, whole-invoice consumption, role checks, budget cap and external-executor boundary.
- Changes machine identity to version `3`, schema `diagnostic-single-use-agent-spend-v3`; frontend must refuse v2/v3 mismatch until updated after deployment.

## Verification

`python -m pytest -q`: 34 passed. `python -m py_compile`: passed. `genvm-lint`: passed (3 checks). Production frontend build: passed, with the existing bundle-size warning. Added tests cover malformed/extra/wrong-type output, fake citation, bounded technical retry, no retry for valid uncertainty, recovery from one malformed response, independent disagreement, v3 budget conflict and fail-closed uncertainty. This is local Direct Mode evidence; classification is mocked where deterministic branch coverage is required. It is not live GenVM evidence.

## Required next gate

Deploy this exact v3 source with the main wallet, verify deployed bytes and identity, update frontend address/version, then run a fresh two-invoice conflict lifecycle using auxiliary wallets. Do not reuse v2 transaction evidence as v3 proof.

