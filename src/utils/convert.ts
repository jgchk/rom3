import { GenreInput } from './create'
import { InferMutationInput, InferQueryOutput } from './trpc'

export const fromApi = (data: InferQueryOutput<'get'>): GenreInput => {
  switch (data.type) {
    case 'scene': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        influencedByScenes: data.influencedByScenes.map((inf) => ({
          ...inf,
          type: 'scene',
        })),
      }
    }
    case 'style': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        parentStyles: data.parentStyles.map((p) => ({ ...p, type: 'style' })),
        influencedByStyles: data.influencedByStyles.map((inf) => ({
          ...inf,
          type: 'style',
        })),
      }
    }
    case 'trend': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        parentTrends: data.parentTrends.map((p) => ({ ...p, type: 'trend' })),
        parentStyles: data.parentStyles.map((p) => ({ ...p, type: 'style' })),
        influencedByTrends: data.influencedByTrends.map((inf) => ({
          ...inf,
          type: 'trend',
        })),
        influencedByStyles: data.influencedByStyles.map((inf) => ({
          ...inf,
          type: 'style',
        })),
      }
    }
  }
}

export const toAddApi = (data: GenreInput): InferMutationInput<'add'> => {
  switch (data.type) {
    case 'scene': {
      return {
        type: 'scene',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          influencedByScenes: data.influencedByScenes.map((item) => item.id),
        },
      }
    }
    case 'style': {
      return {
        type: 'style',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          parentStyles: data.parentStyles.map((item) => item.id),
          influencedByStyles: data.influencedByStyles.map((item) => item.id),
        },
      }
    }
    case 'trend': {
      return {
        type: 'trend',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          parentTrends: data.parentTrends.map((item) => item.id),
          parentStyles: data.parentStyles.map((item) => item.id),
          influencedByTrends: data.influencedByTrends.map((item) => item.id),
          influencedByStyles: data.influencedByStyles.map((item) => item.id),
        },
      }
    }
  }
}

export const toEditApi = (
  id: number,
  data: GenreInput
): InferMutationInput<'edit'> => {
  switch (data.type) {
    case 'scene': {
      return {
        id,
        type: 'scene',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          influencedByScenes: data.influencedByScenes.map((item) => item.id),
        },
      }
    }
    case 'style': {
      return {
        id,
        type: 'style',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          parentStyles: data.parentStyles.map((item) => item.id),
          influencedByStyles: data.influencedByStyles.map((item) => item.id),
        },
      }
    }
    case 'trend': {
      return {
        id,
        type: 'trend',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          parentTrends: data.parentTrends.map((item) => item.id),
          parentStyles: data.parentStyles.map((item) => item.id),
          influencedByTrends: data.influencedByTrends.map((item) => item.id),
          influencedByStyles: data.influencedByStyles.map((item) => item.id),
        },
      }
    }
  }
}
