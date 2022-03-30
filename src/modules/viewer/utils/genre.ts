import { GenreTree } from '../hooks/useGenreTreeQuery'

export const getDescendantIds = (id: number, tree: GenreTree) => {
  const descendantIds = []

  const queue = [id]
  while (queue.length > 0) {
    const descendantId = queue.pop()
    if (descendantId === undefined) continue

    const descendant = tree[descendantId]
    descendantIds.push(...descendant.children)
    queue.push(...descendant.children)
  }

  return descendantIds
}
