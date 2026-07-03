# Data Classification（数据分级）

权威：母本 12.11。PUBLIC / INTERNAL / CONFIDENTIAL / RESTRICTED 四级；契约已内建 `privacy_classification`（common/primitives、事件 Envelope）。

分级决定：模型路由（跨境调用审批）、Trace 保留策略（ADR-016）、字段级加密/Tokenization（ADR-015）、导出与展示策略（DAT-006）。
