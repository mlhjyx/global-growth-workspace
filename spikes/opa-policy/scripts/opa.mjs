// SPK-OPA — 经 docker run openpolicyagent/opa 驱动 opa test / opa eval。
// 版本固定 1.18.2（Rego v1）；spike 目录以只读 bind mount 挂入容器。

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IMAGE = "openpolicyagent/opa:1.18.2";
const here = path.dirname(fileURLToPath(import.meta.url));
const spikeRoot = path.resolve(here, "..");
const mount = `${spikeRoot.replaceAll("\\", "/")}:/spike:ro`;

const opa = (args) =>
  spawnSync("docker", ["run", "--rm", "-v", mount, IMAGE, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });

const mode = process.argv[2];

if (mode === "test") {
  const res = opa(["test", "/spike/policies", "/spike/fixtures/data.json", "-v"]);
  process.stdout.write(res.stdout ?? "");
  process.stderr.write(res.stderr ?? "");
  process.exit(res.status ?? 1);
}

if (mode === "eval") {
  const inputsDir = path.join(spikeRoot, "fixtures", "inputs");
  const files = readdirSync(inputsDir).filter((f) => f.endsWith(".json")).sort();
  let failed = 0;
  for (const f of files) {
    const res = opa([
      "eval",
      "--format=json",
      "-i", `/spike/fixtures/inputs/${f}`,
      "-d", "/spike/policies",
      "data.ggw.policy.decision",
    ]);
    if (res.status !== 0) {
      failed += 1;
      console.error(`ERROR ${f}\n${res.stderr}`);
      continue;
    }
    const decision = JSON.parse(res.stdout)?.result?.[0]?.expressions?.[0]?.value;
    const expected = JSON.parse(readFileSync(path.join(inputsDir, f), "utf8"))._meta
      ?.expected_decision;
    const ok =
      expected == null ||
      (decision?.allow === expected.allow &&
        decision?.require_approval === expected.require_approval &&
        JSON.stringify(decision?.reason_codes) === JSON.stringify(expected.reason_codes));
    console.log(`${ok ? "PASS" : "FAIL"}  ${f}`);
    console.log(`      decision = ${JSON.stringify(decision)}`);
    if (!ok) {
      failed += 1;
      console.log(`      expected = ${JSON.stringify(expected)}`);
    }
  }
  console.log(`opa eval demo: ${files.length - failed}/${files.length} matched expectations`);
  process.exit(failed > 0 ? 1 : 0);
}

console.error("usage: node scripts/opa.mjs <test|eval>");
process.exit(2);
