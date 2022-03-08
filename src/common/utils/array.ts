export const unique = <T>(arr: T[]) => [...new Set(arr)]

export const uniqueBy = <T, I>(arr: T[], fn: (item: T) => I): T[] => {
  const output: T[] = []
  const included: Set<I> = new Set()
  for (const item of arr) {
    const key = fn(item)
    if (!included.has(key)) {
      output.push(item)
      included.add(key)
    }
  }
  return output
}
