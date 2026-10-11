import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {writeFileSync} from 'node:fs';
const client=createClient({chain:studionet}),address='0xf9d938DA226CDC523c7c476a2A4d5e3895c2fE5d';
const specs=[
['create_charter','0x4eba605cfc84cf2bbca88efd152e56702cab640daaef1418b4145a4873ba11de'],
['publish_invoice','0x692f3236d2c8164f74726a308e423cc8981f3b73730c04a18c7f319bc96cac0b'],
['request_intent','0x1c1e9f9c3d590b973abaa5c66a0813142dc233810799c4ebfa89eddaeae5a052'],
['assess_intent','0xdadcae300f10a2fdeff02299294de083b86d0a270df9813dde0f4b003f424846'],
['consume_authorization','0x21432fb72b50879a44b0fe22cc7386f6e0466450305f899f756b6282b33d42b8'],
['revoke_charter','0x1240edfbb72ddfdc8ccc8fb2e2f0d8c570854f84b98a7832ba751eb81153a6b5']];
const out={contract:address,captured_at:new Date().toISOString(),provenance:'User reports signing the instructed frontend lifecycle. Explorer screenshot corroborates six calls from main wallet; signing prompts and intermediate UI states were not independently recorded by agent.',signer:'0xFf36b56CcA032C559e52e2A4F20c2C594B02Fe37',transactions:[]};
for(const [method,hash] of specs){const receipt=await client.getTransaction({hash});const l=receipt.consensus_data?.leader_receipt?.filter(x=>x.execution_result==='SUCCESS'&&x.result?.status==='return').at(-1);out.transactions.push({method,hash,receipt,return_value:l?.result?.payload?.readable,agree:Object.values(receipt.consensus_data?.votes??{}).filter(x=>x==='agree').length});await new Promise(r=>setTimeout(r,2500));}
const ids=out.transactions.slice(0,3).map(t=>Number(JSON.parse(t.return_value)));
out.ids={charter:ids[0],invoice:ids[1],intent:ids[2]};
out.readbacks={};
for(const [key,fn,id] of [['charter','get_charter',ids[0]],['invoice','get_invoice',ids[1]],['intent','get_intent',ids[2]],['ticket','get_execution_receipt',ids[2]]]){out.readbacks[key]=await client.readContract({address,functionName:fn,args:[id]});await new Promise(r=>setTimeout(r,2500));}
writeFileSync(new URL('./USER_WALLET_LIFECYCLE_V2.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({ids:out.ids,transactions:out.transactions.map(t=>({method:t.method,status:t.receipt.status,result:t.return_value,agree:t.agree})),states:{charter:out.readbacks.charter.state,intent:out.readbacks.intent.state,invoice_consumed:out.readbacks.invoice.consumed,payment_verified:out.readbacks.ticket.payment_verified}},null,2));
