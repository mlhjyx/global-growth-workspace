// OTel 骨架（BE-02 冒烟 #9）：OTEL_ENABLED=true 时注册 NodeTracerProvider + Console 导出。
// 动态 import：关闭时零启动成本；生产导出器（OTLP）随共享环境建立时替换，调用面不变。
import type { AppConfig } from '../config/config';

let shutdownFn: (() => Promise<void>) | undefined;

export async function initOtel(config: Pick<AppConfig, 'OTEL_ENABLED'>): Promise<void> {
  if (!config.OTEL_ENABLED || shutdownFn) return;
  const sdk = await import('@opentelemetry/sdk-trace-node');
  const provider = new sdk.NodeTracerProvider({
    spanProcessors: [new sdk.SimpleSpanProcessor(new sdk.ConsoleSpanExporter())],
  });
  provider.register();
  shutdownFn = () => provider.shutdown();
}

export async function shutdownOtel(): Promise<void> {
  await shutdownFn?.();
  shutdownFn = undefined;
}
