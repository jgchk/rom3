import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(() => void router.push('/list'), [router])
  return <div />
}

export default Home
