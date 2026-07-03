#!/usr/bin/env node
// contracts:validate — 契约校验器（ADR-102/ADR-104）
// 1) 所有 json-schema/**/*.schema.json 必须可解析并能被 Ajv(2020-12) 编译（含 ggw:// 跨引用）
// 2) 所有 asyncapi/*.yaml 与 openapi/*.yaml 必须可解析且含版本标识
// 3) 所有 fixtures/*.json 必须可解析；带 $schema_ref 的条目按对应 Schema 校验
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parse as parseYaml } from 'yaml';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

function* walk(dir, ext) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, ext);
    else if (ext.some((e) => name.endsWith(e))) yield p;
  }
}

// ---- 1. JSON Schemas ----
console.log('[1/3] JSON Schemas');
const ajv = new Ajv2020.default({ strict: false, allErrors: true, allowUnionTypes: true });
addFormats.default(ajv);

const schemaFiles = [...walk(join(ROOT, 'json-schema'), ['.schema.json'])];
const parsed = [];
for (const f of schemaFiles) {
  const rel = relative(ROOT, f);
  try {
    const s = JSON.parse(readFileSync(f, 'utf8'));
    parsed.push([rel, s]);
    if (s.$id) ajv.addSchema(s, s.$id);
  } catch (e) {
    fail(`${rel}: JSON 解析失败 — ${e.message}`);
  }
}
for (const [rel, s] of parsed) {
  try {
    ajv.compile(s);
    ok(rel);
  } catch (e) {
    fail(`${rel}: Schema 编译失败 — ${e.message}`);
  }
}
if (schemaFiles.length === 0) fail('json-schema/ 下没有任何 *.schema.json');

// ---- 2. AsyncAPI / OpenAPI YAML ----
console.log('[2/3] AsyncAPI / OpenAPI');
for (const f of [...walk(join(ROOT, 'asyncapi'), ['.yaml', '.yml'])]) {
  const rel = relative(ROOT, f);
  try {
    const doc = parseYaml(readFileSync(f, 'utf8'));
    if (!doc?.asyncapi) fail(`${rel}: 缺少 asyncapi 版本字段`);
    else ok(`${rel} (asyncapi ${doc.asyncapi})`);
  } catch (e) {
    fail(`${rel}: YAML 解析失败 — ${e.message}`);
  }
}
for (const f of [...walk(join(ROOT, 'openapi'), ['.yaml', '.yml'])]) {
  const rel = relative(ROOT, f);
  try {
    const doc = parseYaml(readFileSync(f, 'utf8'));
    if (!doc?.openapi) fail(`${rel}: 缺少 openapi 版本字段`);
    else ok(`${rel} (openapi ${doc.openapi})`);
  } catch (e) {
    fail(`${rel}: YAML 解析失败 — ${e.message}`);
  }
}

// ---- 3. Fixtures ----
console.log('[3/3] Fixtures');
for (const f of [...walk(join(ROOT, 'fixtures'), ['.json'])]) {
  const rel = relative(ROOT, f);
  try {
    const data = JSON.parse(readFileSync(f, 'utf8'));
    // 约定：fixture 文件或其条目可带 $schema_ref（ggw:// $id），存在则强校验
    const items = Array.isArray(data) ? data : [data];
    let checked = 0;
    for (const item of items) {
      const ref = item?.$schema_ref;
      if (ref) {
        const validate = ajv.getSchema(ref);
        if (!validate) {
          fail(`${rel}: 未知 $schema_ref ${ref}`);
          continue;
        }
        const { $schema_ref, ...payload } = item;
        if (!validate(payload)) {
          fail(`${rel}: 不符合 ${ref} — ${ajv.errorsText(validate.errors)}`);
        } else checked++;
      }
    }
    ok(`${rel}${checked ? `（${checked} 条已按 Schema 强校验）` : ''}`);
  } catch (e) {
    fail(`${rel}: JSON 解析失败 — ${e.message}`);
  }
}

console.log(failures ? `\n✗ ${failures} 个失败` : '\n✓ 契约校验全部通过');
process.exit(failures ? 1 : 0);
