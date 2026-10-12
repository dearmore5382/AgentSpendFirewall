# Second steward review — exact v3 remediation map

This response addresses the second review against the **current v3 deployment**, not the superseded contract referenced by the original submission.

- Current contract: [`0xb13E965e06Bf563748A32f0f4ae8FE1D1b6E17d3`](https://explorer-studio.genlayer.com/address/0xb13E965e06Bf563748A32f0f4ae8FE1D1b6E17d3)
- Exact deployed/source parity: [DEPLOYMENT_V3.json](DEPLOYMENT_V3.json)
- Full receipts and authoritative readbacks: [LIVE_RUN_V3.json](LIVE_RUN_V3.json)
- Consolidated 31-transaction report: [E2E_FULL_REPORT_V3.md](E2E_FULL_REPORT_V3.md)

## 1. Duplicate invoice authorization is prevented at invoice level

[`request_intent`](../contracts/AgentSpendFirewallV3.py#L125) rejects a second intent whenever `invoice_intents[invoice_id] != "NONE"`, independently of nonce. The first accepted intent permanently writes the invoice-to-intent binding before incrementing the counter.

Live adversarial transactions using different nonces against the same invoice:

- While first intent is pending: [`INVOICE_ALREADY_HAS_INTENT`](https://explorer-studio.genlayer.com/tx/0x541c3d748ac32bac0c31d9399c63ee32bae502db285d7817b5ffa5d0f9e803de)
- After it is authorized: [`INVOICE_ALREADY_HAS_INTENT`](https://explorer-studio.genlayer.com/tx/0xfd87ffa0593c6193de40388e6efb550273b2a85307437ec45c0b3238084aca94)
- After it is consumed: [`INVOICE_ALREADY_HAS_INTENT`](https://explorer-studio.genlayer.com/tx/0xf56787cf73570e690d3509ab767f1a669af812a3a99bc12d9adc0771b4811541)

All three finalized successfully and left counters, budget, and charter state unchanged.

## 2. Partial and recurring payments are explicitly unsupported

Each invoice has one immutable whole amount and one intent. [`get_invoice`](../contracts/AgentSpendFirewallV3.py#L177) reports `partial_payments_supported: false`. Consumption atomically marks the whole invoice consumed and adds its whole amount to `charter_spent`; double consumption returns `AUTHORIZATION_NOT_ACTIVE`.

- Whole invoice consumption: [`CONSUMED`](https://explorer-studio.genlayer.com/tx/0x73065e36e8dfa5a7fc5d89eed8e843dadd1eca26f286874137ed97ce4d17355b)
- Double-consume rejection: [`AUTHORIZATION_NOT_ACTIVE`](https://explorer-studio.genlayer.com/tx/0x25fd7c966cc2f0d378fe00f9d2c8726a3a2ba93f68fbab4e6dd2b7f3e6ed2b1c)

## 3. Exhausted-budget conflict is live-proven

Two distinct invoices were independently authorized against a 60-unit lifetime cap. A consumed 40; B then returned `BUDGET_EXCEEDED`, changed to `STALE_BUDGET`, remained unconsumed, and `spent` remained 40.

- Consume A: [`CONSUMED`](https://explorer-studio.genlayer.com/tx/0xfa27ae39c83ec3693109b5d69e12d4f7bc45ece6b74d48a50ec67671f49e56ae)
- Consume B: [`BUDGET_EXCEEDED`](https://explorer-studio.genlayer.com/tx/0xbe51a41c712e65a04fa5185374416335d012bc4143bc7d1017b7a4c499f2ba56)

## 4. Revocation and role restrictions are live-proven

Revocation before consumption wins: the intent becomes `REVOKED`, spent remains zero, and no execution ticket exists.

- Revoke: [`CHARTER_REVOKED`](https://explorer-studio.genlayer.com/tx/0x0d6bb7e7601a252d95919887059d65b521d6251b8ceb641f305345c7545f1e69)
- Attempted consumption: [`CHARTER_NOT_ACTIVE`](https://explorer-studio.genlayer.com/tx/0x5746062772785c9b9743c45facbe94c4c793a5372cda941c74a0aff4839a9c6f)

Wrong publisher, requester, consumer and revoker were also exercised in the consolidated report with complete-state no-mutation assertions.

## 5. External payment enforcement is accurately scoped

The contract does not transfer or verify funds. `CONSUMED` produces a single-use authorization ticket, not a payment receipt. Both invoice and ticket expose `payment_verified: false`. The required executor behavior—authorization digest binding, durable invoice/ticket idempotency, chain finality, atomic claim, outbox and reconciliation—is specified in [EXECUTOR_PROTOCOL_V2.md](../EXECUTOR_PROTOCOL_V2.md). No deployed payment executor is claimed.

## 6. Evidence provenance is explicit

The designated payee signs publication, but this only proves the sender role. Records report `PAYEE_ATTESTED_ONLY` and `artifact_digest_verified: false`; they are not described as independently authenticated commercial documents.

## Verification result

- Deployed code equals repository source byte-for-byte.
- 31 fresh v3 StudioNet transactions finalized.
- 53/53 assertions passed; zero failed.
- Every preserved transaction has a successful GenVM return and at least three validator `agree` votes.
- Two auxiliary role wallets performed automated tests; the deployer wallet was not used.
