import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
const dir=new URL('./',import.meta.url),load=n=>JSON.parse(readFileSync(new URL(n,dir)));
const run=load('LIVE_RUN_V2.json'),user=load('USER_WALLET_LIFECYCLE_V2.json');
const groups=[...run.transactions.filter(x=>x.hash).map(x=>({source:'LIVE_RUN_V2.json',...x})),...readdirSync(dir).filter(n=>/^ASSESSMENT_RETRY.*V2.json$/.test(n)).map(n=>({source:n,...load(n)})),...user.transactions.map(x=>({source:'USER_WALLET_LIFECYCLE_V2.json',...x}))];
for(const n of ['CONFLICT_COMPLETION_V2.json','COMPLETE_STATE_AUDIT_V2.json'])if(existsSync(new URL(n,dir)))groups.push(...load(n).transactions.filter(x=>x.hash).map(x=>({source:n,...x})));
for(const t of groups){const r=t.receipt;if(!r||r.hash!==t.hash||r.statusName!=='FINALIZED'||r.to_address.toLowerCase()!==run.contract.toLowerCase())throw Error('Receipt identity/finality '+t.hash);if(!r.consensus_data.leader_receipt.some(x=>x.execution_result==='SUCCESS'&&x.result?.status==='return')||Object.values(r.consensus_data.votes).filter(x=>x==='agree').length<3)throw Error('Execution/quorum '+t.hash);}
const audit=existsSync(new URL('COMPLETE_STATE_AUDIT_V2.json',dir))?load('COMPLETE_STATE_AUDIT_V2.json'):null;
if(audit?.finished)for(const t of audit.transactions)if(!t.no_mutation||t.actual!==t.expected||JSON.stringify(t.before)!==JSON.stringify(t.after))throw Error('Adversarial mutation '+t.hash);
const conflict=existsSync(new URL('CONFLICT_COMPLETION_V2.json',dir))?load('CONFLICT_COMPLETION_V2.json'):null;
const latest=conflict?.transactions.at(-1);let reviewFailClosed=null;
if(latest?.actual==='REVIEW_REQUIRED'){
 reviewFailClosed=latest.after.b.state==='REVIEW_REQUIRED'&&latest.after.b.authorization_sha256===''&&latest.after.invoice_b.consumed===false&&['counts','charter','a','invoice_a','invoice_b','ticket_a','ticket_b'].every(k=>JSON.stringify(latest.before[k])===JSON.stringify(latest.after[k]));
 if(!reviewFailClosed)throw Error('Uncertain assessment granted effect / changed budget or invoice graph');
}
const out={checked_at:new Date().toISOString(),receipt_integrity_pass:true,finalized_successful_genvm_receipts:groups.length,full_graph_adversarial_cases:audit?.finished?audit.transactions.length:0,budget_conflict_verified:Boolean(conflict?.finished&&conflict.checks.every(x=>x.pass)),renewed_uncertain_assessment_fail_closed:reviewFailClosed,historical_failed_expectations_preserved:run.checks.filter(x=>!x.pass).length,latest_conflict_result:latest?.actual??null,frontend_origin:'User-performed reported lifecycle with chain corroboration; agent did not observe signing prompts/intermediate UI states.',submission_ready:false};
writeFileSync(new URL('EVIDENCE_INTEGRITY_V2.json',dir),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
