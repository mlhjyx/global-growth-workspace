// SPK-OPA — 从 packages/contracts/fixtures 生成 OPA 测试 data 文档与 opa eval 演示输入。
// 只读 contracts（不写回）；产物落在 spikes/opa-policy/fixtures/**。
// DoD 依据：SPK-OPA 行「用 contracts 的 ExecutionAuthorization fixtures 驱动（不依赖 BE-04）」。

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const spikeRoot = path.resolve(here, "..");
const repoRoot = path.resolve(spikeRoot, "..", "..");
const contractsFixtures = path.join(repoRoot, "packages", "contracts", "fixtures");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const campaignFixtures = readJson(path.join(contractsFixtures, "campaign.json"));
const workspaceFixtures = readJson(path.join(contractsFixtures, "workspace.json"));

// —— 提取契约 fixture（剥离 $schema_ref 装饰键，additionalProperties:false 下它不属于实体本身）——
const pick = (list, ref) => {
  const hit = list.find((f) => f.$schema_ref === ref);
  if (!hit) throw new Error(`fixture not found: ${ref}`);
  const { $schema_ref, ...entity } = hit;
  return entity;
};

const auth = pick(campaignFixtures, "ggw://contracts/campaign/execution-authorization");
const workspace = pick(workspaceFixtures, "ggw://contracts/workspace/workspace");
const ownerMembership = workspaceFixtures.find(
  (f) => f.$schema_ref === "ggw://contracts/workspace/membership" && f.roles?.includes("OWNER"),
);
if (!ownerMembership) throw new Error("OWNER membership fixture not found");

// —— 有效期内的确定性评估时刻（取授权窗口中点，避免依赖墙钟）——
const midpointIso = (fromIso, untilIso) => {
  const mid = (Date.parse(fromIso) + Date.parse(untilIso)) / 2;
  return new Date(mid).toISOString().replace(/\.\d{3}Z$/, "Z");
};
const inWindow = midpointIso(auth.valid_from, auth.valid_until);

// —— spike 提案形状：Workspace 级跨境模型授权（契约缺口，REPORT.md 登记）——
const workspaceModelGrant = {
  id: "wmga_01JZWMGA000000000000000001",
  workspace_id: workspace.id,
  status: "ACTIVE",
  granted_by: ownerMembership.id, // Workspace 管理员级授权（M1 §5-C）
  boundaries: {
    providers: ["anthropic", "azure_openai"],
    regions: ["ap-southeast-1", "us-east-1"], // 对齐 Workspace data_region=SG 的近区优先
    data_classes: ["PUBLIC", "INTERNAL"], // primitives.privacy_classification 子集
    tasks: ["company_understanding", "content_generation", "market_scan_summary"],
  },
  budget_cap: { amount: 500, currency: "USD" },
  valid_from: "2026-06-01T00:00:00Z",
  valid_until: "2026-12-31T00:00:00Z",
};

// —— spike 提案形状：Approval Token（WSP-006 语义；实体契约缺口，REPORT.md 登记）——
const approvalToken = {
  id: "aprt_01JZAPRT000000000000000001",
  workspace_id: workspace.id,
  approval_rule_id: "apr_01JZAPRR000000000000000001",
  status: "GRANTED",
  governed_actions: ["DATA_EXPORT"],
  resource_ids: ["exp_job_20260701_001"],
  granted_by: ownerMembership.id,
  granted_at: "2026-07-01T07:30:00Z",
  expires_at: "2026-07-01T09:30:00Z", // approval_token_ttl_minutes=120 的效果
};

// —— opa test 的 data 文档 ——
const dataDoc = {
  fixtures: {
    execution_authorization: auth,
    workspace_model_authorization: workspaceModelGrant,
    approval_token: approvalToken,
  },
};

// —— opa eval 演示输入（真实契约形状驱动）——
const outboundOkAction = {
  type: "OUTBOUND_SEND",
  workspace_id: auth.workspace_id,
  campaign_id: auth.campaign_id,
  authorization_id: auth.id,
  channel: auth.scope.channels[0],
  action_type: auth.scope.allowed_action_types[0],
  template_ref: auth.templates[0].template_ref,
  content_hash: auth.templates[0].content_hash,
  audience_id: auth.scope.audience_refs[0].audience_id,
  actions_executed_total: 120,
  requested_at: inWindow,
};

const denyChannel = ["X", "TIKTOK", "WECHAT"].find((c) => !auth.scope.channels.includes(c));

