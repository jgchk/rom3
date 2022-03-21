import { NextPage } from 'next'

import ClientOnly from '../common/components/ClientOnly'
import TreeView from '../modules/corrections/components/TreeView'

const Tree: NextPage = () => (
  <ClientOnly>
    <TreeView />
  </ClientOnly>
)

export default Tree
