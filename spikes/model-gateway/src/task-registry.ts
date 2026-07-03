/**
 * TaskRegistry：任务 → 输入/输出 Schema 引用 + 默认 Prompt + 模型策略。
 *
 * 首个注册任务 = Company Understanding（母本 9.3 首个打样 AI Task）。
 * Schema **不在 Spike 里复制**，直接从 packages/contracts 的真实文件加载：
 *   packages/contracts/json-schema/ai-tasks/company-understanding/input.schema.json
 *   packages/contracts/json-schema/ai-tasks/company-understanding/output.schema.json
 * 二者 $ref 依赖 packages/contracts/json-schema/common/primitives.schema.json
 * （$id: ggw://contracts/common/primitives），一并加载进 ajv。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { UnknownTaskError } from './contract.js';

export interface TaskDefinition {
  /** 任务引用（业务侧调用键），如 company-understanding@1 */
  taskRef: string;
  /** 任务类型标识（与契约 task_type const 一致） */
  taskType: string;
  /** Schema Registry $id（母本 9.6） */
  inputSchemaId: string;
  outputSchemaId: string;
  /** 已解析的 JSON Schema 对象 */
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  /** 默认 Prompt（PromptRegistry 键） */
  defaultPromptId: string;
  /** RoutingPolicy 策略名（母本 9.5 model policy） */
  modelPolicy: string;
  /** 单次运行最大成本上限（USD，task-contract.md 第 3 节） */
  maxCostPerRunUsd: number;
}

/** 仓库根目录（本文件位于 spikes/model-gateway/src/） */
export const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));

const CONTRACTS_AI_TASKS = new URL('../../../packages/contracts/json-schema/ai-tasks/', import.meta.url);
const CONTRACTS_COMMON = new URL('../../../packages/contracts/json-schema/common/', import.meta.url);

function loadJson(url: URL): Record<string, unknown> {
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as Record<string, unknown>;
}

/** 公共原语 Schema（被 ai-task Schema $ref 引用，必须先注册进 ajv） */
export function loadCommonPrimitivesSchema(): Record<string, unknown> {
  return loadJson(new URL('primitives.schema.json', CONTRACTS_COMMON));
}

export class TaskRegistry {
  private readonly tasks = new Map<string, TaskDefinition>();

  register(def: TaskDefinition): void {
    if (this.tasks.has(def.taskRef)) {
      throw new Error(`任务重复注册：${def.taskRef}`);
    }
    this.tasks.set(def.taskRef, def);
  }

  get(taskRef: string): TaskDefinition {
    const def = this.tasks.get(taskRef);
    if (!def) throw new UnknownTaskError(taskRef);
    return def;
  }

  list(): TaskDefinition[] {
    return [...this.tasks.values()];
  }
}

/**
 * 注册 Company Understanding 任务（从 packages/contracts 真实文件加载 Schema）。
 * model policy / 成本上限取自同目录 task-contract.md 与 prompt.v1.md 登记值。
 */
export function registerCompanyUnderstandingTask(registry: TaskRegistry): TaskDefinition {
  const base = new URL('company-understanding/', CONTRACTS_AI_TASKS);
  const inputSchema = loadJson(new URL('input.schema.json', base));
  const outputSchema = loadJson(new URL('output.schema.json', base));

  const def: TaskDefinition = {
    taskRef: 'company-understanding@1',
    taskType: 'COMPANY_UNDERSTANDING',
    inputSchemaId: String(inputSchema.$id), // ggw://contracts/ai-tasks/company-understanding/input
    outputSchemaId: String(outputSchema.$id), // ggw://contracts/ai-tasks/company-understanding/output
    inputSchema,
    outputSchema,
    defaultPromptId: 'company-understanding/prompt',
    modelPolicy: 'structured_extraction.default', // prompt.v1.md Registry 字段 model policy
    maxCostPerRunUsd: 0.8, // task-contract.md 第 3 节：单次运行最大成本 USD 0.80
  };
  registry.register(def);
  return def;
}
