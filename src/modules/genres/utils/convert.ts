import { unique, uniqueBy } from '../../../common/utils/array'
import { InferMutationInput } from '../../../common/utils/trpc'
import { GenreName, GenreOutput, GenreUiState } from './types'
import { CultureOutput } from './types/culture'
import {
  hashLocation,
  locationNotEmpty,
  LocationUiState,
} from './types/location'
import { StyleInfluenceUiState } from './types/styles'

const fromAlternateNames = (an: string[]) => an.join(', ')
const toAlternateNames = (an: string) =>
  unique(
    an
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  )

const toLocations = (ls: LocationUiState[]) =>
  uniqueBy(ls.filter(locationNotEmpty), hashLocation)

const fromCultures = (cs: CultureOutput[]) => cs.map((c) => c.name).join(', ')
const toCultures = (cs: string) =>
  unique(
    cs
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  )

const toIds = <T>(os: { id: T }[]) => os.map((o) => o.id)

const toStyleInfluences = (os: StyleInfluenceUiState[]) =>
  os.map((o) => ({
    id: o.id,
    type: o.influenceType,
  }))

export const fromApi = (data: GenreOutput): GenreUiState => {
  switch (data.type) {
    case 'meta': {
      return {
        ...data,
        alternateNames: fromAlternateNames(data.alternateNames),
        parentMetas: data.parentMetas.map((p) => ({ ...p, type: 'meta' })),
      }
    }
    case 'scene': {
      return {
        ...data,
        alternateNames: fromAlternateNames(data.alternateNames),
        influencedByScenes: data.influencedByScenes.map((inf) => ({
          ...inf,
          type: 'scene',
        })),
        cultures: fromCultures(data.cultures),
      }
    }
    case 'style': {
      return {
        ...data,
        alternateNames: fromAlternateNames(data.alternateNames),
        parentStyles: data.parentStyles.map((p) => ({ ...p, type: 'style' })),
        parentMetas: data.parentMetas.map((p) => ({ ...p, type: 'meta' })),
        influencedByStyles: data.influencedByStyles.map((inf) => ({
          ...inf,
          type: 'style',
          influenceType: inf.influenceType,
        })),
        cultures: fromCultures(data.cultures),
      }
    }
    case 'trend': {
      return {
        ...data,
        alternateNames: fromAlternateNames(data.alternateNames),
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
          influenceType: inf.influenceType,
        })),
        cultures: fromCultures(data.cultures),
      }
    }
  }
}

export const toAddApi = (data: GenreUiState): InferMutationInput<'add'> => {
  switch (data.type) {
    case 'meta': {
      return {
        type: 'meta',
        data: {
          ...data,
          alternateNames: toAlternateNames(data.alternateNames),
          parentMetas: toIds(data.parentMetas),
        },
      }
    }
    case 'scene': {
      return {
        type: 'scene',
        data: {
          ...data,
          alternateNames: toAlternateNames(data.alternateNames),
          influencedByScenes: toIds(data.influencedByScenes),
          locations: toLocations(data.locations),
          cultures: toCultures(data.cultures),
        },
      }
    }
    case 'style': {
      return {
        type: 'style',
        data: {
          ...data,
          alternateNames: toAlternateNames(data.alternateNames),
          parentStyles: toIds(data.parentStyles),
          parentMetas: toIds(data.parentMetas),
          influencedByStyles: toStyleInfluences(data.influencedByStyles),
          locations: toLocations(data.locations),
          cultures: toCultures(data.cultures),
        },
      }
    }
    case 'trend': {
      return {
        type: 'trend',
        data: {
          ...data,
          alternateNames: toAlternateNames(data.alternateNames),
          parentTrends: toIds(data.parentTrends),
          parentStyles: toIds(data.parentStyles),
          parentMetas: toIds(data.parentMetas),
          influencedByTrends: toIds(data.influencedByTrends),
          influencedByStyles: toStyleInfluences(data.influencedByStyles),
          locations: toLocations(data.locations),
          cultures: toCultures(data.cultures),
        },
      }
    }
  }
}

export const toEditApi = (
  type: GenreName,
  id: number,
  data: GenreUiState
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
            alternateNames: toAlternateNames(data.alternateNames),
            parentMetas: toIds(data.parentMetas),
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
            alternateNames: toAlternateNames(data.alternateNames),
            influencedByScenes: toIds(data.influencedByScenes),
            locations: toLocations(data.locations),
            cultures: toCultures(data.cultures),
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
            alternateNames: toAlternateNames(data.alternateNames),
            parentStyles: toIds(data.parentStyles),
            parentMetas: toIds(data.parentMetas),
            influencedByStyles: toStyleInfluences(data.influencedByStyles),
            locations: toLocations(data.locations),
            cultures: toCultures(data.cultures),
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
            alternateNames: toAlternateNames(data.alternateNames),
            parentTrends: toIds(data.parentTrends),
            parentStyles: toIds(data.parentStyles),
            parentMetas: toIds(data.parentMetas),
            influencedByTrends: toIds(data.influencedByTrends),
            influencedByStyles: toStyleInfluences(data.influencedByStyles),
            locations: toLocations(data.locations),
            cultures: toCultures(data.cultures),
          },
        },
      }
    }
  }
}
