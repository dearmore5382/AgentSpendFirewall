# Production browser check — v2

Observed on 2026-10-11 at https://agent-spend-firewall.pages.dev/ using the Codex in-app browser.

- Deployed contract field: `0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d`.
- Clicking **Connect wallet** returns `No injected wallet found.` No wallet provider is available in this connected browser.
- Clicking **Reload intent**, ID `0`, fetched the live contract record: state `CONSUMED`, charter `0`, invoice `0`, amount `40`, nonce `FIRST`, purpose `HOSTING`.
- Authorization: `1f6e196a6c39ec3862abb047469aff30d2eb015fc39bdee411f12c0155e3f804`.
- **Consume execution ticket** is disabled for this consumed record, matching its chain state.
- Audit panel explicitly says `No transactions signed in this browser session yet.`
- UI explicitly distinguishes PAYEE_ATTESTED_ONLY, unverified artifact digest, and CONSUMED from payment confirmation.

This proves production rendering and a real read-only UI-to-contract readback. It does **not** prove a browser-signed lifecycle. SDK live transactions are separate evidence. The full frontend-signing requirement remains open until a browser with an injected role wallet is connected and the browser runbook is executed.
