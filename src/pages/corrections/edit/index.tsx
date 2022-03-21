import { NextPage } from 'next'

import ClientOnly from '../../../common/components/ClientOnly'
import Layout from '../../../modules/corrections/components/Layout'
import ListView from '../../../modules/corrections/components/ListView'

const Home: NextPage = () => (
  <Layout>
    <ClientOnly>
      <ListView />
    </ClientOnly>
  </Layout>
)

export default Home
