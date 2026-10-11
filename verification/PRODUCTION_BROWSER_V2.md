# Production browser check — v2

## Update: user-signed lifecycle

The user subsequently supplied six main-wallet transaction proofs following the frontend instructions. Independently verified FINALIZED/SUCCESS returns: charter 3, invoice 4, intent 4, AUTHORIZED, CONSUMED, CHARTER_REVOKED. Current state is charter REVOKED/spent 40 and intent CONSUMED/invoice consumed true. See E2E_FULL_REPORT_V2.md and USER_WALLET_LIFECYCLE_V2.json. This is user-performed evidence, not signatures from the agent's connected browser. The explorer image confirms chain calls but does not independently show frontend signing prompts/intermediate UI transitions. The observation below remains historical.

Observed on 2026-10-11 at https://agent-spend-firewall.pages.dev/ using the Codex in-app browser.

- Deployed contract field: `0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d`.
- Clicking **Connect wallet** returns `No injected wallet found.` No wallet provider is available in this connected browser.
- Clicking **Reload intent**, ID `0`, fetched the live contract record: state `CONSUMED`, charter `0`, invoice `0`, amount `40`, nonce `FIRST`, purpose `HOSTING`.
- Authorization: `1f6e196a6c39ec3862abb047469aff30d2eb015fc39bdee411f12c0155e3f804`.
- **Consume execution ticket** is disabled for this consumed record, matching its chain state.
- Audit panel explicitly says `No transactions signed in this browser session yet.`
- UI explicitly distinguishes PAYEE_ATTESTED_ONLY, unverified artifact digest, and CONSUMED from payment confirmation.

This proves production rendering and a real read-only UI-to-contract readback. It does **not** prove a browser-signed lifecycle. SDK live transactions are separate evidence. The full frontend-signing requirement remains open until a browser with an injected role wallet is connected and the browser runbook is executed.
