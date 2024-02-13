export function overlaps<T>(s1: ReadonlySet<T>, s2: ReadonlySet<T>): boolean {
  return [...s1].some((v) => s2.has(v));
}
