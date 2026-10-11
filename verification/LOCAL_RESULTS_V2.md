# Local verification — v2, 2026-10-11

- `python -m pytest -q`: 15 passed; pytest cache permission warning only.
- Tests call the production contract through gltest Direct Mode. External semantic classification is mocked for deterministic branch coverage, not claimed as live validator evidence. Frontend guards are static assertions, not browser execution.
- `npm run build`: TypeScript and Vite passed outside sandbox; the first sandbox attempt failed spawn EPERM. Bundle-size warning remains.
- `node --check verification/run-v2.mjs`: passed syntax check. Script has not run against v2 because no replacement address is supplied yet.
- Coverage added: different-nonce replay in pending/authorized/consumed/unclear/denied states; invoice consumption marker; whole-amount budget conflict; wrong wallet/digest preserve invoice; v2 digest binds invoice ID and packet digest; ticket does not claim payment and persists after later revocation.

These results do not establish successful GenVM/consensus on deployed v2 or a signed production-browser lifecycle. See REMEDIATION_V2.md for release gates.
