from pathlib import Path

SOURCE=(Path(__file__).resolve().parents[1]/"src"/"main.tsx").read_text(encoding="utf-8")

def test_finality_is_confirmed_by_authoritative_readback_not_optional_receipt_label():
    assert 'status:TransactionStatus.FINALIZED' in SOURCE
    assert 'receipt.resultName!=="MAJORITY_AGREE"' not in SOURCE
    assert 'record count did not advance' in SOURCE
    assert 'UI will not claim success' in SOURCE

def test_sdk_object_and_json_string_readbacks_are_both_supported():
    assert 'typeof value==="string"?JSON.parse(value):value' in SOURCE
    assert 'Unexpected contract readback shape' in SOURCE

def test_each_consequential_write_has_a_chain_state_expectation():
    assert 'assess_intent:"AUTHORIZED|DENIED|REVIEW_REQUIRED|REVOKED|STALE_BUDGET"' in SOURCE
    assert 'consume_authorization:"CONSUMED"' in SOURCE
    assert 'revoke_charter:"REVOKED"' in SOURCE

def test_v3_identity_wallet_change_hash_shape_and_invoice_readback_guards():
    # Static integration guards only; not evidence of browser signing.
    assert 'v.version!==3' in SOURCE and 'diagnostic-single-use-agent-spend-v3' in SOURCE
    assert 'eth_accounts' in SOURCE and 'Wallet account changed' in SOURCE
    assert 'typeof response==="string"?response:' in SOURCE
    assert 'get_execution_receipt' in SOURCE and 'inv.consumed!==true' in SOURCE
    assert 'PAYEE_ATTESTED_ONLY' in SOURCE and 'CONSUMED is not payment confirmation' in SOURCE
