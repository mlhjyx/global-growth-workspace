/**
 * StructuredOutput 校验：ajv（draft 2020-12）按任务 output Schema 校验模型输出；
 * 校验失败由 Gateway 带错误反馈重试一次，仍失败 → StructuredOutputError
 * （task-contract.md 1.3：永不把不合规响应透传给下游）。
 */
import { Ajv2020 } from 'ajv/dist/2020.js';
import type { ValidateFunction } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { loadCommonPrimitivesSchema, type TaskDefinition } from './task-registry.js';

export interface ValidationOutcome {
  valid: boolean;
  errors: string[];
}

export class SchemaValidator {
  private readonly ajv: Ajv2020;
  private readonly cache = new Map<string, ValidateFunction>();

  constructor() {
    // 注意：不传 strict:true —— 显式 true 会连带开启 strictRequired，
    // 拒绝契约 input Schema 合法的 anyOf:[{required:[...]}] 分支；默认 strict 档已足够。
    this.ajv = new Ajv2020({ allErrors: true });
    // ai-task Schema 依赖 format: uri / date-time 等
    addFormats(this.ajv as never);
    // 公共原语（ggw://contracts/common/primitives）被跨 Schema $ref 引用
    this.ajv.addSchema(loadCommonPrimitivesSchema());
  }

  private compiled(schema: Record<string, unknown>): ValidateFunction {
    const id = String(schema.$id ?? JSON.stringify(schema).slice(0, 64));
    let fn = this.cache.get(id);
    if (!fn) {
      fn = this.ajv.getSchema(id) ?? this.ajv.compile(schema);
      this.cache.set(id, fn);
    }
    return fn;
  }

  validateInput(task: TaskDefinition, input: unknown): ValidationOutcome {
    return this.run(this.compiled(task.inputSchema), input);
  }

  validateOutput(task: TaskDefinition, output: unknown): ValidationOutcome {
    return this.run(this.compiled(task.outputSchema), output);
  }

  private run(fn: ValidateFunction, data: unknown): ValidationOutcome {
    const valid = fn(data) as boolean;
    const errors = (fn.errors ?? []).map(
      (e) => `${e.instancePath || '/'} ${e.message ?? ''}`.trim(),
    );
    return { valid, errors };
  }
}
