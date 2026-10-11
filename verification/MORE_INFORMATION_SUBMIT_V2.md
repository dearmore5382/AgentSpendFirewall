# Remediation response — not ready to resubmit yet

Six user-signed lifecycle hashes for steward review: https://github.com/dearmore5382/AgentSpendFirewall/blob/main/verification/STEWARDS_SIX_TX_V2.md

Latest audit: 43 finalized successful GenVM receipts verified; four additional forbidden role/terminal calls preserve the complete exposed graph. Local tests 21/21. The renewed bounded assessment of budget intent 2 again returned REVIEW_REQUIRED, without authorization or economic mutation. The strict release checker therefore still fails the missing budget-consumption conflict proof. See FINAL_AUDIT_STATUS_V2.md, EVIDENCE_INTEGRITY_V2.json and E2E_FULL_REPORT_V2.md. No all-pass claim is made.

1. Invoice-level protection: one registered invoice permanently binds one whole-amount intent. A second nonce cannot create a second authorization. Consume checks and marks the invoice, preventing duplicate budget consumption. Partial payments are unsupported; REVIEW_REQUIRED retries the same intent.
2. External enforcement: EXECUTOR_PROTOCOL_V2.md defines configured network/contract binding, successful finalized consume verification, ticket/record graph checks, durable invoice and authorization uniqueness constraints, an idempotent payment outbox, reconciliation and explicit revocation cutoff. CONSUMED/spent are not payment proof. No external executor deployment or token transfer is claimed.
3. Source trust: invoice views and execution tickets explicitly expose PAYEE_ATTESTED_ONLY and payment_verified=false. Artifact digest is declared, not fetched/verified. Model classifies narrative purpose, not invoice truth.
4. Evidence: direct production-contract regression tests cover the original different-nonce exploit, retry/denial states, double consume, mismatched digest, role checks, revocation and budget conflict. Local mocks are disclosed. Fresh v2 deployment, successful live GenVM/finality/readbacks and the full production-browser signing journey remain required. v1 evidence cannot close these gates.

## Current verified progress (not a full-completion claim)

Update: the user signed six additional main-wallet lifecycle calls: create charter 3, publish invoice 4, request intent 4, assess AUTHORIZED, consume CONSUMED, revoke CHARTER_REVOKED. All six independently verified FINALIZED with successful GenVM and at least three agree votes. Current readbacks: charter REVOKED/spent 40; intent CONSUMED; invoice consumed; payment_verified=false. Full hashes/receipts are in E2E_FULL_REPORT_V2.md and USER_WALLET_LIFECYCLE_V2.json. The same wallet fulfills all three roles in this demo. Frontend signing is user-performed; the explorer image alone does not record intermediate UI transitions. Budget conflict remains blocked. The paragraph below describes the earlier auxiliary-wallet checkpoint.

v2 is deployed with byte-for-byte source parity. 32 transactions finalized with successful GenVM return and at least three agree votes; 46 assertions passed. Initial REVIEW_REQUIRED results are preserved (three historical failed expectations). Happy consumption, different-nonce invoice guards, wrong-role/digest/double-consume rejection, revocation-before-consume and irreversible consumed tickets were checked live. Budget conflict remains blocked because intent 2 stayed REVIEW_REQUIRED after one bounded retry. Production UI readback matches CONSUMED, but full browser signing remains blocked by no injected wallet.

Consolidated report with every tx and receipt:
https://github.com/dearmore5382/AgentSpendFirewall/blob/main/verification/E2E_FULL_REPORT_V2.md

Do not paste a completion claim until verification/REMEDIATION_V2.md release gates are satisfied.
