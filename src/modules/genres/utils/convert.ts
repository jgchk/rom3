import { unique, uniqueBy } from '../../../common/utils/array'
import {
  InferMutationInput,
  InferQueryOutput,
} from '../../../common/utils/trpc'
import { GenreInput, GenreType } from './create'
import { hashLocation, locationNotEmpty } from './location'

export const fromApi = (data: InferQueryOutput<'get'>): GenreInput => {
  switch (data.type) {
    case 'meta': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        parentMetas: data.parentMetas.map((p) => ({ ...p, type: 'meta' })),
      }
    }
    case 'scene': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        influencedByScenes: data.influencedByScenes.map((inf) => ({
          ...inf,
          type: 'scene',
        })),
        cultures: data.cultures.map((c) => c.name).join(', '),
      }
    }
    case 'style': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        parentStyles: data.parentStyles.map((p) => ({ ...p, type: 'style' })),
        parentMetas: data.parentMetas.map((p) => ({ ...p, type: 'meta' })),
        influencedByStyles: data.influencedByStyles.map((inf) => ({
          ...inf,
          type: 'style',
        })),
        cultures: data.cultures.map((c) => c.name).join(', '),
      }
    }
    case 'trend': {
      return {
        ...data,
        alternateNames: data.alternateNames.join(', '),
        parentTrends: data.parentTrends.map((p) => ({ ...p, type: 'trend' })),
        parentStyles: data.parentStyles.map((p) => ({ ...p, type: 'style' })),
        parentMetas: data.parentMetas.map((p) => ({ ...p, type: 'meta' })),
        influencedByTrends: data.influencedByTrends.map((inf) => ({
          ...inf,
          type: 'trend',
        })),
        influencedByStyles: data.influencedByStyles.map((inf) => ({
          ...inf,
          type: 'style',
        })),
        cultures: data.cultures.map((c) => c.name).join(', '),
      }
    }
  }
}

export const toAddApi = (data: GenreInput): InferMutationInput<'add'> => {
  switch (data.type) {
    case 'meta': {
      return {
        type: 'meta',
        data: {
          ...data,
          alternateNames: unique(
            data.alternateNames
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
          parentMetas: data.parentMetas.map((item) => item.id),
        },
      }
    }
    case 'scene': {
      return {
        type: 'scene',
        data: {
          ...data,
          alternateNames: unique(
            data.alternateNames
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
          influencedByScenes: data.influencedByScenes.map((item) => item.id),
          locations: uniqueBy(
            data.locations.filter(locationNotEmpty),
            hashLocation
          ),
          cultures: unique(
            data.cultures
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
        },
      }
    }
    case 'style': {
      return {
        type: 'style',
        data: {
          ...data,
          alternateNames: unique(
            data.alternateNames
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
          parentStyles: data.parentStyles.map((item) => item.id),
          parentMetas: data.parentMetas.map((item) => item.id),
          influencedByStyles: data.influencedByStyles.map((item) => item.id),
          locations: uniqueBy(
            data.locations.filter(locationNotEmpty),
            hashLocation
          ),
          cultures: unique(
            data.cultures
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
        },
      }
    }
    case 'trend': {
      return {
        type: 'trend',
        data: {
          ...data,
          alternateNames: unique(
            data.alternateNames
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
          parentTrends: data.parentTrends.map((item) => item.id),
          parentStyles: data.parentStyles.map((item) => item.id),
          parentMetas: data.parentMetas.map((item) => item.id),
          influencedByTrends: data.influencedByTrends.map((item) => item.id),
          influencedByStyles: data.influencedByStyles.map((item) => item.id),
          locations: uniqueBy(
            data.locations.filter(locationNotEmpty),
            hashLocation
          ),
          cultures: unique(
            data.cultures
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          ),
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
    case 'meta': {
      return {
        id,
        type,
        data: {
          type: data.type,
          data: {
            ...data,
            alternateNames: unique(
              data.alternateNames
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
            parentMetas: data.parentMetas.map((item) => item.id),
          },
        },
      }
    }
    case 'scene': {
      return {
        id,
        type,
        data: {
          type: data.type,
          data: {
            ...data,
            alternateNames: unique(
              data.alternateNames
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
            influencedByScenes: data.influencedByScenes.map((item) => item.id),
            locations: uniqueBy(
              data.locations.filter(locationNotEmpty),
              hashLocation
            ),
            cultures: unique(
              data.cultures
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
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
            alternateNames: unique(
              data.alternateNames
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
            parentStyles: data.parentStyles.map((item) => item.id),
            parentMetas: data.parentMetas.map((item) => item.id),
            influencedByStyles: data.influencedByStyles.map((item) => item.id),
            locations: uniqueBy(
              data.locations.filter(locationNotEmpty),
              hashLocation
            ),
            cultures: unique(
              data.cultures
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
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
            alternateNames: unique(
              data.alternateNames
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
            parentTrends: data.parentTrends.map((item) => item.id),
            parentStyles: data.parentStyles.map((item) => item.id),
            parentMetas: data.parentMetas.map((item) => item.id),
            influencedByTrends: data.influencedByTrends.map((item) => item.id),
            influencedByStyles: data.influencedByStyles.map((item) => item.id),
            locations: uniqueBy(
              data.locations.filter(locationNotEmpty),
              hashLocation
            ),
            cultures: unique(
              data.cultures
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            ),
          },
        },
      }
    }
  }
}