const inputs = {
  "input-01-outbound-in-scope-allow.json": {
    _meta: {
      case: "OUTBOUND_SEND 命中有效 ExecutionAuthorization 且完全在固化范围内",
      derived_from: "packages/contracts/fixtures/campaign.json → " + auth.id,
      expected_decision: { allow: true, require_approval: false, reason_codes: [] },
    },
    action: outboundOkAction,
    authorization: auth,
  },
  "input-02-outbound-out-of-scope-deny.json": {
    _meta: {
      case: "OUTBOUND_SEND 范围外：渠道不在白名单 + 已达 max_total_actions + 授权已过期",
      derived_from: "packages/contracts/fixtures/campaign.json → " + auth.id,
      expected_decision: {
        allow: false,
        require_approval: false,
        reason_codes: [
          "AUTHORIZATION_EXPIRED",
          "CHANNEL_NOT_AUTHORIZED",
          "MAX_TOTAL_ACTIONS_EXCEEDED",
        ],
      },
    },
    action: {
      ...outboundOkAction,
      channel: denyChannel,
      actions_executed_total: auth.scope.max_total_actions,
      requested_at: auth.valid_until,
    },
    authorization: auth,
  },
  "input-03-export-no-approval-require-approval.json": {
    _meta: {
      case: "DATA_EXPORT 无 Approval Token → 默认审批集要求 require_approval（WSP-006）",
      derived_from: "packages/contracts/fixtures/workspace.json → " + workspace.id,
      expected_decision: {
        allow: false,
        require_approval: true,
        reason_codes: ["AUTHORIZATION_REQUIRED", "NO_APPROVAL_TOKEN"],
      },
    },
    action: {
      type: "DATA_EXPORT",
      workspace_id: workspace.id,
      resource_id: "exp_job_20260701_001",
      requested_at: "2026-07-01T08:00:00Z",
    },
  },
  "input-04-crossborder-in-boundary-allow.json": {
    _meta: {
      case: "CROSS_BORDER_MODEL_CALL 在 Workspace 级授权边界内（provider/region/data_class/task/预算）→ allow，无需每次人工确认（M1 §5-C）",
      derived_from: "packages/contracts/fixtures/workspace.json → " + workspace.id + "（授权对象为 spike 提案形状）",
      expected_decision: { allow: true, require_approval: false, reason_codes: [] },
    },
    action: {
      type: "CROSS_BORDER_MODEL_CALL",
      workspace_id: workspace.id,
      requested_at: "2026-07-01T08:00:00Z",
      model: {
        provider: "anthropic",
        region: "ap-southeast-1",
        data_class: "INTERNAL",
        task: "company_understanding",
        consumed_amount: 120.5,
      },
    },
    workspace_model_authorization: workspaceModelGrant,
  },
  "input-05-crossborder-out-of-boundary-deny.json": {
    _meta: {
      case: "CROSS_BORDER_MODEL_CALL 边界外：CONFIDENTIAL 数据分级 + 未授权区域 → deny + 原因",
      derived_from: "packages/contracts/fixtures/workspace.json → " + workspace.id + "（授权对象为 spike 提案形状）",
      expected_decision: {
        allow: false,
        require_approval: false,
        reason_codes: ["DATA_CLASS_NOT_AUTHORIZED", "MODEL_REGION_NOT_AUTHORIZED"],
      },
    },
    action: {
      type: "CROSS_BORDER_MODEL_CALL",
      workspace_id: workspace.id,
      requested_at: "2026-07-01T08:00:00Z",
      model: {
        provider: "anthropic",
        region: "eu-west-1",
        data_class: "CONFIDENTIAL",
        task: "company_understanding",
        consumed_amount: 120.5,
      },
    },
    workspace_model_authorization: workspaceModelGrant,
  },
};

mkdirSync(path.join(spikeRoot, "fixtures", "inputs"), { recursive: true });
writeFileSync(
  path.join(spikeRoot, "fixtures", "data.json"),
  JSON.stringify(dataDoc, null, 2) + "\n",
);
for (const [name, doc] of Object.entries(inputs)) {
  writeFileSync(
    path.join(spikeRoot, "fixtures", "inputs", name),
    JSON.stringify(doc, null, 2) + "\n",
  );
}
console.log(
  `build-inputs: wrote fixtures/data.json + ${Object.keys(inputs).length} eval inputs (auth=${auth.id}, in-window requested_at=${inWindow})`,
);
