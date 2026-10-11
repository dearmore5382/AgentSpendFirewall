# AgentSpend Firewall

Current deployment: **v3 source-verified and live-tested on StudioNet**. The diagnostic classifier separates semantic uncertainty from malformed/failed model output, while preserving single-use invoice and budget enforcement. See [consolidated v3 evidence](verification/E2E_FULL_REPORT_V3.md) and [external executor protocol](EXECUTOR_PROTOCOL_V2.md).

AgentSpend Firewall is a GenLayer control plane for autonomous-wallet spending. A principal seals a bounded purpose policy; a designated payee publishes a canonical invoice; the agent requests a nonce-bound intent; GenLayer consensus classifies the invoice against the sealed policy; and the agent may consume the resulting authorization exactly once.

The contract does **not** custody, transfer tokens or verify payments. It consumes at most one whole-invoice authorization per registered invoice, regardless of nonce. Partial payments and invoice reservation release are not supported. `spent` is consumed authorization budget, not verified money spent. External executors must enforce the durable invoice/ticket idempotency protocol before any actual transfer.

## Why this needs an Intelligent Contract

Hard invariants stay deterministic. The only nondeterministic step is semantic purpose classification of a payee-authenticated invoice against a principal-authored taxonomy. Validators independently re-run that classification and compare the fields that affect the consequence. Ambiguous output fails closed as `REVIEW_REQUIRED`.

## Roles

- **Deployer:** deploys only; receives no workflow privilege.
- **Principal:** creates and may revoke its own charter.
- **Payee:** publishes an invoice for a charter naming that payee.
- **Agent:** requests and consumes authorization for a charter naming that agent.
- **Assessor:** any wallet may call `assess_intent`.

One auxiliary wallet may be both Agent and Payee. For the clearest live proof, use one wallet as Principal and a different wallet as Agent + Payee. A reviewer can create a fresh charter with any addresses they control; no allowlist or deployer action is required.

## Run locally

```bash
python -m pip install -r requirements-dev.txt
python -m pytest -q
npm install
npm run build
npm run dev
```

Deploy `contracts/AgentSpendFirewall.py` on StudioNet, then paste its address into the UI. Never commit private keys or API tokens.

Current v3 StudioNet deployment: `0xb13E965e06Bf563748A32f0f4ae8FE1D1b6E17d3`. Historical deployments are retained only as provenance; the frontend refuses writes unless the exact v3 identity/schema matches.

Live dApp: https://agent-spend-firewall.pages.dev

## Source-bound evidence

The decision input is the canonical principal policy plus a PAYEE_ATTESTED_ONLY invoice declaration stored in contract state. Both are schema-checked, bounded, normalized and hashed. Sender authentication is not independent verification of invoice facts, delivery, artifact bytes or payment. The artifact hash is a payee-declared replay identifier, not a fetched verified artifact. Principal trusts the designated payee; payee collusion or newly fabricated identities cannot be detected by narrative classification alone. See [SPEC.md](SPEC.md) and [verification/TEST_RESOURCE_MANIFEST.json](verification/TEST_RESOURCE_MANIFEST.json).

## Evidence status

Local direct-contract evidence is recorded in [verification/LOCAL_RESULTS.md](verification/LOCAL_RESULTS.md). The completed StudioNet lifecycle, explorer links and state assertions are in [verification/E2E.md](verification/E2E.md) and [verification/LIVE_RUN.json](verification/LIVE_RUN.json). No fabricated on-chain evidence is included.
