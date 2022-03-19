import {
  addMeta,
  deleteMeta,
  editMeta,
  getMeta,
  getMetas,
} from '../routers/metas'
import {
  addScene,
  deleteScene,
  editScene,
  getScene,
  getScenes,
} from '../routers/scenes'
import {
  addStyle,
  deleteStyle,
  editStyle,
  getStyle,
  getStyles,
} from '../routers/styles'
import {
  addTrend,
  deleteTrend,
  editTrend,
  getTrend,
  getTrends,
} from '../routers/trends'
import { GenreApiInput } from './validators'
import { GenreTypeInput } from './validators/misc'

export const getGenres = (type: GenreTypeInput) => {
  switch (type) {
    case 'meta':
      return getMetas()
    case 'scene':
      return getScenes()
    case 'style':
      return getStyles()
    case 'trend':
      return getTrends()
  }
}

export const getGenre = (type: GenreTypeInput, id: number) => {
  switch (type) {
    case 'meta':
      return getMeta(id)
    case 'scene':
      return getScene(id)
    case 'style':
      return getStyle(id)
    case 'trend':
      return getTrend(id)
  }
}

export const addGenre = ({ type, data }: GenreApiInput) => {
  switch (type) {
    case 'meta':
      return addMeta(data)
    case 'scene':
      return addScene(data)
    case 'style':
      return addStyle(data)
    case 'trend':
      return addTrend(data)
  }
}

export const editGenre = async (
  type: GenreTypeInput,
  id: number,
  data: GenreApiInput
) => {
  if (type !== data.type) {
    // switching types
    // TODO: need to handle relations where we're the parent and try to preserve them. warn the user if connections may be wiped
    switch (type) {
      case 'meta': {
        await deleteMeta(id)
        break
      }
      case 'scene': {
        await deleteScene(id)
        break
      }
      case 'style': {
        await deleteStyle(id)
        break
      }
      case 'trend': {
        await deleteTrend(id)
        break
      }
    }
    switch (data.type) {
      case 'meta':
        return addMeta(data.data)
      case 'scene':
        return addScene(data.data)
      case 'style':
        return addStyle(data.data)
      case 'trend':
        return addTrend(data.data)
    }
  } else {
    // keeping same type
    switch (data.type) {
      case 'meta':
        return editMeta(id, data.data)
      case 'scene':
        return editScene(id, data.data)
      case 'style':
        return editStyle(id, data.data)
      case 'trend':
        return editTrend(id, data.data)
    }
  }
}

export const deleteGenre = (type: GenreTypeInput, id: number) => {
  switch (type) {
    case 'meta':
      return deleteMeta(id)
    case 'scene':
      return deleteScene(id)
    case 'style':
      return deleteStyle(id)
    case 'trend':
      return deleteTrend(id)
  }
}
