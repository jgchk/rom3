import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { push: navigate } = useRouter()

  useEffect(() => void navigate('/genres/tree'), [navigate])

  return <div />
}

export default Home
