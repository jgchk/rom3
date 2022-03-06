import { GenreInput } from './create'
import { InferMutationInput, InferQueryOutput } from './trpc'

export const fromApi = (data: InferQueryOutput<'get'>): GenreInput => {
  switch (data.type) {
    case 'scene': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        influencedBy: data.influencedBy.map((inf) => ({
          ...inf,
          type: 'scene',
        })),
      }
    }
    case 'style': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        influencedBy: data.influencedBy.map((inf) => ({
          ...inf,
          type: 'style',
        })),
        parents: data.parents.map((p) => ({ ...p, type: 'style' })),
      }
    }
    case 'trend': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        trendInfluencedBy: data.trendInfluencedBy.map((inf) => ({
          ...inf,
          type: 'trend',
        })),
        styleInfluencedBy: data.styleInfluencedBy.map((inf) => ({
          ...inf,
          type: 'style',
        })),
        parentTrends: data.parentTrends.map((p) => ({ ...p, type: 'trend' })),
        parentStyles: data.parentStyles.map((p) => ({ ...p, type: 'style' })),
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
          influencedBy: data.influencedBy.map((item) => item.id),
        },
      }
    }
    case 'style': {
      return {
        type: 'style',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          influencedBy: data.influencedBy.map((item) => item.id),
          parents: data.parents.map((item) => item.id),
        },
      }
    }
    case 'trend': {
      return {
        type: 'trend',
        data: {
          ...data,
          alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
          trendInfluencedBy: data.trendInfluencedBy.map((item) => item.id),
          styleInfluencedBy: data.styleInfluencedBy.map((item) => item.id),
          parentTrends: data.parentTrends.map((item) => item.id),
          parentStyles: data.parentStyles.map((item) => item.id),
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
          influencedBy: data.influencedBy.map((item) => item.id),
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
          influencedBy: data.influencedBy.map((item) => item.id),
          parents: data.parents.map((item) => item.id),
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
          trendInfluencedBy: data.trendInfluencedBy.map((item) => item.id),
          styleInfluencedBy: data.styleInfluencedBy.map((item) => item.id),
          parentTrends: data.parentTrends.map((item) => item.id),
          parentStyles: data.parentStyles.map((item) => item.id),
        },
      }
    }
  }
}
