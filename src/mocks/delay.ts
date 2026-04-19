export const DEFAULT_LATENCY_RANGE: readonly [number, number] = [120, 600];

export function simulatedDelay(
  range: readonly [number, number] = DEFAULT_LATENCY_RANGE,
): Promise<void> {
  const [min, max] = range;
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
