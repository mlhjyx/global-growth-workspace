/**
 * 测试夹具：构造符合 ggw://contracts/ai-tasks/company-understanding/output v1 的最小合法输出，
 * 以及符合 input Schema 的最小合法输入。ID 满足 primitives 的 ^<prefix>_[0-9A-HJKMNP-TV-Z]{26}$。
 */

export const WS_A = 'ws_01HZY3M8Q4T9RWXKZP2N5V7ABC';
export const WS_B = 'ws_01HZY3M8Q4T9RWXKZP2N5V7DEF';
export const SRC_1 = 'src_01HZY3M8Q4T9RWXKZP2N5V7ABC';

/** 最小合法输入（website_url 分支） */
export function makeValidInput(workspaceId: string = WS_A): Record<string, unknown> {
  return {
    schema_version: 1,
    task_type: 'COMPANY_UNDERSTANDING',
    workspace_id: workspaceId,
    website_url: 'https://www.acme-solar.example.com',
    language: 'zh-CN',
  };
}

/** 含 PII 的输入（industry_hint 携带 email 与手机号），用于脱敏演示 */
export function makeInputWithPii(workspaceId: string = WS_A): Record<string, unknown> {
  return {
    ...makeValidInput(workspaceId),
    industry_hint: '光伏；联系 zhang.wei@acme-solar.cn 或 +86 138 0013 8000',
  };
}

/** 最小合法输出（company_profile_candidate 仅必填字段 + 空候选数组） */
export function makeValidOutput(workspaceId: string = WS_A): Record<string, unknown> {
  return {
    schema_version: 1,
    task_type: 'COMPANY_UNDERSTANDING',
    workspace_id: workspaceId,
    detected_language: 'zh-CN',
    company_profile_candidate: {
      legal_name: '阿克美光伏科技有限公司',
      confidence: 0.92,
      field_evidences: [
        {
          field_name: 'legal_name',
          source_ref: { source_id: SRC_1, url: 'https://www.acme-solar.example.com/about' },
          quote: '阿克美光伏科技有限公司成立于……',
          confidence: 0.92,
        },
      ],
      missing_fields: [{ field_name: 'founded_year', missing_reason: 'NOT_FOUND_IN_SOURCES' }],
    },
    offering_candidates: [],
    claim_candidates: [],
    conflict_candidates: [],
    sources_processed: [{ source_id: SRC_1, status: 'PROCESSED' }],
    notes: 'Spike Mock 输出：最小合法形状',
  };
}

/** Schema 违例输出：缺 company_profile_candidate 必填字段 + claim 枚举非法 */
export function makeSchemaViolatingOutput(workspaceId: string = WS_A): Record<string, unknown> {
  const out = makeValidOutput(workspaceId);
  return {
    ...out,
    company_profile_candidate: { legal_name: 'X' }, // 缺 confidence/field_evidences/missing_fields
    sources_processed: [{ source_id: SRC_1, status: 'DONE' }], // 非法枚举
  };
}
