import { createContext, FC, useContext } from 'react'

import { GenreTree } from '../hooks/useCorrectionGenreTreeQuery'

const TreeContext = createContext<GenreTree & { showUnchanged: boolean }>({
  genres: {},
  children: {},
  showUnchanged: false,
})

export const TreeProvider: FC<{ tree: GenreTree; showUnchanged: boolean }> = ({
  tree,
  showUnchanged,
  children,
}) => (
  <TreeContext.Provider value={{ ...tree, showUnchanged }}>
    {children}
  </TreeContext.Provider>
)

export const useGenreTree = () => useContext(TreeContext)
