# StudioNet lifecycle evidence

Run completed: 2026-10-08. Contract: [`0x7D71F1078580e9aF0D39291d3D8195Bb08903F38`](https://explorer-studio.genlayer.com/address/0x7D71F1078580e9aF0D39291d3D8195Bb08903F38).

Roles were signed by two auxiliary wallets: Principal `0x686269f09C21aac57f39662855FA51b9758698b2`; Agent + Payee `0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2`. The deployer signed no workflow transaction.

## Result

All **16/16 state assertions passed**. Final counters: 6 charters, 7 invoices, 6 intents. Complete hashes, signers, before/after counters and post-state objects are stored in [`LIVE_RUN.json`](LIVE_RUN.json).

The frontend success guard was aligned to these live receipts: it waits for `FINALIZED`, then verifies record counters and authoritative contract state. It does not require the optional SDK `resultName`, which was `null` on finalized StudioNet transactions in this run.

## Representative finalized transactions

- Happy authorization assessment: [`0x02cd82…b9e9`](https://explorer-studio.genlayer.com/tx/0x02cd82a6c5ef317a5b5c03a84639328311b9e862ccab534b20221cc1bd55b9e9)
- Happy one-time consume: [`0x9b8399…dd6b`](https://explorer-studio.genlayer.com/tx/0x9b8399e110834f239a6c801076032ef323b089e6da4c7bace8230fe607d8dd6b)
- Double-consume rejection: [`0xae3b4e…1660`](https://explorer-studio.genlayer.com/tx/0xae3b4ec6f75b00ff1af0188ee59189804ee8b9396f580bf90cacdd1cfd821660)
- Hostile invoice assessment, fail-closed: [`0x2efc9f…e8af6`](https://explorer-studio.genlayer.com/tx/0x2efc9f3d3ed9327b4ffaac346d95abb2f091b6b3ed3764e2294195557b8e8af6)
- Principal revocation: [`0xb8a28d…0555`](https://explorer-studio.genlayer.com/tx/0xb8a28d1ae7f07151307e56e54e8c519c569d9cac8c81e14cda680097dad00555)
- Consume-after-revoke rejection: [`0x48e64d…bb6c4`](https://explorer-studio.genlayer.com/tx/0x48e64d7f8de41fe5af2a12e32e8c4619d6470a64032816b7c8857c86ecabb6c4)
- First conflicting authorization consumed: [`0x290cc5…76c0`](https://explorer-studio.genlayer.com/tx/0x290cc5560221209bdea61849418fc3e5e593402387d393f1ebbaf72ac1cc76c0)
- Second conflicting authorization becomes `STALE_BUDGET`: [`0x462408…e566`](https://explorer-studio.genlayer.com/tx/0x4624081cb3d6f24f250231b48c2650f13e7e2800ca0e3d0be8045b44f998e566)

## Verified consequences

- Happy intent became `CONSUMED`; charter spend increased from 0 to 40 exactly once.
- Artifact replay and nonce replay did not increment their counters.
- Wrong digest preserved `AUTHORIZED`; double consume preserved spend at 40.
- Amount above the per-intent maximum created no intent.
- Prompt-injection invoice text normalized to `UNKNOWN / INSUFFICIENT` and remained `REVIEW_REQUIRED` after three consensus assessments.
- Revocation after authorization won the race: intent became `REVOKED`, spend remained 0.
- Two intents were independently authorized against the same remaining budget; after the first consumed 40, the second became `STALE_BUDGET`, leaving spend at 40.
