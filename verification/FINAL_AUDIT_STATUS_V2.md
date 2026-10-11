# Final audit status — 2026-10-11

Not an all-pass/submission-ready claim.

- 43 independently checked receipt hashes: exact v2 contract, FINALIZED, successful GenVM return, at least three agree votes. See EVIDENCE_INTEGRITY_V2.json.
- Four additional auxiliary-wallet live forbidden calls preserve the complete exposed affected graph (counts, charter, invoice, intent, ticket): wrong consumer, wrong revoker, re-assessment after consumption, duplicate consumption. See COMPLETE_STATE_AUDIT_V2.json.
- 21 local production-contract regression tests passed. Semantic classification is mocked for deterministic branch coverage; frontend checks are static, not browser signing tests. Cache permission warning only.
- TypeScript and Vite production build passed. Bundle-size warning remains; frontend source/build unchanged from the user-performed six-call demo.
- The six user-signed calls remain separately attributable to the human user; no agent main-wallet signing was performed. Readbacks verify charter 3 REVOKED/spent40, intent 4 CONSUMED, invoice 4 consumed, payment_verified=false.

## Still open

1. Exact live budget-consumption conflict: intent 1 is AUTHORIZED, intent 2 remains REVIEW_REQUIRED. One renewed bounded assessment of the same intent/policy/invoice (`0x65baf3278c6d346812063b52f70452633633233fc4319cb39c5864928400193b`) also finalized REVIEW_REQUIRED. No authorization, invoice consumption or budget effect was granted; complete relevant graph equality was verified outside the allowed uncertain intent state. Local mocked coverage cannot replace the missing live transition. No further automatic verdict-shopping retries are scheduled.
2. Independently recorded frontend signing prompts, pending/finality/readback display and browser-adversarial transitions: user-performed six-call chain proof exists, but the supplied explorer screenshot alone does not record those UI stages. The connected agent browser has no injected wallet. UI concurrency/account-switch/readback-error behavior is not fully executed-browser tested; static guards do not close that gate.
3. No actual payment executor or independently authenticated invoice/delivery verification is implemented. These are explicitly excluded from the current control-plane scope; the executor protocol is documentation, not deployed payment enforcement.

`node verification/audit-evidence-integrity-v2.mjs` passes receipt/no-mutation/fail-closed integrity. `node verification/check-v2-evidence.mjs` intentionally fails at the missing budget-conflict proof. That failure is a release gate, not a discarded test.

All new tx links and evidence are consolidated in E2E_FULL_REPORT_V2.md. Do not claim every steward requirement is conclusively demonstrated until the open proof obligations are closed.
