# AgentSpend Firewall — consolidated v2 live evidence

Generated: 2026-10-11T02:55:34.502Z

Contract: [0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d](https://explorer-studio.genlayer.com/address/0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d)

Website: https://agent-spend-firewall.pages.dev/

## Honest release status

Runner reached its end. This is not an all-pass or submission-ready claim. Browser-signed lifecycle is NOT EXECUTED; production read-only UI proof is in [PRODUCTION_BROWSER_V2.md](PRODUCTION_BROWSER_V2.md). Budget conflict is blocked if invoice B remains REVIEW_REQUIRED. All initial failed assertions and RPC interruptions are retained.

## Steward requirement mapping

1. One registered invoice permanently binds one whole-amount intent; different nonces cannot reopen it. No partial payments. Live checks cover pending, authorized and consumed states.
2. CONSUMED is an accounting ticket, NOT payment. [Executor protocol](../EXECUTOR_PROTOCOL_V2.md) describes external domain binding, finality, durable invoice/ticket idempotency, outbox and reconciliation. No deployed payment executor is claimed.
3. PAYEE_ATTESTED_ONLY authenticates the designated sender, not invoice truth. Artifact digest is declared/unverified; fabricated distinct invoices are not independently authenticated.
4. SDK live lifecycle and browser lifecycle are separate. Full browser signing remains required; missing injected wallet is documented.

## Deployment and source

[Source parity metadata](DEPLOYMENT_V2.json); SHA-256 a6eddf589fff18c58825e8c75b857f73800c0b90285a8f6544ca6f3bfdee88df. [Local tests](LOCAL_RESULTS_V2.md) disclose classification mocks.

## Transactions

Raw receipts, consensus votes, before/after counts and role addresses: [LIVE_RUN_V2.json](LIVE_RUN_V2.json). Main/deployer wallet is not used for tests.

| Case | Transaction | Status | Successful GenVM return |
| --- | --- | --- | --- |
| create ASF-V2-HAPPY | [0xc3745dc6bc4c12066e9baee877a37118fbc0c5e8a2db06bb33f54478fed95546](https://explorer-studio.genlayer.com/tx/0xc3745dc6bc4c12066e9baee877a37118fbc0c5e8a2db06bb33f54478fed95546) | FINALIZED | 0 |
| wrong invoice publisher | [0xfa9fe166dcafc2dbe9b99b18a0e9fab25e47702f7fcf8ea1d368ff786e4cac43](https://explorer-studio.genlayer.com/tx/0xfa9fe166dcafc2dbe9b99b18a0e9fab25e47702f7fcf8ea1d368ff786e4cac43) | FINALIZED | "PAYEE_ONLY" |
| publish 1 | [0x78e0ec04314ac3c8ce5a8e58a3f908cf4c2210b2a16d351a3b3de082344dc3a4](https://explorer-studio.genlayer.com/tx/0x78e0ec04314ac3c8ce5a8e58a3f908cf4c2210b2a16d351a3b3de082344dc3a4) | FINALIZED | 0 |
| wrong intent requester | [0x4de3688ac4770c38b1943e4d60d400e4c9ea8332b3746a531e70ca13565c1ccc](https://explorer-studio.genlayer.com/tx/0x4de3688ac4770c38b1943e4d60d400e4c9ea8332b3746a531e70ca13565c1ccc) | FINALIZED | "AGENT_ONLY" |
| request FIRST | [0x1c7e7ea89935de25b83cc84e9fba5cd5f30892301c219854bd9581963f5ee3cb](https://explorer-studio.genlayer.com/tx/0x1c7e7ea89935de25b83cc84e9fba5cd5f30892301c219854bd9581963f5ee3cb) | FINALIZED | 0 |
| same invoice different nonce pending | [0x13bfa1ab35fedc60dd6e04ed232affeb6e3eb44277ed470dc5adb2bd7dd5d419](https://explorer-studio.genlayer.com/tx/0x13bfa1ab35fedc60dd6e04ed232affeb6e3eb44277ed470dc5adb2bd7dd5d419) | FINALIZED | "INVOICE_ALREADY_HAS_INTENT" |
| open assessor happy | [0x568c5cbf836efd742438bc382cd6587c6f42a54a7b068ad9b76849845770ea40](https://explorer-studio.genlayer.com/tx/0x568c5cbf836efd742438bc382cd6587c6f42a54a7b068ad9b76849845770ea40) | FINALIZED | "REVIEW_REQUIRED" |
| same invoice different nonce authorized | [0xbec8b533a4ec6d1700a7eff30db1d5c775f05b52dbed85445363812625ddd138](https://explorer-studio.genlayer.com/tx/0xbec8b533a4ec6d1700a7eff30db1d5c775f05b52dbed85445363812625ddd138) | FINALIZED | "INVOICE_ALREADY_HAS_INTENT" |
| wrong consumer | [0xbfff40d2bdaa78e368d3a60bc58a786d3d8b44b2e38f163c29edc2074937ac9b](https://explorer-studio.genlayer.com/tx/0xbfff40d2bdaa78e368d3a60bc58a786d3d8b44b2e38f163c29edc2074937ac9b) | FINALIZED | "AGENT_ONLY" |
| wrong digest | [0xab8d561636a5c2136052dd53b82dd62bac2aa2b013f9a0ea358277af8ffdc73d](https://explorer-studio.genlayer.com/tx/0xab8d561636a5c2136052dd53b82dd62bac2aa2b013f9a0ea358277af8ffdc73d) | FINALIZED | "AUTHORIZATION_MISMATCH" |
| consume whole invoice | [0x22a04fa61de5234f0ffcacb57ca0fe7cd4c2315fd48f8aa957f16040e97896ec](https://explorer-studio.genlayer.com/tx/0x22a04fa61de5234f0ffcacb57ca0fe7cd4c2315fd48f8aa957f16040e97896ec) | FINALIZED | "CONSUMED" |
| same invoice different nonce consumed | [0x59d5ef4fa9571725aa5c7f1b0651f23a2e54809a9a4fa9d892cc09cfd9d009e0](https://explorer-studio.genlayer.com/tx/0x59d5ef4fa9571725aa5c7f1b0651f23a2e54809a9a4fa9d892cc09cfd9d009e0) | FINALIZED | "INVOICE_ALREADY_HAS_INTENT" |
| double consume | [0x1ce678ff89e1abb4736caebd964491990ca5f79dc60a62206d2b7a32123fa9ab](https://explorer-studio.genlayer.com/tx/0x1ce678ff89e1abb4736caebd964491990ca5f79dc60a62206d2b7a32123fa9ab) | FINALIZED | "AUTHORIZATION_NOT_ACTIVE" |
| assess consumed | [0xdd1a9a4dd282127e57c8b02d509e83b39aadc2b2069990736efaf95e8a283755](https://explorer-studio.genlayer.com/tx/0xdd1a9a4dd282127e57c8b02d509e83b39aadc2b2069990736efaf95e8a283755) | FINALIZED | "INTENT_NOT_ASSESSABLE" |
| wrong revoker | [0x2f0a90ae0774becc5661c0d10c2edb8408e9e25b0351a8223019b316df643b63](https://explorer-studio.genlayer.com/tx/0x2f0a90ae0774becc5661c0d10c2edb8408e9e25b0351a8223019b316df643b63) | FINALIZED | "PRINCIPAL_ONLY" |
| create ASF-V2-BUDGET | [0xc67db414806b7048b1ec587dab8faebef37f22f40073543dbee62b97b30138ba](https://explorer-studio.genlayer.com/tx/0xc67db414806b7048b1ec587dab8faebef37f22f40073543dbee62b97b30138ba) | FINALIZED | 1 |
| publish 2 | [0xf239ec2c404e27f9732faede765c595197dcf04dcce95f98494392fe9e6f0085](https://explorer-studio.genlayer.com/tx/0xf239ec2c404e27f9732faede765c595197dcf04dcce95f98494392fe9e6f0085) | FINALIZED | 1 |
| publish 3 | [0xc7eb620f55aa0beb79dc594ed9ea4f9df195625dda13de3dacbeb130167528e9](https://explorer-studio.genlayer.com/tx/0xc7eb620f55aa0beb79dc594ed9ea4f9df195625dda13de3dacbeb130167528e9) | FINALIZED | 2 |
| request B-A | [0x6b52702102d6f8fcc7d3ada12530f4558df4a31755b510580c6472b39c47aab9](https://explorer-studio.genlayer.com/tx/0x6b52702102d6f8fcc7d3ada12530f4558df4a31755b510580c6472b39c47aab9) | FINALIZED | 1 |
| request B-B | [0x6b7abffe4092c1eee9203aeabea762459bac37b4c527a7296ddac55f8bf70d92](https://explorer-studio.genlayer.com/tx/0x6b7abffe4092c1eee9203aeabea762459bac37b4c527a7296ddac55f8bf70d92) | FINALIZED | 2 |
| assess budget A | [0x97158ddc4c5e947b9faaf3724c21530ba77163ad83307d11410fab8590541c4c](https://explorer-studio.genlayer.com/tx/0x97158ddc4c5e947b9faaf3724c21530ba77163ad83307d11410fab8590541c4c) | FINALIZED | "AUTHORIZED" |
| assess budget B | [0x4a7390dc73dc1c2eb3ea793e95f5b0d9994e9e141e37d96d9d87bdef9381e442](https://explorer-studio.genlayer.com/tx/0x4a7390dc73dc1c2eb3ea793e95f5b0d9994e9e141e37d96d9d87bdef9381e442) | FINALIZED | "REVIEW_REQUIRED" |
| create ASF-V2-REVOKE | [0xfb0e02093562748b4926ecc39651669c150072fd76c06ff0b9307ef08182b424](https://explorer-studio.genlayer.com/tx/0xfb0e02093562748b4926ecc39651669c150072fd76c06ff0b9307ef08182b424) | FINALIZED | 2 |
| publish 4 | [0x1b58d361e3e063cc112b87587488501852ded15dfb6afeb5472a098c435eb38c](https://explorer-studio.genlayer.com/tx/0x1b58d361e3e063cc112b87587488501852ded15dfb6afeb5472a098c435eb38c) | FINALIZED | 3 |
| request REVOKE | [0x167e4418e7ef68f39c6b9f8c924bfda8c885b6ad8502e3d654f9ac6b13f66aed](https://explorer-studio.genlayer.com/tx/0x167e4418e7ef68f39c6b9f8c924bfda8c885b6ad8502e3d654f9ac6b13f66aed) | FINALIZED | 3 |
| assess revoke case | [0xe23a776d38bb8f20d672259fbef3cd84b78dc91259f22a151b5c379fb198c475](https://explorer-studio.genlayer.com/tx/0xe23a776d38bb8f20d672259fbef3cd84b78dc91259f22a151b5c379fb198c475) | FINALIZED | "REVIEW_REQUIRED" |
| revoke before consume | [0x60535df63110663f617c61d47628ea6180e1f77f3fa4fbdb22bc97321c4acf67](https://explorer-studio.genlayer.com/tx/0x60535df63110663f617c61d47628ea6180e1f77f3fa4fbdb22bc97321c4acf67) | FINALIZED | "CHARTER_REVOKED" |
| revocation wins | [0x9e2acbad28b3c5a182cbce30ac65cffd59f2518866474ba02b67f31ac214f247](https://explorer-studio.genlayer.com/tx/0x9e2acbad28b3c5a182cbce30ac65cffd59f2518866474ba02b67f31ac214f247) | FINALIZED | "CHARTER_NOT_ACTIVE" |
| revoke after consumed | [0x58ccb7d4bb921b79e76e4f18b49136356ebe8fadab3734d47f8bb598ce2e5841](https://explorer-studio.genlayer.com/tx/0x58ccb7d4bb921b79e76e4f18b49136356ebe8fadab3734d47f8bb598ce2e5841) | FINALIZED | "CHARTER_REVOKED" |

## Bounded same-intent retries

- Intent 2: [0xad7043543d354a36b097a8774991aa88f87da1be138d9ba79ada5a110abb50d2](https://explorer-studio.genlayer.com/tx/0xad7043543d354a36b097a8774991aa88f87da1be138d9ba79ada5a110abb50d2); FINALIZED; REVIEW_REQUIRED → REVIEW_REQUIRED. [Full receipt](ASSESSMENT_RETRY_INTENT_2_V2.json). No new nonce/invoice; original failure preserved.
- Intent 3: [0x8f6b7dbc816cbeb4ea56b2c54252d4257533234eee79ec6b6f4eb1cd22949b2d](https://explorer-studio.genlayer.com/tx/0x8f6b7dbc816cbeb4ea56b2c54252d4257533234eee79ec6b6f4eb1cd22949b2d); FINALIZED; REVIEW_REQUIRED → AUTHORIZED. [Full receipt](ASSESSMENT_RETRY_INTENT_3_V2.json). No new nonce/invoice; original failure preserved.
- Intent 0: [0x47785a818caefea968c5279b552a3d5f8244093f6605db485a2b7e9d9cdc7966](https://explorer-studio.genlayer.com/tx/0x47785a818caefea968c5279b552a3d5f8244093f6605db485a2b7e9d9cdc7966); FINALIZED; REVIEW_REQUIRED → AUTHORIZED. [Full receipt](ASSESSMENT_RETRY_V2.json). No new nonce/invoice; original failure preserved.

## Authoritative assertions

| Assertion | Result |
| --- | --- |
| exact v2 identity | PASS |
| create ASF-V2-HAPPY successful GenVM and expected return | PASS |
| wrong invoice publisher successful GenVM and expected return | PASS |
| wrong invoice publisher no counts/budget/charter mutation | PASS |
| publish 1 successful GenVM and expected return | PASS |
| payee attestation, not independent fact 1 | PASS |
| wrong intent requester successful GenVM and expected return | PASS |
| wrong intent requester no counts/budget/charter mutation | PASS |
| request FIRST successful GenVM and expected return | PASS |
| same invoice different nonce pending successful GenVM and expected return | PASS |
| same invoice different nonce pending no counts/budget/charter mutation | PASS |
| open assessor happy successful GenVM and expected return | FAILED (preserved) |
| happy current authorization after bounded retry | PASS |
| same invoice different nonce authorized successful GenVM and expected return | PASS |
| same invoice different nonce authorized no counts/budget/charter mutation | PASS |
| wrong consumer successful GenVM and expected return | PASS |
| wrong consumer no counts/budget/charter mutation | PASS |
| wrong digest successful GenVM and expected return | PASS |
| wrong digest no counts/budget/charter mutation | PASS |
| wrong digest leaves intent authorized | PASS |
| consume whole invoice successful GenVM and expected return | PASS |
| invoice and ticket consumed once, not paid | PASS |
| same invoice different nonce consumed successful GenVM and expected return | PASS |
| same invoice different nonce consumed no counts/budget/charter mutation | PASS |
| double consume successful GenVM and expected return | PASS |
| double consume no counts/budget/charter mutation | PASS |
| assess consumed successful GenVM and expected return | PASS |
| assess consumed no counts/budget/charter mutation | PASS |
| wrong revoker successful GenVM and expected return | PASS |
| wrong revoker no counts/budget/charter mutation | PASS |
| create ASF-V2-BUDGET successful GenVM and expected return | PASS |
| publish 2 successful GenVM and expected return | PASS |
| payee attestation, not independent fact 2 | PASS |
| publish 3 successful GenVM and expected return | PASS |
| payee attestation, not independent fact 3 | PASS |
| request B-A successful GenVM and expected return | PASS |
| request B-B successful GenVM and expected return | PASS |
| assess budget A successful GenVM and expected return | PASS |
| assess budget B successful GenVM and expected return | FAILED (preserved) |
| create ASF-V2-REVOKE successful GenVM and expected return | PASS |
| publish 4 successful GenVM and expected return | PASS |
| payee attestation, not independent fact 4 | PASS |
| request REVOKE successful GenVM and expected return | PASS |
| assess revoke case successful GenVM and expected return | FAILED (preserved) |
| revoke before consume successful GenVM and expected return | PASS |
| revocation wins successful GenVM and expected return | PASS |
| revoked ticket cannot execute | PASS |
| revoke after consumed successful GenVM and expected return | PASS |
| consumed ticket remains irreversible, not paid | PASS |

## Unfinished / blocked cases

```json
{
  "error": null,
  "blocked_cases": {
    "budget_conflict": {
      "reason": "Assessment B remains REVIEW_REQUIRED after one bounded same-intent retry. No forced authorization or consumption.",
      "intent_a": {
        "agent": "0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2",
        "amount": 40,
        "asset": "0x0000000000000000000000000000000000000001",
        "authorization_sha256": "f35ee3345aa3da283a1001b67dcb0a85bfb3f221c7feeba1d966689a827f7a6a",
        "charter_id": 1,
        "intent_id": 1,
        "invoice_id": 1,
        "nonce": "B-A",
        "observation": "{\"confidence_boundary\":\"SUFFICIENT\",\"invoice_citations\":[\"LINE-01\"],\"purpose\":\"HOSTING\"}",
        "payee": "0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2",
        "purpose": "HOSTING",
        "state": "AUTHORIZED"
      },
      "intent_b": {
        "agent": "0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2",
        "amount": 40,
        "asset": "0x0000000000000000000000000000000000000001",
        "authorization_sha256": "",
        "charter_id": 1,
        "intent_id": 2,
        "invoice_id": 2,
        "nonce": "B-B",
        "observation": "{\"confidence_boundary\":\"INSUFFICIENT\",\"invoice_citations\":[\"LINE-01\"],\"purpose\":\"UNKNOWN\"}",
        "payee": "0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2",
        "purpose": "UNKNOWN",
        "state": "REVIEW_REQUIRED"
      },
      "charter": {
        "agent": "0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2",
        "asset": "0x0000000000000000000000000000000000000001",
        "charter_id": 1,
        "lifetime_cap": 60,
        "max_amount": 40,
        "payee": "0x48CCA889CF67A8420D82341e2fa9532Dc36Ba5c2",
        "policy": "{\"charter_ref\":\"ASF-V2-BUDGET\",\"purposes\":[{\"description\":\"Cloud hosting and infrastructure services only.\",\"purpose_id\":\"HOSTING\"}],\"schema\":\"agent-spend-policy-v1\"}",
        "policy_sha256": "225e3bdd63c7709482aed7d84acba6a51eb87d16c3b29b2fab892c9d15925738",
        "principal": "0x686269f09C21aac57f39662855FA51b9758698b2",
        "spent": 0,
        "state": "ACTIVE"
      }
    }
  },
  "browser_signed": false
}
```

No actual token transfer, invoice delivery verification or independent invoice authentication is proved. Do not present this report as full compliance while open gates remain.

## Six latest user-signed wallet transactions — 2026-10-11

This supplements the earlier agent-browser blocker; the historical SDK evidence is not relabeled as frontend evidence. The human user signed the instructed lifecycle using their main wallet. All six hashes were extracted from explorer and independently read through the SDK (read-only, no new signature). The explorer screenshot does not itself record frontend prompts or intermediate UI readbacks, so those are not claimed as independently observed.

Signer: 0xFf36b56CcA032C559e52e2A4F20c2C594B02Fe37. Same wallet is Principal, Agent and Payee in this demonstration; distinct-role attacks remain evidenced separately by the auxiliary-wallet suite.

Charter ID 3; Invoice ID 4; Intent ID 4.

[Full raw receipts and authoritative readbacks](USER_WALLET_LIFECYCLE_V2.json) · [User-supplied explorer screenshot](USER_WALLET_EXPLORER_V2.png). The screenshot captured revoke at ACCEPTED; subsequent verification confirmed FINALIZED.

| Method | Transaction | Finality | GenVM return | Agree votes |
| --- | --- | --- | --- | --- |
| create_charter | [0x4eba605cfc84cf2bbca88efd152e56702cab640daaef1418b4145a4873ba11de](https://explorer-studio.genlayer.com/tx/0x4eba605cfc84cf2bbca88efd152e56702cab640daaef1418b4145a4873ba11de) | FINALIZED (status 7) | 3 | 3 |
| publish_invoice | [0x692f3236d2c8164f74726a308e423cc8981f3b73730c04a18c7f319bc96cac0b](https://explorer-studio.genlayer.com/tx/0x692f3236d2c8164f74726a308e423cc8981f3b73730c04a18c7f319bc96cac0b) | FINALIZED (status 7) | 4 | 3 |
| request_intent | [0x1c1e9f9c3d590b973abaa5c66a0813142dc233810799c4ebfa89eddaeae5a052](https://explorer-studio.genlayer.com/tx/0x1c1e9f9c3d590b973abaa5c66a0813142dc233810799c4ebfa89eddaeae5a052) | FINALIZED (status 7) | 4 | 3 |
| assess_intent | [0xdadcae300f10a2fdeff02299294de083b86d0a270df9813dde0f4b003f424846](https://explorer-studio.genlayer.com/tx/0xdadcae300f10a2fdeff02299294de083b86d0a270df9813dde0f4b003f424846) | FINALIZED (status 7) | "AUTHORIZED" | 3 |
| consume_authorization | [0x21432fb72b50879a44b0fe22cc7386f6e0466450305f899f756b6282b33d42b8](https://explorer-studio.genlayer.com/tx/0x21432fb72b50879a44b0fe22cc7386f6e0466450305f899f756b6282b33d42b8) | FINALIZED (status 7) | "CONSUMED" | 3 |
| revoke_charter | [0x1240edfbb72ddfdc8ccc8fb2e2f0d8c570854f84b98a7832ba751eb81153a6b5](https://explorer-studio.genlayer.com/tx/0x1240edfbb72ddfdc8ccc8fb2e2f0d8c570854f84b98a7832ba751eb81153a6b5) | FINALIZED (status 7) | "CHARTER_REVOKED" | 4 |

Current authoritative state: charter **REVOKED**, spent **40**; intent **CONSUMED**; invoice consumed **true**; execution ticket payment_verified **false**. Successful assessment returned AUTHORIZED; consumption returned CONSUMED; revoke returned CHARTER_REVOKED. This demonstrates revoke after consumption, not revocation before consume. No payment is claimed. Budget conflict remains unresolved; user UI screenshots/video would additionally establish pending/finality/readback display and frontend origin.
