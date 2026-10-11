# External payment executor contract (v2)

AgentSpendFirewall is an authorization control plane, not a payment system. `spent` means consumed authorization budget, NOT actual money spent. `CONSUMED` means one invoice-bound ticket was consumed by the named Agent, NOT that the payee was paid. The `asset` field is a committed identifier; no token decimals, balance or transfer are verified by this contract.

## Required integration

An external executor must be explicitly configured for one trusted network and AgentSpendFirewall deployment. It must not accept caller-supplied contract/network endpoints as payment authority. Its durable uniqueness key must include `(network, firewall_contract, authorization_sha256)` and a unique `(network, firewall_contract, invoice_id)` constraint. Digest alone is not a cross-deployment identifier.

1. Accept a candidate intent ID as a locator, never as payment approval.
2. Read from the configured authoritative network: identity must be AgentSpendFirewall v2 / invoice-single-use-agent-spend-v2. Wait for the consume transaction to be FINALIZED and verify successful GenVM execution. Confirm transaction target/method/sender are the configured firewall, consume_authorization and intent's named Agent; do not trust a screenshot, uploaded receipt or non-finalized state.
3. Read get_intent, get_invoice, get_charter and get_execution_receipt at finalized state. Require CONSUMED, invoice.consumed=true, invoice.intent_id equal to intent ID, matching invoice/charter IDs, and equality of amount/asset/payee/agent/auth digest across records. Ticket schema must be agent-execution-ticket-v2. Invoice publisher must equal the charter payee; packet digest must match ticket. Verify the v2 authorization hash over its canonical field sequence in the contract. None of these checks proves delivery or independent invoice truth.
4. Check local executor policy: approved asset/network mapping, exact unit/decimal interpretation, intended payee, maximum payment, sufficient funds, and payee-attestation risk acceptance. Never infer settlement asset from a free-form address alone. No transfer may happen while these checks are unresolved.
5. In one durable database transaction, reserve the ticket key AND invoice key and create an outbox record with the exact transfer parameters and a stable payment-provider idempotency key. A second worker/request must return the existing payment status, not make another transfer.
6. Submit once using an idempotent payment rail or a single replay-protected signed transaction. Record the provider reference / transaction hash before any retry. On timeout or unknown submission result, reconcile that same reference; do NOT create another transfer or consume again. If the rail cannot guarantee idempotent submission/reconciliation, the integration is unsafe and must remain disabled.
7. Mark payment complete only after external payment finality. Keep that separate from on-chain CONSUMED. Failed execution does not restore authorization budget or release the invoice; retry only the same durable executor job. A failed ticket can remain an unpaid authorization indefinitely; operational recovery is executor-owned, not an on-chain refund feature.

## Revocation cutoff

Principal revocation before consume causes consume to fail. Once consume is finalized, the ticket is irrevocable under this protocol and may execute even after later charter revocation. There is no cross-chain atomic cancellation. An executor offering stronger cancellation must implement its own authoritative cancellation state machine and cannot claim that this firewall alone supplies it.

## Invoice trust boundary

PAYEE_ATTESTED_ONLY authenticates the sender and stored declaration. The model classifies declared narrative, not delivery truth or existence of external artifacts. `artifact_sha256` is only a declared replay identifier; it is not fetched or checked against external bytes. Independent invoice verification, if required, must be added by an explicitly trusted provider and enforced by executor policy. No such provider or deployed external executor is claimed in this release.
