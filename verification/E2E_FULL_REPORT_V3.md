# AgentSpend Firewall — consolidated v3 E2E evidence

Generated: 2026-10-11T04:02:44.527Z

- Contract: [0xb13E965e06Bf563748A32f0f4ae8FE1D1b6E17d3](https://explorer-studio.genlayer.com/address/0xb13E965e06Bf563748A32f0f4ae8FE1D1b6E17d3)
- Network: GenLayer StudioNet
- Production: https://agent-spend-firewall.pages.dev/
- Source SHA-256: `16b177946f6692904fa6ba548d0091b92d6a067943c954c4640ddee22d7803b1`
- Source parity: **exact byte-for-byte match**
- Contract identity: `{"name":"AgentSpendFirewall","schema":"diagnostic-single-use-agent-spend-v3","version":3}`
- Test wallets: two auxiliary wallets; deployer was not used (deployer_used: false).

## Result

**53/53 assertions passed; 0 failed.** Final counters: {"charter_count":3,"intent_count":4,"invoice_count":4}. Raw receipts, consensus votes, call arguments, signers, and before/after counters are preserved in [LIVE_RUN_V3.json](LIVE_RUN_V3.json).

## Requirement coverage

1. Happy path: charter → payee-attested invoice → single intent → validator classification → authorization → one-time consumption.
2. Failure and authorization: wrong publisher/requester/consumer/revoker, wrong authorization digest, terminal-state reassessment and double-consume all reject without unintended counter, budget, or charter mutation.
3. Replay protection: one invoice remains bound to one intent across pending, authorized, and consumed states; a different nonce cannot reopen it.
4. Live budget conflict: two independently authorized invoices contend for a 60-unit lifetime cap. A consumes 40; B returns `BUDGET_EXCEEDED`, becomes `STALE_BUDGET`, remains unconsumed, and spent remains 40.
5. Revocation race: revocation before consumption wins; intent becomes `REVOKED`, spent stays 0, and no execution ticket exists.
6. Audit semantics: `CONSUMED` is a single-use authorization ticket, not proof of payment. Receipts report `payment_verified: false`; invoice evidence is explicitly `PAYEE_ATTESTED_ONLY`.
7. Classifier integrity: v3 validates strict JSON/schema and exact line citation, retries only malformed/call-failure output, and does not mistake unauthenticated provenance for semantic ambiguity.

## Transactions

| Case | Explorer transaction | Status |
| --- | --- | --- |
| create ASF-V3-HAPPY | [0x876685cd033f7caf98d51688f8dba1ddfc3dbb380bf8dd63787481de52091efe](https://explorer-studio.genlayer.com/tx/0x876685cd033f7caf98d51688f8dba1ddfc3dbb380bf8dd63787481de52091efe) | FINALIZED |
| wrong invoice publisher | [0x31cc1bd654e4960bd02370fd1cc8d0fe5e23beebf2f9790e82beca4d7a63cf21](https://explorer-studio.genlayer.com/tx/0x31cc1bd654e4960bd02370fd1cc8d0fe5e23beebf2f9790e82beca4d7a63cf21) | FINALIZED |
| publish 1 | [0xb94ad01c90638293c301464b3891d5b28c0634fec395bfa6af7e64dc37408dfb](https://explorer-studio.genlayer.com/tx/0xb94ad01c90638293c301464b3891d5b28c0634fec395bfa6af7e64dc37408dfb) | FINALIZED |
| wrong intent requester | [0x23156b684e9a22eb93f34b78856434ce60ac24b8993721cd892d3212e3436380](https://explorer-studio.genlayer.com/tx/0x23156b684e9a22eb93f34b78856434ce60ac24b8993721cd892d3212e3436380) | FINALIZED |
| request FIRST | [0xbf6075dddf2b90bded6a190b243e39db3aa3e758bef90abbcd19cd597a1229d2](https://explorer-studio.genlayer.com/tx/0xbf6075dddf2b90bded6a190b243e39db3aa3e758bef90abbcd19cd597a1229d2) | FINALIZED |
| same invoice different nonce pending | [0x541c3d748ac32bac0c31d9399c63ee32bae502db285d7817b5ffa5d0f9e803de](https://explorer-studio.genlayer.com/tx/0x541c3d748ac32bac0c31d9399c63ee32bae502db285d7817b5ffa5d0f9e803de) | FINALIZED |
| open assessor happy | [0x765c0f24672d5042bac6d39830e3b0b0572f559b888232f2f8e1f856a469ce65](https://explorer-studio.genlayer.com/tx/0x765c0f24672d5042bac6d39830e3b0b0572f559b888232f2f8e1f856a469ce65) | FINALIZED |
| same invoice different nonce authorized | [0xfd87ffa0593c6193de40388e6efb550273b2a85307437ec45c0b3238084aca94](https://explorer-studio.genlayer.com/tx/0xfd87ffa0593c6193de40388e6efb550273b2a85307437ec45c0b3238084aca94) | FINALIZED |
| wrong consumer | [0x376903f4e6eb56ecf11ef86eb0a5751d32906d28914a3270ef77c5a29ae5d25b](https://explorer-studio.genlayer.com/tx/0x376903f4e6eb56ecf11ef86eb0a5751d32906d28914a3270ef77c5a29ae5d25b) | FINALIZED |
| wrong digest | [0x8fe01ef23d75306b6d6f4d9b2020c286a2e5bc89c49c5c3c09e2d925fb7ce320](https://explorer-studio.genlayer.com/tx/0x8fe01ef23d75306b6d6f4d9b2020c286a2e5bc89c49c5c3c09e2d925fb7ce320) | FINALIZED |
| consume whole invoice | [0x73065e36e8dfa5a7fc5d89eed8e843dadd1eca26f286874137ed97ce4d17355b](https://explorer-studio.genlayer.com/tx/0x73065e36e8dfa5a7fc5d89eed8e843dadd1eca26f286874137ed97ce4d17355b) | FINALIZED |
| same invoice different nonce consumed | [0xf56787cf73570e690d3509ab767f1a669af812a3a99bc12d9adc0771b4811541](https://explorer-studio.genlayer.com/tx/0xf56787cf73570e690d3509ab767f1a669af812a3a99bc12d9adc0771b4811541) | FINALIZED |
| double consume | [0x25fd7c966cc2f0d378fe00f9d2c8726a3a2ba93f68fbab4e6dd2b7f3e6ed2b1c](https://explorer-studio.genlayer.com/tx/0x25fd7c966cc2f0d378fe00f9d2c8726a3a2ba93f68fbab4e6dd2b7f3e6ed2b1c) | FINALIZED |
| assess consumed | [0x6d66cfdf686c51e0e754001e5d9439d346b130aeba91919394e74f010168f627](https://explorer-studio.genlayer.com/tx/0x6d66cfdf686c51e0e754001e5d9439d346b130aeba91919394e74f010168f627) | FINALIZED |
| wrong revoker | [0x6c4b32748edf468123f61357820878a1322764170902da076af4b70c0a68b673](https://explorer-studio.genlayer.com/tx/0x6c4b32748edf468123f61357820878a1322764170902da076af4b70c0a68b673) | FINALIZED |
| create ASF-V3-BUDGET | [0x751d4c0a1a9a5e78d4479928cdd39192fde841880d5965f2d3fd56039f95a9e4](https://explorer-studio.genlayer.com/tx/0x751d4c0a1a9a5e78d4479928cdd39192fde841880d5965f2d3fd56039f95a9e4) | FINALIZED |
| publish 2 | [0x4ced94972b72710c8b92f293dd68c8b80ae15d24e56ab846deab7da2314afcba](https://explorer-studio.genlayer.com/tx/0x4ced94972b72710c8b92f293dd68c8b80ae15d24e56ab846deab7da2314afcba) | FINALIZED |
| publish 3 | [0x6b623cfdcd5723db56b6063f0426e0acefe4b0f91a2ec68bf6cffe304925e19f](https://explorer-studio.genlayer.com/tx/0x6b623cfdcd5723db56b6063f0426e0acefe4b0f91a2ec68bf6cffe304925e19f) | FINALIZED |
| request B-A | [0x96f3698328fdd362fa3f9fd8c5468b5b092e4bddd3ecec0d542a7eac4ec90add](https://explorer-studio.genlayer.com/tx/0x96f3698328fdd362fa3f9fd8c5468b5b092e4bddd3ecec0d542a7eac4ec90add) | FINALIZED |
| request B-B | [0x957a2d5c295a6bc54aa4d395dfb3eae8b8675a75f73a7b6ebcc4762301e23c89](https://explorer-studio.genlayer.com/tx/0x957a2d5c295a6bc54aa4d395dfb3eae8b8675a75f73a7b6ebcc4762301e23c89) | FINALIZED |
| assess budget A | [0xb3834650aa74854ce01b596c8901705c570b5820f0642aa579e272a72fc11dbf](https://explorer-studio.genlayer.com/tx/0xb3834650aa74854ce01b596c8901705c570b5820f0642aa579e272a72fc11dbf) | FINALIZED |
| assess budget B | [0x3b85f1d54735f5eeb5041ef9865c00952e1a1f861417e2367f915fa2fc615007](https://explorer-studio.genlayer.com/tx/0x3b85f1d54735f5eeb5041ef9865c00952e1a1f861417e2367f915fa2fc615007) | FINALIZED |
| consume budget A | [0xfa27ae39c83ec3693109b5d69e12d4f7bc45ece6b74d48a50ec67671f49e56ae](https://explorer-studio.genlayer.com/tx/0xfa27ae39c83ec3693109b5d69e12d4f7bc45ece6b74d48a50ec67671f49e56ae) | FINALIZED |
| budget conflict B | [0xbe51a41c712e65a04fa5185374416335d012bc4143bc7d1017b7a4c499f2ba56](https://explorer-studio.genlayer.com/tx/0xbe51a41c712e65a04fa5185374416335d012bc4143bc7d1017b7a4c499f2ba56) | FINALIZED |
| create ASF-V3-REVOKE | [0xac0087c56d7f5622ae2c802bb08a802864935cbf9389911e1afb756af58d39d3](https://explorer-studio.genlayer.com/tx/0xac0087c56d7f5622ae2c802bb08a802864935cbf9389911e1afb756af58d39d3) | FINALIZED |
| publish 4 | [0x1cb0d2fee93562b872cab4ffc53d5650898368043d98525e3aedefaabed230f8](https://explorer-studio.genlayer.com/tx/0x1cb0d2fee93562b872cab4ffc53d5650898368043d98525e3aedefaabed230f8) | FINALIZED |
| request REVOKE | [0xf831eb15fc6d6b402c742810bf23f5a3ad6fab199fc3842e10638e620a3b5740](https://explorer-studio.genlayer.com/tx/0xf831eb15fc6d6b402c742810bf23f5a3ad6fab199fc3842e10638e620a3b5740) | FINALIZED |
| assess revoke case | [0x7634018c4d940d05ae2892463c51223d697cc0ace39fb24fb368a1d8f4736da0](https://explorer-studio.genlayer.com/tx/0x7634018c4d940d05ae2892463c51223d697cc0ace39fb24fb368a1d8f4736da0) | FINALIZED |
| revoke before consume | [0x0d6bb7e7601a252d95919887059d65b521d6251b8ceb641f305345c7545f1e69](https://explorer-studio.genlayer.com/tx/0x0d6bb7e7601a252d95919887059d65b521d6251b8ceb641f305345c7545f1e69) | FINALIZED |
| revocation wins | [0x5746062772785c9b9743c45facbe94c4c793a5372cda941c74a0aff4839a9c6f](https://explorer-studio.genlayer.com/tx/0x5746062772785c9b9743c45facbe94c4c793a5372cda941c74a0aff4839a9c6f) | FINALIZED |
| revoke after consumed | [0x80302163630b2d34e6049e30ff0555ae3ab3ebf545df0f7c560f262f8f334dd4](https://explorer-studio.genlayer.com/tx/0x80302163630b2d34e6049e30ff0555ae3ab3ebf545df0f7c560f262f8f334dd4) | FINALIZED |

## Reproduce

1. Set `ASF_CONTRACT_ADDRESS`, `ASF_PRINCIPAL_KEY`, and `ASF_AGENT_KEY` locally; never commit keys.
2. Run `node verification/verify-v3-deployment.mjs <address>`.
3. Run `node verification/run-v3.mjs` once against a fresh deployment.
4. Run `node verification/check-v3-evidence.mjs` and `python -m pytest -q`.

The main/deployer wallet only deployed the contract. All automated lifecycle transactions above were signed by the two auxiliary role wallets. A steward may independently connect any wallet, but contract role checks determine which actions it may execute.

## Historical frontend wallet-signing evidence (v2)

These six transactions were signed through the frontend by wallet `0xFf36b56CcA032C559e52e2A4F20c2C594B02Fe37` against the historical v2 contract `0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d`. They demonstrate the browser-wallet lifecycle only. They are **not presented as proof of v3 contract behavior**; current v3 behavior is proven by the 31 transactions above.

1. Create charter — [`0x4eba605c…73ba11de`](https://explorer-studio.genlayer.com/tx/0x4eba605cfc84cf2bbca88efd152e56702cab640daaef1418b4145a4873ba11de)
2. Publish invoice — [`0x692f3236…c96cac0b`](https://explorer-studio.genlayer.com/tx/0x692f3236d2c8164f74726a308e423cc8981f3b73730c04a18c7f319bc96cac0b)
3. Request intent — [`0x1c1e9f9c…eae5a052`](https://explorer-studio.genlayer.com/tx/0x1c1e9f9c3d590b973abaa5c66a0813142dc233810799c4ebfa89eddaeae5a052)
4. Assess → `AUTHORIZED` — [`0xdadcae30…3f424846`](https://explorer-studio.genlayer.com/tx/0xdadcae300f10a2fdeff02299294de083b86d0a270df9813dde0f4b003f424846)
5. Consume → `CONSUMED` — [`0x21432fb7…b33d42b8`](https://explorer-studio.genlayer.com/tx/0x21432fb72b50879a44b0fe22cc7386f6e0466450305f899f756b6282b33d42b8)
6. Revoke → `CHARTER_REVOKED` — [`0x1240edfb…1153a6b5`](https://explorer-studio.genlayer.com/tx/0x1240edfbb72ddfdc8ccc8fb2e2f0d8c570854f84b98a7832ba751eb81153a6b5)

All six are FINALIZED with successful GenVM returns and at least three validator agree votes. Authoritative readback recorded charter `REVOKED` with spent `40`, intent `CONSUMED`, invoice `consumed: true`, and execution ticket `payment_verified: false`. Detailed capture: [STEWARDS_SIX_TX_V2.md](STEWARDS_SIX_TX_V2.md).
