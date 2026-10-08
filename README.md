# AgentSpend Firewall

AgentSpend Firewall is a GenLayer control plane for autonomous-wallet spending. A principal seals a bounded purpose policy; a designated payee publishes a canonical invoice; the agent requests a nonce-bound intent; GenLayer consensus classifies the invoice against the sealed policy; and the agent may consume the resulting authorization exactly once.

The contract does **not** custody or transfer tokens. It produces and consumes an auditable authorization while enforcing roles, per-intent and lifetime limits, revocation, source binding, artifact replay protection and nonce replay protection.

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

Current StudioNet deployment: `0x7D71F1078580e9aF0D39291d3D8195Bb08903F38` (verify `get_contract_version` before every write).

Live dApp: https://agent-spend-firewall.pages.dev

## Source-bound evidence

The decision source is not a mutable URL or model memory. It is the canonical principal policy plus the canonical payee invoice stored in contract state. Both are schema-checked, bounded, normalized and hashed before assessment. See [SPEC.md](SPEC.md) and [verification/TEST_RESOURCE_MANIFEST.json](verification/TEST_RESOURCE_MANIFEST.json).

## Evidence status

Local direct-contract evidence is recorded in [verification/LOCAL_RESULTS.md](verification/LOCAL_RESULTS.md). The completed StudioNet lifecycle, explorer links and state assertions are in [verification/E2E.md](verification/E2E.md) and [verification/LIVE_RUN.json](verification/LIVE_RUN.json). No fabricated on-chain evidence is included.
