import { createContext, FC, useContext, useMemo } from 'react'

type CorrectionContext = {
  id: number
}

const CorrectionContext = createContext<CorrectionContext>({ id: 0 })

export const CorrectionContextProvider: FC<{ id: number }> = ({
  id,
  children,
}) => {
  const value = useMemo(() => ({ id }), [id])
  return (
    <CorrectionContext.Provider value={value}>
      {children}
    </CorrectionContext.Provider>
  )
}

export const useCorrectionContext = () => useContext(CorrectionContext)
