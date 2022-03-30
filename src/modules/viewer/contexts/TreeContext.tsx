import { createContext, FC, useContext } from 'react'

import { GenreTree } from '../hooks/useGenreTreeQuery'

const TreeContext = createContext<GenreTree>({})

export const TreeProvider: FC<{ tree: GenreTree }> = ({ tree, children }) => (
  <TreeContext.Provider value={tree}>{children}</TreeContext.Provider>
)

export const useGenreTree = () => useContext(TreeContext)
