import { NextPage } from 'next'
import Link from 'next/link'
import { createContext, FC, useContext, useMemo } from 'react'

import { GenreOutput, getGenreKey } from '../modules/genres/model'
import { useGenresQuery } from '../modules/genres/services'
import { getParents } from '../modules/tree/utils/genres'

type Model = {
  genres: Record<string, GenreOutput>
  children: Record<string, string[]>
  parents: Record<string, string[]>
}

const Tree: NextPage = () => {
  const { data, error } = useGenresQuery({
    type: ['meta', 'scene', 'style', 'trend'],
  })

  if (data) {
    return <Loaded data={data} />
  }

  if (error) {
    return <div>Error</div>
  }

  return <div>Loading...</div>
}

const ModelContext = createContext<Model>({
  genres: {},
  children: {},
  parents: {},
})

const Loaded: FC<{ data: GenreOutput[] }> = ({ data }) => {
  const model: Model = useMemo(() => {
    const m: Model = { genres: {}, children: {}, parents: {} }

    for (const genre of data) {
      const key = getGenreKey(genre)

      m.genres[key] = genre

      const parents = getParents(genre)

      m.parents[key] = parents.map((p) => getGenreKey(p))
      m.children[key] = m.children[key] ?? []

      for (const parent of parents) {
        const parentKey = getGenreKey(parent)
        m.children[parentKey] = [...(m.children[parentKey] ?? []), key]
      }
    }

    return m
  }, [data])

  const topLevelGenres = useMemo(
    () =>
      Object.values(model.genres).filter(
        (genre) => model.parents[getGenreKey(genre)].length === 0
      ),
    [model.genres, model.parents]
  )

  return (
    <ModelContext.Provider value={model}>
      <ul>
        {topLevelGenres.map((genre) => {
          const key = getGenreKey(genre)
          return (
            <li key={key}>
              <Node genreKey={key} />
            </li>
          )
        })}
        {/* <li>
          <button>Add Genre</button>
        </li> */}
      </ul>
    </ModelContext.Provider>
  )
}

const Node: FC<{ genreKey: string }> = ({ genreKey }) => {
  const model = useContext(ModelContext)

  const genre = useMemo(() => model.genres[genreKey], [genreKey, model.genres])
  const children = useMemo(
    () => model.children[genreKey],
    [genreKey, model.children]
  )

  return (
    <div>
      <Link
        href={{
          pathname: '/edit',
          query: { type: genre.type, id: genre.id },
        }}
      >
        <a>{genre.name}</a>
      </Link>
      <ul>
        {children.map((childKey) => (
          <li key={childKey}>
            <Node genreKey={childKey} />
          </li>
        ))}
        {/* <li>
          <button>Add Child</button>
        </li> */}
      </ul>
    </div>
  )
}

export default Tree
