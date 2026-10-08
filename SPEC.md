# Proof obligation and threat model

## Proof obligation

An intent may reach `CONSUMED` only if all of the following remain true at consumption time:

1. the charter is active;
2. the caller is the charter's named agent;
3. the invoice was published by the charter's named payee;
4. the invoice amount is positive, within the per-intent maximum, and fits the remaining lifetime budget;
5. the artifact hash and `(charter, nonce)` have not been used before;
6. consensus classified the bounded canonical invoice as one of the principal's declared purposes with a sufficient confidence boundary;
7. the supplied authorization digest exactly matches the charter, intent, agent, payee, asset, amount and nonce;
8. the authorization has not already been consumed.

## Trusted sources

| Source | Authentication | Binding |
|---|---|---|
| Purpose taxonomy | transaction sender becomes Principal | canonical JSON + SHA-256 stored on-chain |
| Invoice facts | only named Payee may publish | charter reference + canonical JSON + packet SHA-256 + unique artifact SHA-256 |
| Spend intent | only named Agent may request | invoice ID + charter-scoped unique nonce |

No web search, mutable URL, user-supplied authority claim or model memory is treated as evidence.

## Nondeterministic boundary

The model sees only canonical policy and invoice JSON. Embedded text is explicitly treated as untrusted data. Output is restricted to `purpose`, `confidence_boundary`, and exactly one citation matching the invoice `line_id`. Invalid shape, undeclared purpose, citation mismatch, prompt failure or insufficient confidence normalizes to `UNKNOWN / INSUFFICIENT` and therefore `REVIEW_REQUIRED`.

The validator re-executes classification and compares `purpose` and `confidence_boundary`, the two fields controlling authorization. Citations are deterministically constrained before comparison.

## Deterministic boundaries

Role checks, address validation, size/schema limits, source/reference binding, replay sets, numeric limits, authorization digest, revocation, state transitions and budget accounting are ordinary deterministic code.

## Lifecycle

`PENDING_ASSESSMENT → AUTHORIZED → CONSUMED`

Alternate terminal or guarded states: `DENIED`, `REVIEW_REQUIRED` (retryable), `REVOKED`, and `STALE_BUDGET`.

## Explicit limitation

This contract is an authorization/accounting firewall, not a token escrow. Integrators must make their executor or smart-account module require the emitted/stored authorization before transferring value. `asset` is an identifier committed into the digest; this version does not call an external token contract.
