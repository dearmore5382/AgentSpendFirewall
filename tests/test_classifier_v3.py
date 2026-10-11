from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
import pytest
import test_contract_direct as base

V3=Path(__file__).resolve().parents[1]/'contracts'/'AgentSpendFirewallV3.py'

def loaded():
 with patch.object(base,'FILE',V3):
  vm,c,p,a=base.deploy()
 return vm,c,p,a,c._instance.create_charter.__globals__

def test_v3_identity_and_preserved_single_invoice_and_budget_enforcement():
 vm,c,p,a,m=loaded()
 assert c.get_contract_version()=={'name':'AgentSpendFirewall','version':3,'schema':'diagnostic-single-use-agent-spend-v3'}
 cid=base.setup(vm,c,p,a,40,60)
 with vm.prank(a):
  base.sync(vm,c);x=c.publish_invoice(cid,40,base.invoice());y=c.publish_invoice(cid,40,base.invoice(artifact='22'*32));ta=c.request_intent(x,'A');tb=c.request_intent(y,'B')
  assert c.request_intent(x,'A2')=='INVOICE_ALREADY_HAS_INTENT'
 ok={'purpose':'HOSTING','confidence_boundary':'SUFFICIENT','invoice_citations':['LINE-01'],'diagnostic':'CLASSIFIED'}
 with vm.prank(a),patch.dict(m,{'_classify':lambda *_:ok}):
  base.sync(vm,c);assert c.assess_intent(ta)=='AUTHORIZED';assert c.assess_intent(tb)=='AUTHORIZED'
  assert c.consume_authorization(ta,c.get_intent(ta)['authorization_sha256'])=='CONSUMED'
  assert c.consume_authorization(tb,c.get_intent(tb)['authorization_sha256'])=='BUDGET_EXCEEDED'
  assert c.request_intent(y,'B2')=='INVOICE_ALREADY_HAS_INTENT'
 assert c.get_charter(cid)['spent']==40 and c.get_intent(tb)['state']=='STALE_BUDGET'
 assert not c.get_invoice(y)['consumed'] and c.get_execution_receipt(tb)=={'error':'NOT_CONSUMED'}

@pytest.mark.parametrize('raw',[None,[],{'purpose':'HOSTING'}, {'purpose':'HOSTING','confidence_boundary':'SUFFICIENT','invoice_citations':['FAKE']},{'purpose':'HOSTING','confidence_boundary':'SUFFICIENT','invoice_citations':['LINE-01'],'extra':True},'not json',{'purpose':True,'confidence_boundary':'SUFFICIENT','invoice_citations':['LINE-01']}])
def test_invalid_model_output_is_not_semantic_uncertainty(raw):
 *_,m=loaded();obs=m['_model_result'](raw,['HOSTING'],'LINE-01')
 assert obs['diagnostic']=='INVALID_MODEL_OUTPUT' and obs['purpose']=='UNKNOWN'
 assert not m['_agrees'](obs,obs,['HOSTING'],'LINE-01')

def test_valid_uncertain_verdict_has_no_technical_retry():
 *_,m=loaded();calls=[]
 def response(*a,**k):calls.append(1);return {'purpose':'UNKNOWN','confidence_boundary':'INSUFFICIENT','invoice_citations':['LINE-01']}
 with patch.dict(m,{'gl':SimpleNamespace(nondet=SimpleNamespace(exec_prompt=response))}):obs=m['_observe']({'purposes':[{'purpose_id':'HOSTING','description':'Cloud hosting.'}]},{'line_id':'LINE-01','narrative':'Unclear service.'})
 assert len(calls)==1 and obs['diagnostic']=='SEMANTIC_UNCERTAINTY'
 assert m['_agrees'](obs,obs,['HOSTING'],'LINE-01')

def test_call_failure_is_bounded_and_cannot_agree():
 *_,m=loaded();calls=[]
 def response(*a,**k):calls.append(1);raise TimeoutError('synthetic provider outage')
 with patch.dict(m,{'gl':SimpleNamespace(nondet=SimpleNamespace(exec_prompt=response))}):obs=m['_observe']({'purposes':[{'purpose_id':'HOSTING','description':'Cloud hosting.'}]},{'line_id':'LINE-01'})
 assert len(calls)==2 and obs['diagnostic']=='MODEL_CALL_FAILED'
 assert not m['_agrees'](obs,obs,['HOSTING'],'LINE-01')

def test_malformed_response_can_recover_with_one_valid_response():
 *_,m=loaded();responses=iter([{'bad':'schema'},{'purpose':'HOSTING','confidence_boundary':'SUFFICIENT','invoice_citations':['LINE-01']}]);calls=[]
 def response(*a,**k):calls.append(1);return next(responses)
 with patch.dict(m,{'gl':SimpleNamespace(nondet=SimpleNamespace(exec_prompt=response))}):obs=m['_observe']({'purposes':[{'purpose_id':'HOSTING','description':'Cloud hosting.'}]},{'line_id':'LINE-01'})
 assert len(calls)==2 and obs['diagnostic']=='CLASSIFIED'

def test_positive_requires_independent_matching_purpose_and_valid_citation():
 *_,m=loaded();good=m['_model_result']({'purpose':'HOSTING','confidence_boundary':'SUFFICIENT','invoice_citations':['LINE-01']},['HOSTING'],'LINE-01');other=m['_model_result']({'purpose':'OTHER','confidence_boundary':'SUFFICIENT','invoice_citations':['LINE-01']},['HOSTING'],'LINE-01')
 assert m['_agrees'](good,good,['HOSTING'],'LINE-01')
 assert not m['_agrees'](good,other,['HOSTING'],'LINE-01')

def test_v3_uncertainty_does_not_release_invoice_or_consume_budget():
 vm,c,p,a,m=loaded();cid=base.setup(vm,c,p,a)
 with vm.prank(a):base.sync(vm,c);i=c.publish_invoice(cid,20,base.invoice());t=c.request_intent(i,'UNCLEAR')
 unknown={'purpose':'UNKNOWN','confidence_boundary':'INSUFFICIENT','invoice_citations':['LINE-01'],'diagnostic':'SEMANTIC_UNCERTAINTY'}
 with vm.prank(a),patch.dict(m,{'_classify':lambda *_:unknown}):
  base.sync(vm,c);assert c.assess_intent(t)=='REVIEW_REQUIRED';assert c.request_intent(i,'NEW')=='INVOICE_ALREADY_HAS_INTENT'
 assert c.get_charter(cid)['spent']==0 and c.get_intent(t)['authorization_sha256']=='' and not c.get_invoice(i)['consumed']
