import Link from 'next/link'
import { FC } from 'react'

const Navbar: FC = () => (
  <nav>
    <Link href='/scenes'>
      <a>Genres</a>
    </Link>
    <Link href='/scenes/create'>
      <a>Create Scene</a>
    </Link>
    <Link href='/styles/create'>
      <a>Create Style</a>
    </Link>
    <Link href='/trends/create'>
      <a>Create Trend</a>
    </Link>
  </nav>
)

export default Navbar
