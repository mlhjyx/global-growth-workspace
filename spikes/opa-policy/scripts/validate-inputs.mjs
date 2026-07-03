// SPK-OPA — 用真实契约 schema 校验演示输入（fixtures 驱动的证明）：
//   1) 每个 eval 输入过 spike 提案的 PolicyDecisionInput schema；
//   2) 其中嵌入的 authorization 直接以 packages/contracts 的
//      execution-authorization.schema.json（含 primitives/channel-plan $ref）校验；
//   3) fixtures/data.json 里的 execution_authorization 同样过契约校验。

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";

const Ajv2020 = Ajv2020Module.default ?? Ajv2020Module;
const addFormats = addFormatsModule.default ?? addFormatsModule;

const here = path.dirname(fileURLToPath(import.meta.url));
const spikeRoot = path.resolve(here, "..");
const repoRoot = path.resolve(spikeRoot, "..", "..");
const contractsSchemas = path.join(repoRoot, "packages", "contracts", "json-schema");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

// 真实契约 schema（只读引用）
for (const rel of [
  ["common", "primitives.schema.json"],
  ["campaign", "channel-plan.schema.json"],
  ["campaign", "execution-authorization.schema.json"],
]) {
  ajv.addSchema(readJson(path.join(contractsSchemas, ...rel)));
}
// spike 提案输入 schema
ajv.addSchema(readJson(path.join(spikeRoot, "schemas", "policy-input.schema.json")));

const validateInput = ajv.getSchema("ggw://spike/opa-policy/policy-input");
const validateAuth = ajv.getSchema("ggw://contracts/campaign/execution-authorization");

let failures = 0;
const check = (label, validator, doc) => {
  if (validator(doc)) {
    console.log(`PASS  ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${label}`);
    for (const err of validator.errors ?? []) {
      console.error(`      ${err.instancePath || "/"} ${err.message}`);
    }
  }
};

const dataDoc = readJson(path.join(spikeRoot, "fixtures", "data.json"));
check(
  "fixtures/data.json#execution_authorization ⇐ ggw://contracts/campaign/execution-authorization",
  validateAuth,
  dataDoc.fixtures.execution_authorization,
);

const inputsDir = path.join(spikeRoot, "fixtures", "inputs");
for (const f of readdirSync(inputsDir).filter((f) => f.endsWith(".json")).sort()) {
  const doc = readJson(path.join(inputsDir, f));
  check(`fixtures/inputs/${f} ⇐ policy-input.schema`, validateInput, doc);
  if (doc.authorization) {
    check(
      `fixtures/inputs/${f}#authorization ⇐ ggw://contracts/campaign/execution-authorization`,
      validateAuth,
      doc.authorization,
    );
  }
}

if (failures > 0) {
  console.error(`validate-inputs: ${failures} failure(s)`);
  process.exit(1);
}
console.log("validate-inputs: all inputs conform to contract/proposal schemas");
