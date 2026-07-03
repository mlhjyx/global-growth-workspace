# Contract Test Plan（M1 生效）

- 每个 Provider Adapter：录制/回放 + Schema 断言（输入输出对齐 packages/contracts）
- OpenAPI：请求/响应/错误码与实现一致性（api 就绪后选型 schemathesis 类工具，M1 定）
- AsyncAPI：事件 payload 逐事件校验（复用 Ajv 注册表）
- 兼容性：Breaking change 提主版本 + CI 阻断（ADR-017）
- Mock Provider 先行：真实供应商未定（OD-07）不阻塞 Adapter 契约测试
