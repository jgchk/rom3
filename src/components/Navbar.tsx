import Link from 'next/link'
import { FC } from 'react'

const Navbar: FC = () => (
  <nav>
    <Link href='/list'>
      <a>Genres</a>
    </Link>
    <Link href='/create'>
      <a>Create</a>
    </Link>
  </nav>
)

export default Navbar
