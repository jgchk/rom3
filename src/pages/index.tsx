import { NextPage } from 'next'

import ClientOnly from '../common/components/ClientOnly'
import ListView from '../modules/corrections/components/ListView'

const Home: NextPage = () => (
  <ClientOnly>
    <ListView />
  </ClientOnly>
)

export default Home
