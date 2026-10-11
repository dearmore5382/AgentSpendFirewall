import {createAccount,createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionStatus} from 'genlayer-js/types';
import {existsSync,writeFileSync} from 'node:fs';
const address=process.env.ASF_CONTRACT_ADDRESS;
if(!/^0x[0-9a-fA-F]{40}$/.test(address||''))throw Error('Set replacement ASF_CONTRACT_ADDRESS');
const file=new URL('./LIVE_RUN_V2.json',import.meta.url);
if(existsSync(file))throw Error('Existing checkpoint: inspect/resume, do not overwrite or blindly replay');
const principal=createAccount(process.env.ASF_PRINCIPAL_KEY),agent=createAccount(process.env.ASF_AGENT_KEY);
if(principal.address.toLowerCase()===agent.address.toLowerCase())throw Error('Two distinct auxiliary wallets required');
const reader=createClient({chain:studionet}),p=createClient({chain:studionet,account:principal}),a=createClient({chain:studionet,account:agent});
const out={contract:address,network:'StudioNet',started:new Date().toISOString(),roles:{principal:principal.address,agent_payee:agent.address,deployer_used:false},transactions:[],checks:[],browser_signed:false};
const save=()=>writeFileSync(file,JSON.stringify(out,null,2)+'\n');
async function retry(fn){for(let i=0;i<6;i++){try{return await fn();}catch(e){if(i===5)throw e;await new Promise(r=>setTimeout(r,2000));}}}
const read=(functionName,args=[])=>retry(()=>reader.readContract({address,functionName,args}));
const check=(name,pass,state)=>{out.checks.push({name,pass:Boolean(pass),state});save();if(!pass)throw Error(name);};
async function tx(client,label,functionName,args,expected){
 const row={label,functionName,args,signer:client===p?principal.address:agent.address,before:await read('get_counts'),status:'SUBMITTING'};out.transactions.push(row);save();
 // Never retry a send after an unknown response: it may already have reached the network.
 const response=await client.writeContract({address,functionName,args,value:0n});row.hash=typeof response==='string'?response:response.txId;row.status='SUBMITTED';save();console.log(label,row.hash);
 await retry(()=>reader.waitForTransactionReceipt({hash:row.hash,status:TransactionStatus.FINALIZED,interval:5000,retries:240}));row.status='FINALIZED';row.receipt=await retry(()=>reader.getTransaction({hash:row.hash}));row.after=await read('get_counts');save();
 const leaders=row.receipt.consensus_data?.leader_receipt||[];
 const success=leaders.filter(x=>x.execution_result==='SUCCESS'&&x.result?.status==='return'&&typeof x.result.payload?.readable==='string').at(-1);
 const actual=success?JSON.parse(success.result.payload.readable):null;
 check(label+' successful GenVM and expected return',!!success&&actual===expected,{actual,expected,agree:Object.values(row.receipt.consensus_data?.votes||{}).filter(x=>x==='agree').length});
 return row;
}
const policy=ref=>JSON.stringify({schema:'agent-spend-policy-v1',charter_ref:ref,purposes:[{purpose_id:'HOSTING',description:'Cloud hosting and infrastructure services only.'}]});
const invoice=(ref,tag)=>JSON.stringify({schema:'agent-invoice-v1',invoice_ref:ref,line_id:'LINE-01',narrative:'Managed cloud hosting service for October.',artifact_sha256:tag.repeat(64)});
const snap=async c=>({counts:await read('get_counts'),charter:await read('get_charter',[c])});
async function deny(client,label,method,args,expected,c){const before=await snap(c);await tx(client,label,method,args,expected);const after=await snap(c);check(label+' no counts/budget/charter mutation',JSON.stringify(before)===JSON.stringify(after),{before,after});}
async function charter(ref,max,cap){const id=(await read('get_counts')).charter_count;await tx(p,'create '+ref,'create_charter',[agent.address,'0x0000000000000000000000000000000000000001',agent.address,max,cap,policy(ref)],id);return id;}
async function publish(c,ref,tag,amount){const id=(await read('get_counts')).invoice_count;await tx(a,'publish '+tag,'publish_invoice',[c,amount,invoice(ref,tag)],id);const inv=await read('get_invoice',[id]);check('payee attestation, not independent fact '+tag,inv.evidence_level==='PAYEE_ATTESTED_ONLY'&&inv.payment_verified===false&&inv.artifact_digest_verified===false,inv);return id;}
async function request(i,nonce){const id=(await read('get_counts')).intent_count;await tx(a,'request '+nonce,'request_intent',[i,nonce],id);return id;}
try{
 const v=await read('get_contract_version');check('exact v2 identity',v.version===2&&v.schema==='invoice-single-use-agent-spend-v2',v);
 const c=await charter('ASF-V2-HAPPY',50,60);out.happy_charter=c;save();
 await deny(p,'wrong invoice publisher','publish_invoice',[c,40,invoice('ASF-V2-HAPPY','1')],'PAYEE_ONLY',c);
 const i=await publish(c,'ASF-V2-HAPPY','1',40);
 await deny(p,'wrong intent requester','request_intent',[i,'WRONG'],'AGENT_ONLY',c);
 const t=await request(i,'FIRST');out.happy_intent=t;save();
 await deny(a,'same invoice different nonce pending','request_intent',[i,'SECOND'],'INVOICE_ALREADY_HAS_INTENT',c);
 await tx(p,'open assessor happy','assess_intent',[t],'AUTHORIZED');const auth=(await read('get_intent',[t])).authorization_sha256;
 await deny(a,'same invoice different nonce authorized','request_intent',[i,'THIRD'],'INVOICE_ALREADY_HAS_INTENT',c);
 await deny(p,'wrong consumer','consume_authorization',[t,auth],'AGENT_ONLY',c);
 await deny(a,'wrong digest','consume_authorization',[t,'00'.repeat(32)],'AUTHORIZATION_MISMATCH',c);
 check('wrong digest leaves intent authorized',(await read('get_intent',[t])).state==='AUTHORIZED',await read('get_intent',[t]));
 await tx(a,'consume whole invoice','consume_authorization',[t,auth],'CONSUMED');const ticket=await read('get_execution_receipt',[t]);
 check('invoice and ticket consumed once, not paid',(await read('get_charter',[c])).spent===40&&(await read('get_invoice',[i])).consumed===true&&ticket.authorization_sha256===auth&&ticket.payment_verified===false,ticket);
 await deny(a,'same invoice different nonce consumed','request_intent',[i,'FOURTH'],'INVOICE_ALREADY_HAS_INTENT',c);
 await deny(a,'double consume','consume_authorization',[t,auth],'AUTHORIZATION_NOT_ACTIVE',c);
 await deny(a,'assess consumed','assess_intent',[t],'INTENT_NOT_ASSESSABLE',c);
 await deny(a,'wrong revoker','revoke_charter',[c],'PRINCIPAL_ONLY',c);
 // Fresh charter: independently authorized invoices contend for the same cap.
 const cb=await charter('ASF-V2-BUDGET',40,60),ib1=await publish(cb,'ASF-V2-BUDGET','2',40),ib2=await publish(cb,'ASF-V2-BUDGET','3',40);
 const tb1=await request(ib1,'B-A'),tb2=await request(ib2,'B-B');
 await tx(p,'assess budget A','assess_intent',[tb1],'AUTHORIZED');await tx(p,'assess budget B','assess_intent',[tb2],'AUTHORIZED');
 await tx(a,'consume budget A','consume_authorization',[tb1,(await read('get_intent',[tb1])).authorization_sha256],'CONSUMED');
 await tx(a,'budget conflict B','consume_authorization',[tb2,(await read('get_intent',[tb2])).authorization_sha256],'BUDGET_EXCEEDED');
 check('budget conflict preserves unpaid invoice and cap',(await read('get_charter',[cb])).spent===40&&(await read('get_intent',[tb2])).state==='STALE_BUDGET'&&(await read('get_invoice',[ib2])).consumed===false,{charter:await read('get_charter',[cb]),invoice:await read('get_invoice',[ib2])});
 const cr=await charter('ASF-V2-REVOKE',50,60),ir=await publish(cr,'ASF-V2-REVOKE','4',10),tr=await request(ir,'REVOKE');
 await tx(p,'assess revoke case','assess_intent',[tr],'AUTHORIZED');const ar=(await read('get_intent',[tr])).authorization_sha256;
 await tx(p,'revoke before consume','revoke_charter',[cr],'CHARTER_REVOKED');await tx(a,'revocation wins','consume_authorization',[tr,ar],'CHARTER_NOT_ACTIVE');
 check('revoked ticket cannot execute',(await read('get_intent',[tr])).state==='REVOKED'&&(await read('get_charter',[cr])).spent===0&&(await read('get_execution_receipt',[tr])).error==='NOT_CONSUMED',{intent:await read('get_intent',[tr]),invoice:await read('get_invoice',[ir])});
 await tx(p,'revoke after consumed','revoke_charter',[c],'CHARTER_REVOKED');check('consumed ticket remains irreversible, not paid',JSON.stringify(await read('get_execution_receipt',[t]))===JSON.stringify(ticket),await read('get_execution_receipt',[t]));
 out.finished=new Date().toISOString();out.final_counts=await read('get_counts');save();console.log('PASS');
}catch(e){out.error=String(e);save();throw e;}
