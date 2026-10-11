import {createClient,createAccount} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionStatus} from 'genlayer-js/types';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const address='0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d',file=new URL('./CONFLICT_COMPLETION_V2.json',import.meta.url);
const p=createAccount(process.env.ASF_PRINCIPAL_KEY),a=createAccount(process.env.ASF_AGENT_KEY),r=createClient({chain:studionet}),pw=createClient({chain:studionet,account:p}),aw=createClient({chain:studionet,account:a});
const o=existsSync(file)?JSON.parse(readFileSync(file)):{contract:address,started:new Date().toISOString(),expected:'Both intents 1/2 AUTHORIZED, consume 1=CONSUMED, consume 2=BUDGET_EXCEEDED; spent40<=cap60, second invoice unconsumed, no second ticket.',transactions:[],checks:[]};
const save=()=>writeFileSync(file,JSON.stringify(o,null,2)+'\n');
const read=async(fn,id)=>{await new Promise(q=>setTimeout(q,2600));return r.readContract({address,functionName:fn,args:id===undefined?[]:[id]});};
const snap=async()=>({counts:await read('get_counts'),charter:await read('get_charter',1),a:await read('get_intent',1),b:await read('get_intent',2),invoice_a:await read('get_invoice',1),invoice_b:await read('get_invoice',2),ticket_a:await read('get_execution_receipt',1),ticket_b:await read('get_execution_receipt',2)});
async function tx(w,label,fn,args,expected){let t=o.transactions.find(x=>x.label===label);if(!t){t={label,fn,args,expected,signer:w===pw?p.address:a.address,status:'PREPARED',before:await snap()};o.transactions.push(t);save();const response=await w.writeContract({address,functionName:fn,args,value:0n});t.hash=typeof response==='string'?response:response.txId;t.status='SUBMITTED';save();console.log(label,t.hash);}if(!t.hash)throw Error('Unknown send; reconcile before retry');if(t.status!=='FINALIZED'){await r.waitForTransactionReceipt({hash:t.hash,status:TransactionStatus.FINALIZED,interval:6000,retries:240});t.receipt=await r.getTransaction({hash:t.hash});t.after=await snap();t.status='FINALIZED';const l=t.receipt.consensus_data.leader_receipt.filter(x=>x.execution_result==='SUCCESS'&&x.result?.status==='return').at(-1);t.actual=l?JSON.parse(l.result.payload.readable):null;t.agree=Object.values(t.receipt.consensus_data.votes).filter(x=>x==='agree').length;save();}if(t.actual!==expected||t.agree<3)throw Error(label+' actual '+t.actual);return t;}
try{
 o.initial??=await snap();save();let b=await read('get_intent',2);
 if(b.state==='REVIEW_REQUIRED'&&!o.transactions.some(x=>x.label==='renewed bounded assessment B'))await tx(pw,'renewed bounded assessment B','assess_intent',[2],'AUTHORIZED');
 b=await read('get_intent',2);if(b.state!=='AUTHORIZED')throw Error('Still non-authorized; no forced consumption');
 const a1=await read('get_intent',1);if(a1.state!=='AUTHORIZED'&&!o.transactions.some(x=>x.label==='consume budget A'))throw Error('Unexpected intent A state');
 await tx(aw,'consume budget A','consume_authorization',[1,a1.authorization_sha256],'CONSUMED');
 await tx(aw,'budget conflict B','consume_authorization',[2,b.authorization_sha256],'BUDGET_EXCEEDED');
 o.final=await snap();const f=o.final;const ok=f.charter.spent===40&&f.charter.lifetime_cap===60&&f.a.state==='CONSUMED'&&f.b.state==='STALE_BUDGET'&&f.invoice_a.consumed===true&&f.invoice_b.consumed===false&&f.ticket_b.error==='NOT_CONSUMED';o.checks.push({name:'authorized competing invoices fail closed at consumption',pass:ok});save();if(!ok)throw Error('Conflict invariant failed');
 const pre=await snap();await tx(aw,'new nonce cannot reopen stale invoice','request_intent',[2,'STALE-REPLAY-20261011'],'INVOICE_ALREADY_HAS_INTENT');const post=await snap();o.checks.push({name:'stale invoice replay complete no mutation',pass:JSON.stringify(pre)===JSON.stringify(post),pre,post});if(JSON.stringify(pre)!==JSON.stringify(post))throw Error('Replay mutation');
 o.finished=new Date().toISOString();delete o.error;save();console.log('COMPLETE');
}catch(e){o.error=String(e);save();throw e;}
