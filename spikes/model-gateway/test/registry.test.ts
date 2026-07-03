/**
 * TaskRegistry / PromptRegistry：真实契约文件加载 + Schema 编译 + 版本化。
 */
import { describe, expect, it } from 'vitest';
import { UnknownPromptError, UnknownTaskError } from '../src/contract.js';
import { PromptRegistry, registerCompanyUnderstandingPromptV1 } from '../src/prompt-registry.js';
import { SchemaValidator } from '../src/structured-output.js';
import { TaskRegistry, registerCompanyUnderstandingTask } from '../src/task-registry.js';
import { makeValidInput, makeValidOutput } from '../src/providers/fixtures.js';

describe('TaskRegistry（Company Understanding 契约来自 packages/contracts 真实文件）', () => {
  it('注册后 $id 与 Schema Registry 口径一致', () => {
    const reg = new TaskRegistry();
    const def = registerCompanyUnderstandingTask(reg);
    expect(def.inputSchemaId).toBe('ggw://contracts/ai-tasks/company-understanding/input');
    expect(def.outputSchemaId).toBe('ggw://contracts/ai-tasks/company-understanding/output');
    expect(def.taskType).toBe('COMPANY_UNDERSTANDING');
    expect(def.maxCostPerRunUsd).toBe(0.8);
    expect(reg.get('company-understanding@1')).toBe(def);
  });

  it('未注册任务 → UnknownTaskError', () => {
    const reg = new TaskRegistry();
    expect(() => reg.get('lead-scoring@1')).toThrow(UnknownTaskError);
  });

  it('真实 input/output Schema 能被 ajv(draft2020) 编译，且夹具通过校验', () => {
    const reg = new TaskRegistry();
    const def = registerCompanyUnderstandingTask(reg);
    const v = new SchemaValidator();

    expect(v.validateInput(def, makeValidInput()).valid).toBe(true);
    expect(v.validateOutput(def, makeValidOutput()).valid).toBe(true);

    // 负例：input 缺 website_url 且缺 uploaded_source_ids（anyOf 不满足）
    const badInput = { ...makeValidInput() } as Record<string, unknown>;
    delete badInput.website_url;
    expect(v.validateInput(def, badInput).valid).toBe(false);

    // 负例：output 的 workspace_id 前缀非法
    const badOutput = { ...makeValidOutput(), workspace_id: 'cam_01HZY3M8Q4T9RWXKZP2N5V7ABC' };
    expect(v.validateOutput(def, badOutput).valid).toBe(false);
  });
});

describe('PromptRegistry（版本化，v1 来自真实 prompt.v1.md）', () => {
  it('v1 系统指令从 prompt.v1.md 提取，含铁律关键句', () => {
    const reg = new PromptRegistry();
    const entry = registerCompanyUnderstandingPromptV1(reg);
    expect(entry.version).toBe('v1');
    expect(entry.system).toContain('企业理解提取器');
    expect(entry.system).toContain('只输出资料中有证据的内容');
    expect(reg.resolve('company-understanding/prompt').version).toBe('v1');
    expect(reg.resolve('company-understanding/prompt', 'v1').system).toBe(entry.system);
  });

  it('注册 v2 后：缺省解析 = 最新；钉住 v1 仍可用；重复注册同版本被拒（版本不可变）', () => {
    const reg = new PromptRegistry();
    registerCompanyUnderstandingPromptV1(reg);
    reg.register({
      promptId: 'company-understanding/prompt',
      version: 'v2',
      taskType: 'COMPANY_UNDERSTANDING',
      system: 'v2 系统指令（演示）',
      releaseStatus: 'draft',
    });
    expect(reg.resolve('company-understanding/prompt').version).toBe('v2');
    expect(reg.resolve('company-understanding/prompt', 'v1').version).toBe('v1');
    expect(() =>
      reg.register({
        promptId: 'company-understanding/prompt',
        version: 'v1',
        taskType: 'COMPANY_UNDERSTANDING',
        system: '篡改 v1',
        releaseStatus: 'draft',
      }),
    ).toThrow(/版本不可变/);
    expect(() => reg.resolve('company-understanding/prompt', 'v9')).toThrow(UnknownPromptError);
  });
});
