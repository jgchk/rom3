import { createContext, FC, useContext } from 'react'

import { GenreTree } from '../hooks/useGenreTree'

const TreeContext = createContext<GenreTree>({
  genres: new Map(),
  children: new Map(),
})

export const TreeProvider: FC<{ tree: GenreTree }> = ({ tree, children }) => (
  <TreeContext.Provider value={tree}>{children}</TreeContext.Provider>
)

export const useGenreTree = () => useContext(TreeContext)
