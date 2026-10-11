import { readFileSync } from "node:fs";
const run=JSON.parse(readFileSync(new URL("./LIVE_RUN_V3.json",import.meta.url)));
const dep=JSON.parse(readFileSync(new URL("./DEPLOYMENT_V3.json",import.meta.url)));
const fail=[];
if(!dep.source_equal||dep.status!=="VERIFIED_SOURCE_IDENTITY")fail.push("source parity/identity");
if(run.contract.toLowerCase()!==dep.contract_address.toLowerCase())fail.push("contract mismatch");
if(!run.finished||run.summary.passed!==53||run.summary.historical_failed_assertions!==0)fail.push("assertion summary");
for(const t of run.transactions){
 if(t.status!=="FINALIZED"||!/^0x[0-9a-f]{64}$/i.test(t.hash||""))fail.push(`${t.label}: hash/finality`);
 const leaders=t.receipt?.consensus_data?.leader_receipt||[];
 if(!leaders.some(r=>r.execution_result==="SUCCESS"&&r.result?.status==="return"))fail.push(`${t.label}: successful leader return`);
 const agrees=Object.values(t.receipt?.consensus_data?.votes||{}).filter(v=>v==="agree").length;
 if(agrees<3)fail.push(`${t.label}: only ${agrees} agree votes`);
}
if(fail.length){console.error(fail.join("\n"));process.exit(2)}
console.log(`PASS: ${run.transactions.length} finalized transactions, 53 assertions, source parity, >=3 agrees each`);
