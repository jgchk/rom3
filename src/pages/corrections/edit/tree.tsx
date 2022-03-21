import { NextPage } from 'next'

import ClientOnly from '../../../common/components/ClientOnly'
import Layout from '../../../modules/corrections/components/Layout'
import TreeView from '../../../modules/corrections/components/TreeView'

const Tree: NextPage = () => (
  <Layout>
    <ClientOnly>
      <TreeView />
    </ClientOnly>
  </Layout>
)

export default Tree
