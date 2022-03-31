import { GenreType } from '@prisma/client'

import { GenreApiOutput } from '../../../common/model'
import { CorrectionApiOutput } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { isDefined } from '../../../common/utils/types'
import { CorrectionGenre } from '../hooks/useCorrectionGenreQuery'
import { GenreTree } from '../hooks/useCorrectionGenreTreeQuery'

export const makeUiData = (
  type: GenreType,
  parentId?: number
): GenreApiInput => ({
  type,
  name: '',
  alternateNames: [],
  shortDesc: '',
  longDesc: '',
  trial: false,
  parents: parentId ? [parentId] : [],
  influencedBy: [],
  locations: [],
  cultures: [],
})

export const makeCorrectionGenre = (
  originalGenre: GenreApiOutput,
  correction: CorrectionApiOutput
): CorrectionGenre => {
  const createdGenres = Object.values(correction.create)
  const deletedIds = new Set(correction.delete.map((genre) => genre.id))
  const editedIds: Record<number, GenreApiOutput | undefined> =
    Object.fromEntries(
      correction.edit.map(({ targetGenre, updatedGenre }) => [
        targetGenre.id,
        updatedGenre,
      ])
    )

  const editedGenre = editedIds[originalGenre.id]
  const genre: CorrectionGenre = editedGenre
    ? {
        ...editedGenre,
        id: originalGenre.id,
        children: originalGenre.children.filter((childId) => {
          const editedChild = editedIds[childId]
          return !editedChild || editedChild.parents.includes(originalGenre.id)
        }),
        influences: originalGenre.influences.filter((inf) => {
          const editedInfluenced = editedIds[inf.id]
          return (
            !editedInfluenced ||
            editedInfluenced.influencedBy
              .map((inf) => inf.id)
              .includes(originalGenre.id)
          )
        }),
        changes: 'edited',
      }
    : { ...originalGenre, changes: undefined }

  if (
    createdGenres.some((createdGenre) => createdGenre.id === originalGenre.id)
  ) {
    genre.changes = 'created'
  } else if (deletedIds.has(originalGenre.id)) {
    genre.changes = 'deleted'
  }

  return {
    ...genre,
    parents: [
      ...genre.parents,
      ...createdGenres
        .filter((createdGenre) => createdGenre.children.includes(genre.id))
        .map((createdGenre) => createdGenre.id),
    ],
    children: [
      ...genre.children,
      ...createdGenres
        .filter((createdGenre) => createdGenre.parents.includes(genre.id))
        .map((genre) => genre.id),
    ],
    influencedBy: [
      ...genre.influencedBy,
      ...createdGenres
        .map((createdGenre) =>
          createdGenre.influences.find((inf) => inf.id === genre.id)
        )
        .filter(isDefined),
    ],
    influences: [
      ...genre.influences,
      ...createdGenres
        .map((createdGenre) =>
          createdGenre.influencedBy.find((inf) => inf.id === genre.id)
        )
        .filter(isDefined),
    ],
  }
}

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

export const getDescendantChanges = (id: number, tree: GenreTree) =>
  new Set(
    getDescendantIds(id, tree)
      .map((id) => tree[id].changes)
      .filter(isDefined)
  )
