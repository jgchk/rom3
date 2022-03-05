import Link from 'next/link'
import { FC } from 'react'

const Navbar: FC = () => (
  <nav>
    <Link href='/scenes'>
      <a>Genres</a>
    </Link>
    <Link href='/scenes/create'>
      <a>Submit</a>
    </Link>
  </nav>
)

export default Navbar
