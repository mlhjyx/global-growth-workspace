// 治理组件库（母本 6.13 一致性组件的 M0 原型实现）
// 使用规则：任何 AI 结论/关键字段/对外动作的 UI 必须挂本库组件，禁止各页面自造审批与证据展示。
export * from './types';
export { CostBadge, PolicyBadge, ConfidenceBadge } from './Badges';
export { default as EvidenceDrawer } from './EvidenceDrawer';
export { default as ApprovalCard } from './ApprovalCard';
export { default as PageState } from './PageState';
export { default as DryRunModal } from './DryRunModal';
