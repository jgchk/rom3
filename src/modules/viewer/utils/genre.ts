import { GenreTree } from '../hooks/useGenreTreeQuery'

export const getDescendantIds = (id: number, tree: GenreTree) => {
  const descendantIds: number[] = []

  const queue = [id]
  while (queue.length > 0) {
    const descendantId = queue.pop()
    if (descendantId === undefined) continue

    const descendant = tree[descendantId]

    const descendantChildren = [
      ...descendant.children,
      ...descendant.influences.map((inf) => inf.id),
    ].filter((id) => !descendantIds.includes(id))

    descendantIds.push(...descendantChildren)
    queue.push(...descendantChildren)
  }

  return descendantIds
}
