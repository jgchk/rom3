import { createContext, FC, useContext, useMemo } from 'react'

import { GenreName } from '../model'

type EditContextValue = { type: GenreName; id: number }

const EditContext = createContext<EditContextValue | undefined>(undefined)

export const EditContextProvider: FC<EditContextValue> = ({
  type,
  id,
  children,
}) => {
  const value: EditContextValue = useMemo(() => ({ type, id }), [id, type])
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}

export const useEditContext = () => useContext(EditContext)
