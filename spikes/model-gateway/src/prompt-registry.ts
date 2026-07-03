/**
 * PromptRegistry：版本化 Prompt（母本 9.6 Prompt Registry）。
 *
 * 首个条目 = company-understanding/prompt v1，系统指令**不在 Spike 里复制**，
 * 直接从 packages/contracts/json-schema/ai-tasks/company-understanding/prompt.v1.md
 * 的「## 1. 系统指令（System）」代码块解析加载。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { UnknownPromptError } from './contract.js';

export interface PromptEntry {
  promptId: string;
  /** 版本号，如 v1、v2（release 流程见母本 9.6，本 Spike 只做形状） */
  version: string;
  taskType: string;
  /** 系统指令全文 */
  system: string;
  releaseStatus: 'draft' | 'released' | 'rolled_back';
  /** 来源文件（可追溯） */
  sourcePath?: string;
}

export class PromptRegistry {
  /** promptId -> version -> entry */
  private readonly prompts = new Map<string, Map<string, PromptEntry>>();
  /** promptId -> 注册顺序的版本列表（最后注册 = 最新） */
  private readonly order = new Map<string, string[]>();

  register(entry: PromptEntry): void {
    let versions = this.prompts.get(entry.promptId);
    if (!versions) {
      versions = new Map();
      this.prompts.set(entry.promptId, versions);
      this.order.set(entry.promptId, []);
    }
    if (versions.has(entry.version)) {
      throw new Error(`Prompt 版本重复注册：${entry.promptId}@${entry.version}（版本不可变，改动必须发新版本）`);
    }
    versions.set(entry.version, entry);
    this.order.get(entry.promptId)!.push(entry.version);
  }

  /** 取指定版本；不传 version 取最新注册版本 */
  resolve(promptId: string, version?: string): PromptEntry {
    const versions = this.prompts.get(promptId);
    if (!versions) throw new UnknownPromptError(promptId, version);
    if (version) {
      const entry = versions.get(version);
      if (!entry) throw new UnknownPromptError(promptId, version);
      return entry;
    }
    const order = this.order.get(promptId)!;
    const latest = order[order.length - 1]!;
    return versions.get(latest)!;
  }
}

/** 从真实 prompt.v1.md 中提取「系统指令」```text 代码块 */
export function registerCompanyUnderstandingPromptV1(registry: PromptRegistry): PromptEntry {
  const url = new URL(
    '../../../packages/contracts/json-schema/ai-tasks/company-understanding/prompt.v1.md',
    import.meta.url,
  );
  const path = fileURLToPath(url);
  const md = readFileSync(path, 'utf8');
  const match = md.match(/## 1\. 系统指令（System）\s*\n+```text\n([\s\S]*?)```/);
  if (!match) {
    throw new Error(`无法从 ${path} 提取系统指令代码块——prompt.v1.md 结构可能已变化`);
  }
  const entry: PromptEntry = {
    promptId: 'company-understanding/prompt',
    version: 'v1',
    taskType: 'COMPANY_UNDERSTANDING',
    system: match[1]!.trim(),
    releaseStatus: 'draft', // prompt.v1.md：release status = draft（Gate 3 前）
    sourcePath: path,
  };
  registry.register(entry);
  return entry;
}
