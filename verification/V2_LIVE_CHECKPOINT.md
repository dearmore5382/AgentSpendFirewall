# v2 live checkpoint — not a completed happy path

Contract 0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d exactly matches source SHA-256 a6eddf589fff18c58825e8c75b857f73800c0b90285a8f6544ca6f3bfdee88df; identity version 2 and zero initial counters verified.

Creation, payee-only publication, agent-only request and the different-nonce invoice guard were exercised live. The first assessment 0x568c5cbf836efd742438bc382cd6587c6f42a54a7b068ad9b76849845770ea40 finalized with successful GenVM execution but returned REVIEW_REQUIRED / UNKNOWN / INSUFFICIENT. The expected happy-path AUTHORIZED assertion failed and is preserved in LIVE_RUN_V2.json. Budget was not consumed and the invoice remained reserved.

One explicit retry of the same intent (not a new invoice or nonce) is recorded separately in ASSESSMENT_RETRY_V2.json: FINALIZED AUTHORIZED, followed by successful whole-invoice consumption. Different-nonce attempts at pending/authorized/consumed states and double-consume were rejected live. An earlier eth_getTransactionCount RPC HTML failure before submission was preserved as an interruption/unsent row; finalized transactions were not replayed.

Budget intent 2 assessment and one bounded retry both returned REVIEW_REQUIRED. No forced authorization or budget-conflict completion is claimed. See ASSESSMENT_RETRY_INTENT_2_V2.json and the consolidated E2E_FULL_REPORT_V2.md for current progress. Production read-only UI retrieved CONSUMED for intent 0; full browser signing remains blocked by no injected wallet.

Do not claim the complete live lifecycle or browser-signed demonstration passed from this checkpoint. No actual payment or external executor is verified.
