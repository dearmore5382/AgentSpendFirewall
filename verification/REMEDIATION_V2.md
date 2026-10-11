# Invoice-level single-use remediation

Status: v2 deployed with exact source parity; production updated. Live anti-duplicate and role checks passed. Budget conflict remains blocked by REVIEW_REQUIRED after one bounded retry. Browser read-only CONSUMED state matches chain, but signing is blocked by missing injected wallet. Do not resubmit as fully verified yet. See E2E_FULL_REPORT_V2.md and PRODUCTION_BROWSER_V2.md. Existing v1 evidence is historical.

## Requirement mapping

| Steward requirement | Implementation | Verification boundary |
| --- | --- | --- |
| Different nonces allow duplicate invoice spend | One permanent invoice→intent binding, plus invoice consumed marker rechecked at assessment and consumption | Direct production-contract tests cover pending, authorized, denied, unclear and consumed; v2 live tests still required |
| Bounded partial payments or prevention | Partial payments explicitly unsupported; one whole-invoice intent only; no reservation release | New nonce never resets invoice; uncertain assessment retries the same intent |
| Explain external executor enforcement | EXECUTOR_PROTOCOL_V2.md specifies finalized ticket, domain binding, graph validation, durable idempotency, failure/recovery and revocation cutoff | Reference protocol, no deployed payment executor or verified transfer claimed |
| Separate payee attestations from independent facts | get_invoice and get_execution_receipt expose PAYEE_ATTESTED_ONLY and payment_verified=false; invoice view has artifact_digest_verified=false | No independently authenticated invoice/delivery proof is implemented or claimed |
| Full frontend→contract demonstration | UI requires v2, handles string/object tx responses, checks active account, refreshes authoritative invoice/ticket after consumption | Cannot reuse SDK-only or v1 evidence as full signed browser demonstration |

## Important behavior

Reservation is permanent for every accepted intent, including DENIED, STALE_BUDGET and REVOKED. This trades flexibility for no duplicate invoice authorization. REVIEW_REQUIRED retries the existing intent. An over-limit/rejected request does not reserve the invoice. A newly fabricated invoice with a different declared artifact hash is not proven to be a distinct real-world invoice; principal trusts the designated payee and must apply external reconciliation. The contract protects registered invoice identity, not real-world invoice truth.

Consumed tickets are irreversible accounting receipts, not token transfers. Revocation blocks consumption before it happens; it does not cancel a previously consumed ticket. The receipt remains available after revocation for external recovery without reconsumption. External executor must have durable exactly-once handling and cannot be assumed integrated merely because a ticket exists.

## Release blockers

1. Principal wallet deploys v2 (no constructor workflow privilege).
2. Compare actual deployed source bytes with this source and identity version/schema.
3. Run fresh auxiliary-wallet live lifecycle and attacks; record actual successful GenVM execution, finalized consensus and readbacks.
4. Complete a signed production-browser lifecycle for charter, publication, request, assessment, consumption and revocation; record UI pending/finality/readback plus adversarial rejection.
5. Update production default to verified v2, then push consolidated evidence and resubmission notes. Never claim full completion before these gates.
