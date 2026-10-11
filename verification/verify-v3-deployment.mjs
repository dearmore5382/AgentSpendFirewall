import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const address = process.argv[2];
if (!/^0x[0-9a-fA-F]{40}$/.test(address || "")) throw new Error("Pass the deployed contract address");
const client = createClient({ chain: studionet });
const local = readFileSync(new URL("../contracts/AgentSpendFirewallV3.py", import.meta.url));
const encoded = await client.request({ method: "gen_getContractCode", params: [address] });
const remote = Buffer.from(encoded, "base64");
const identity = await client.readContract({ address, functionName: "get_contract_version", args: [] });
const counts = await client.readContract({ address, functionName: "get_counts", args: [] });
const sha256 = b => createHash("sha256").update(b).digest("hex");
const result = {
  status: "VERIFIED_SOURCE_IDENTITY",
  contract_address: address,
  network: "GenLayer StudioNet",
  source_rpc: "gen_getContractCode",
  encoding: "base64",
  source_equal: local.equals(remote),
  local_source_sha256: sha256(local),
  deployed_source_sha256: sha256(remote),
  identity,
  initial_counts: counts,
  verified_at: new Date().toISOString()
};
if (!result.source_equal) result.status = "SOURCE_MISMATCH";
if (identity?.name !== "AgentSpendFirewall" || identity?.version !== 3 || identity?.schema !== "diagnostic-single-use-agent-spend-v3") result.status = "IDENTITY_MISMATCH";
writeFileSync(new URL("./DEPLOYMENT_V3.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
if (result.status !== "VERIFIED_SOURCE_IDENTITY") process.exitCode = 2;
