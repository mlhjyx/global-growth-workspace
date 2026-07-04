// 幂等请求指纹的规范化序列化（§5.3 request_hash，PR #25 评论处置：3522684846）：
// 对象键递归排序，语义相同的 JSON 不因键序差异得到不同指纹（否则合法重试被误判 409 键复用）。
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((k) => [k, sortKeysDeep(record[k])]),
    );
  }
  return value;
}
