import * as cheerio from 'cheerio'
import { CheerioAPI } from 'cheerio'

import { GenreApiInput } from './validators'
import { GenreTypeInput } from './validators/misc'

export const getGenreDataFromRym = async (
  url: string
): Promise<GenreApiInput> => {
  const data = await fetch(url).then((res) => res.text())
  const $ = cheerio.load(data)

  const type = getGenreType($)
  const name = getName($)
  const alternateNames = getAlternateNames($)
  const shortDesc = getShortDesc($)
  const longDesc = getLongDesc($)

  switch (type) {
    case 'meta':
      return {
        type: 'meta',
        data: { name, alternateNames, shortDesc, longDesc, parentMetas: [] },
      }
    case 'scene':
      return {
        type: 'scene',
        data: {
          name,
          alternateNames,
          shortDesc,
          longDesc,
          influencedByScenes: [],
          locations: [],
          cultures: [],
        },
      }
    case 'style':
      return {
        type: 'style',
        data: {
          name,
          alternateNames,
          shortDesc,
          longDesc,
          parentStyles: [],
          parentMetas: [],
          influencedByStyles: [],
          locations: [],
          cultures: [],
        },
      }
    case 'trend':
      return {
        type: 'trend',
        data: {
          name,
          alternateNames,
          shortDesc,
          longDesc,
          parentTrends: [],
          parentStyles: [],
          parentMetas: [],
          influencedByTrends: [],
          influencedByStyles: [],
          locations: [],
          cultures: [],
        },
      }
  }
}

const getGenreType = ($: CheerioAPI): GenreTypeInput => {
  const type = $(
    '#content > table:nth-child(24) > tbody > tr:nth-child(12) > td:nth-child(3)'
  ).text()

  if (type.includes('movement')) return 'trend'
  if (type.includes('scene')) return 'scene'
  if (type.includes('genre')) return 'style'

  throw new Error(`Unknown genre type received from RYM: ${type}`)
}

const getName = ($: CheerioAPI): string =>
  $(
    '#content > table:nth-child(24) > tbody > tr:nth-child(5) > td:nth-child(3) > span'
  ).text()

const getAlternateNames = ($: CheerioAPI): string[] => {
  const alternateNames = $(
    '#content > table:nth-child(24) > tbody > tr:nth-child(7) > td:nth-child(3) > span'
  ).text()
  return alternateNames.split(',').map((s) => s.trim())
}

const getShortDesc = ($: CheerioAPI): string =>
  $(
    '#content > table:nth-child(24) > tbody > tr:nth-child(13) > td:nth-child(3) > span'
  ).text()

const getLongDesc = ($: CheerioAPI): string =>
  $(
    '#content > table:nth-child(24) > tbody > tr:nth-child(14) > td:nth-child(3) > span'
  ).text()
