# Remediation response — not ready to resubmit yet

1. Invoice-level protection: one registered invoice permanently binds one whole-amount intent. A second nonce cannot create a second authorization. Consume checks and marks the invoice, preventing duplicate budget consumption. Partial payments are unsupported; REVIEW_REQUIRED retries the same intent.
2. External enforcement: EXECUTOR_PROTOCOL_V2.md defines configured network/contract binding, successful finalized consume verification, ticket/record graph checks, durable invoice and authorization uniqueness constraints, an idempotent payment outbox, reconciliation and explicit revocation cutoff. CONSUMED/spent are not payment proof. No external executor deployment or token transfer is claimed.
3. Source trust: invoice views and execution tickets explicitly expose PAYEE_ATTESTED_ONLY and payment_verified=false. Artifact digest is declared, not fetched/verified. Model classifies narrative purpose, not invoice truth.
4. Evidence: direct production-contract regression tests cover the original different-nonce exploit, retry/denial states, double consume, mismatched digest, role checks, revocation and budget conflict. Local mocks are disclosed. Fresh v2 deployment, successful live GenVM/finality/readbacks and the full production-browser signing journey remain required. v1 evidence cannot close these gates.

Do not paste a completion claim until verification/REMEDIATION_V2.md release gates are satisfied.
