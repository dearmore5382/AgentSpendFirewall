# StudioNet E2E evidence matrix

This matrix was completed on 2026-10-08. Full transaction and post-state evidence is in `LIVE_RUN.json`; representative links are summarized in `E2E.md`.

| Case | Signer | Expected result / post-state | Evidence |
|---|---|---|---|
| Deploy | deployer only | version = `AgentSpendFirewall v1`; counts zero | [contract](https://explorer-studio.genlayer.com/address/0x7D71F1078580e9aF0D39291d3D8195Bb08903F38), verified readback in `DEPLOYMENT.json` |
| Create charter | Principal auxiliary wallet | new charter `ACTIVE`, principal matches signer | pending live run |
| Invalid publisher | Principal or unrelated wallet | invoice count unchanged | pending live run |
| Publish invoice | Payee auxiliary wallet | publisher matches Payee; packet digest present | pending live run |
| Artifact replay | Payee auxiliary wallet | `ARTIFACT_ALREADY_USED`; count unchanged | pending live run |
| Per-intent failure | Agent auxiliary wallet | `PER_INTENT_LIMIT_EXCEEDED`; intent count unchanged | pending live run |
| Request intent | Agent auxiliary wallet | `PENDING_ASSESSMENT`; nonce bound | pending live run |
| Nonce replay | Agent auxiliary wallet | `NONCE_ALREADY_USED`; count unchanged | pending live run |
| Happy assessment | any wallet | `AUTHORIZED`; declared purpose and digest present | pending live run |
| Ambiguous / hostile source | any wallet | `REVIEW_REQUIRED` or `DENIED`, never authorized | pending live run |
| Wrong digest | Agent auxiliary wallet | remains `AUTHORIZED`, spend unchanged | pending live run |
| Conflict / revoke race | Principal then Agent | consume returns inactive; intent `REVOKED`; spend unchanged | pending live run |
| Happy consume | Agent auxiliary wallet | `CONSUMED`; spend increases exactly once | pending live run |
| Replay consume | Agent auxiliary wallet | remains `CONSUMED`; spend unchanged | pending live run |
| Reviewer self-test | reviewer wallets | reviewer-created charter follows same lifecycle | reproducible from UI |

For each successful UI action, capture: wallet address, input IDs, explorer transaction URL, finalized result, and JSON returned by `get_charter`, `get_invoice`, or `get_intent`. The UI journal links transactions directly to Studio Explorer and only reports success after finalized receipt plus authoritative readback.
