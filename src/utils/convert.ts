import { GenreInput, GenreType } from './create'
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
        cultures: data.cultures.join(', '),
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
        cultures: data.cultures.join(', '),
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
        cultures: data.cultures.join(', '),
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
          cultures: data.cultures.split(',').map((s) => s.trim()),
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
          cultures: data.cultures.split(',').map((s) => s.trim()),
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
          cultures: data.cultures.split(',').map((s) => s.trim()),
        },
      }
    }
  }
}

export const toEditApi = (
  type: GenreType,
  id: number,
  data: GenreInput
): InferMutationInput<'edit'> => {
  switch (data.type) {
    case 'scene': {
      return {
        id,
        type,
        data: {
          type: data.type,
          data: {
            ...data,
            alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
            influencedByScenes: data.influencedByScenes.map((item) => item.id),
            cultures: data.cultures.split(',').map((s) => s.trim()),
          },
        },
      }
    }
    case 'style': {
      return {
        id,
        type,
        data: {
          type: data.type,
          data: {
            ...data,
            alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
            parentStyles: data.parentStyles.map((item) => item.id),
            influencedByStyles: data.influencedByStyles.map((item) => item.id),
            cultures: data.cultures.split(',').map((s) => s.trim()),
          },
        },
      }
    }
    case 'trend': {
      return {
        id,
        type,
        data: {
          type: data.type,
          data: {
            ...data,
            alternateNames: data.alternateNames.split(',').map((s) => s.trim()),
            parentTrends: data.parentTrends.map((item) => item.id),
            parentStyles: data.parentStyles.map((item) => item.id),
            influencedByTrends: data.influencedByTrends.map((item) => item.id),
            influencedByStyles: data.influencedByStyles.map((item) => item.id),
            cultures: data.cultures.split(',').map((s) => s.trim()),
          },
        },
      }
    }
  }
}
