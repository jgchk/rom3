import { NextPage } from 'next'
import Link from 'next/link'
import { createContext, FC, useContext, useMemo } from 'react'

import { GenreOutput } from '../modules/genres/model'
import { useGenresQuery } from '../modules/genres/services'
import { getParents } from '../modules/tree/utils/genres'

type Model = {
  genres: Record<number, GenreOutput>
  children: Record<number, number[]>
  parents: Record<number, number[]>
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
      m.genres[genre.id] = genre

      const parents = getParents(genre)

      m.parents[genre.id] = parents.map((p) => p.id)
      m.children[genre.id] = m.children[genre.id] ?? []

      for (const parent of parents) {
        m.children[parent.id] = [...(m.children[parent.id] ?? []), genre.id]
      }
    }

    return m
  }, [data])

  const topLevelGenres = useMemo(
    () =>
      Object.values(model.genres).filter(
        (genre) => model.parents[genre.id].length === 0
      ),
    [model.genres, model.parents]
  )

  return (
    <ModelContext.Provider value={model}>
      <ul>
        {topLevelGenres.map((genre) => (
          <li key={genre.id}>
            <Node id={genre.id} />
          </li>
        ))}
        {/* <li>
          <button>Add Genre</button>
        </li> */}
      </ul>
    </ModelContext.Provider>
  )
}

const Node: FC<{ id: number }> = ({ id }) => {
  const model = useContext(ModelContext)

  const genre = useMemo(() => model.genres[id], [id, model.genres])
  const children = useMemo(() => model.children[id], [id, model.children])

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
        {children.map((childId) => (
          <li key={childId}>
            <Node id={childId} />
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
