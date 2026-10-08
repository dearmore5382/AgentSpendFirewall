# Local verification

Run date: 2026-10-07

Command: `python -m pytest -q`

Result after adding contract and frontend guard coverage: **10 passed**.

Covered locally:

- deployer receives no workflow role;
- happy authorization, one-time consumption and exact budget increment;
- fail-closed unknown result and retry to denial;
- role enforcement, per-intent limit and artifact replay rejection;
- authorization mismatch and revoke-before-consume conflict;
- policy/invoice source reference binding;
- prompt-injection text remains bounded data;
- false citation normalizes to `UNKNOWN`.
- contract identity and record counters are machine-readable for guarded UI writes.
- StudioNet receipts with an absent optional `resultName` are not falsely reported as failures;
- SDK readbacks are accepted in both object and JSON-string form;
- consequential UI actions must match authoritative `AUTHORIZED`/`DENIED`/`REVIEW_REQUIRED`, `CONSUMED`, or `REVOKED` post-state.

Frontend production build: **passed** (`tsc -b && vite build`, Vite 8.3.3). The build emitted only a non-blocking chunk-size warning from the bundled SDK. The local Vite server also responded successfully. Automated Windows browser capture could not initialize because its Windows sandbox helper failed; no visual-pass claim is made from that tool failure.

Local mocks are not presented as live chain evidence; the live proof checklist remains separate in `LIVE_MATRIX.md`.
