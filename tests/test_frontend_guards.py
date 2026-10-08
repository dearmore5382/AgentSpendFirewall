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
    assert 'assess_intent:"AUTHORIZED|DENIED|REVIEW_REQUIRED"' in SOURCE
    assert 'consume_authorization:"CONSUMED"' in SOURCE
    assert 'revoke_charter:"REVOKED"' in SOURCE
