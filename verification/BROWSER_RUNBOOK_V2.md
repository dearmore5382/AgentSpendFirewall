# Required v2 production-browser evidence (not executed yet)

This checklist is a procedure, not proof of success. Use only the replacement v2 address after source parity is established. Keep the deployer out of workflow transactions. Principal = auxiliary wallet A; Agent+Payee = auxiliary wallet B. Never inject a fake ethereum provider or treat SDK-only writes as browser-signed evidence.

1. Open production, confirm v2 address and connect A. Fill B as Agent and Payee; seal charter with max 50/cap 60. Sign in wallet. Record transaction hash, successful GenVM execution and FINALIZED status. UI must show actual ACTIVE charter, A principal, B agent/payee and spent 0 after readback/reload.
2. Switch to B and reconnect. Publish 40-unit invoice. UI/readback must expose PAYEE_ATTESTED_ONLY, payment_verified false, artifact_digest_verified false and no intent binding. Capture finalized TX and invoice ID.
3. Request first nonce. UI/readback must show one PENDING_ASSESSMENT intent and invoice→intent binding. Request another nonce against the same invoice: finalized refusal INVOICE_ALREADY_HAS_INTENT, no intent count or budget change. A must be refused as requester and invoice publisher.
4. Assess the existing intent, sign and wait for actual validator consensus. Capture successful GenVM, finalized TX and actual state. AUTHORIZED needs declared purpose/citation and nonempty digest; REVIEW_REQUIRED is not a passing happy path.
5. Attempt consume using A and wrong digest using B; neither may change state/budget. With B consume the actual loaded digest: CONSUMED, invoice.consumed true, spent 40, matching execution ticket, payment_verified false. Reload page and intent to verify persistence. A button click alone is not success.
6. Different nonce and repeated consume must both fail without additional budget consumption. UI must not mislabel a finalized rejection as success.
7. In a fresh charter create/authorize an intent, revoke using A before B consumes. Capture revoked charter, failed consumption, zero budget and no executable ticket. B cannot revoke. Capture account-switch behavior.
8. In a fresh charter create two distinct 40-unit invoices against cap 60, assess both, then consume A and B in order. First succeeds; second is STALE_BUDGET, no invoice consumption, budget 40. Keep UI and authoritative RPC readbacks together.

For every row save browser observations/screenshots, signed hash, signer, exact deployment, GenVM execution, consensus/finality and authoritative before/after records. Browser availability or a missing wallet extension is a blocker, not a reason to label this checklist completed. Link the final evidence into one E2E Markdown report only after actual execution.
