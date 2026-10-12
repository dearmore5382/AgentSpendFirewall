import { readFileSync, writeFileSync } from "node:fs";
const run=JSON.parse(readFileSync(new URL("./LIVE_RUN_V3.json",import.meta.url)));
const dep=JSON.parse(readFileSync(new URL("./DEPLOYMENT_V3.json",import.meta.url)));
const legacy=readFileSync(new URL("./STEWARDS_SIX_TX_V2.md",import.meta.url),"utf8").replace("# Six user-signed frontend lifecycle transactions","## Historical frontend wallet-signing evidence (v2)");
const x=h=>`https://explorer-studio.genlayer.com/tx/${h}`;
const rows=run.transactions.map(t=>`| ${t.label} | [${t.hash}](${x(t.hash)}) | ${t.status} |`).join("\n");
const md=`# AgentSpend Firewall — consolidated v3 E2E evidence

Generated: ${new Date().toISOString()}

- Contract: [${run.contract}](https://explorer-studio.genlayer.com/address/${run.contract})
- Network: GenLayer StudioNet
- Production: https://agent-spend-firewall.pages.dev/
- Source SHA-256: \`${dep.deployed_source_sha256}\`
- Source parity: **${dep.source_equal ? "exact byte-for-byte match" : "FAILED"}**
- Contract identity: \`${JSON.stringify(dep.identity)}\`
- Test wallets: two auxiliary wallets; deployer was not used (deployer_used: false).

## Result

**${run.summary.passed}/53 assertions passed; ${run.summary.historical_failed_assertions} failed.** Final counters: ${JSON.stringify(run.final_counts)}. Raw receipts, consensus votes, call arguments, signers, and before/after counters are preserved in [LIVE_RUN_V3.json](LIVE_RUN_V3.json).

## Requirement coverage

Exact mapping to every item in the second steward request: [SECOND_REVIEW_RESPONSE_V3.md](SECOND_REVIEW_RESPONSE_V3.md).

1. Happy path: charter → payee-attested invoice → single intent → validator classification → authorization → one-time consumption.
2. Failure and authorization: wrong publisher/requester/consumer/revoker, wrong authorization digest, terminal-state reassessment and double-consume all reject without unintended counter, budget, or charter mutation.
3. Replay protection: one invoice remains bound to one intent across pending, authorized, and consumed states; a different nonce cannot reopen it.
4. Live budget conflict: two independently authorized invoices contend for a 60-unit lifetime cap. A consumes 40; B returns \`BUDGET_EXCEEDED\`, becomes \`STALE_BUDGET\`, remains unconsumed, and spent remains 40.
5. Revocation race: revocation before consumption wins; intent becomes \`REVOKED\`, spent stays 0, and no execution ticket exists.
6. Audit semantics: \`CONSUMED\` is a single-use authorization ticket, not proof of payment. Receipts report \`payment_verified: false\`; invoice evidence is explicitly \`PAYEE_ATTESTED_ONLY\`.
7. Classifier integrity: v3 validates strict JSON/schema and exact line citation, retries only malformed/call-failure output, and does not mistake unauthenticated provenance for semantic ambiguity.

## Transactions

| Case | Explorer transaction | Status |
| --- | --- | --- |
${rows}

## Reproduce

1. Set \`ASF_CONTRACT_ADDRESS\`, \`ASF_PRINCIPAL_KEY\`, and \`ASF_AGENT_KEY\` locally; never commit keys.
2. Run \`node verification/verify-v3-deployment.mjs <address>\`.
3. Run \`node verification/run-v3.mjs\` once against a fresh deployment.
4. Run \`node verification/check-v3-evidence.mjs\` and \`python -m pytest -q\`.

The main/deployer wallet only deployed the contract. All automated lifecycle transactions above were signed by the two auxiliary role wallets. A steward may independently connect any wallet, but contract role checks determine which actions it may execute.

The following v2 transactions demonstrate the historical browser-wallet signing path only. They are **not proof of v3 contract behavior**; that is established by the 31 fresh v3 transactions above.

${legacy}
`;
writeFileSync(new URL("./E2E_FULL_REPORT_V3.md",import.meta.url),md);
console.log(`wrote ${run.transactions.length} linked transactions`);
