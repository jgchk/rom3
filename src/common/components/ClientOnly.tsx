import { FC, useEffect, useState } from 'react'

const ClientOnly: FC = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => setHasMounted(true), [])

  if (!hasMounted) return null
  return <>{children}</>
}

export default ClientOnly
