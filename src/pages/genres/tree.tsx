import { NextPage } from 'next'

import TreeView from '../../modules/viewer/components/TreeView'

const Tree: NextPage = () => (
  <div className='flex justify-center'>
    <div className='flex-1 max-w-screen-lg'>
      <TreeView />
    </div>
  </div>
)

export default Tree
