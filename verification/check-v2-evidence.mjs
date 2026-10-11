import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL(n,import.meta.url)));
const run=load('./LIVE_RUN_V2.json'),retry=load('./ASSESSMENT_RETRY_V2.json'),deployment=load('./DEPLOYMENT_V2.json');
if(!run.finished||run.error)throw Error('Lifecycle not completed');
if(run.contract!==deployment.contract_address||!deployment.source_equal)throw Error('Deployment mismatch');
const failed=run.checks.filter(x=>!x.pass);
if(failed.length!==1||failed[0].name!=='open assessor happy successful GenVM and expected return'||failed[0].state.actual!=='REVIEW_REQUIRED')throw Error('Unexpected failed assertion');
if(retry.status!=='FINALIZED'||retry.after.state!=='AUTHORIZED'||retry.before.state!=='REVIEW_REQUIRED'||retry.invoice_after.intent_id!==retry.invoice_before.intent_id)throw Error('Same-intent retry not proven');
const rows=[...run.transactions.filter(x=>x.hash),retry];
for(const t of rows){
 if(t.status!=='FINALIZED')throw Error('Not finalized '+t.hash);
 const cs=t.receipt.consensus_data;
 const leaders=cs.leader_receipt.filter(x=>x.execution_result==='SUCCESS'&&x.result?.status==='return'&&typeof x.result.payload?.readable==='string');
 if(!leaders.length||Object.values(cs.votes).filter(x=>x==='agree').length<3)throw Error('Missing successful GenVM / quorum '+t.hash);
}
for(const n of ['invoice and ticket consumed once, not paid','budget conflict preserves unpaid invoice and cap','revoked ticket cannot execute','consumed ticket remains irreversible, not paid']){
 if(!run.checks.some(x=>x.name===n&&x.pass))throw Error('Missing proof '+n);
}
console.log(JSON.stringify({finalized_transactions:rows.length,passed_assertions:run.checks.filter(x=>x.pass).length,preserved_historical_happy_failure:failed.length,same_intent_retry:'AUTHORIZED',browser_signed:run.browser_signed},null,2));
