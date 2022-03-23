import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import { useMergeCorrectionMutation } from '../../../common/services/corrections'
import { useCorrectionContext } from '../contexts/CorrectionContext'

const Navbar: FC = () => {
  const { id } = useCorrectionContext()

  const { mutate, isLoading } = useMergeCorrectionMutation()
  const router = useRouter()
  const handleMergeCorrection = useCallback(
    () =>
      mutate(
        { id },
        {
          onSuccess: () => {
            toast.success('Merged correction!')
            void router.push('/corrections')
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [id, mutate, router]
  )

  return (
    <Container>
      <Link href={`/corrections/${id}/edit`}>
        <a>List</a>
      </Link>
      <Link href={`/corrections/${id}/edit/tree`}>
        <a>Tree</a>
      </Link>
      <button onClick={() => handleMergeCorrection()} disabled={isLoading}>
        Merge
      </button>
    </Container>
  )
}

export default Navbar

const Container = styled.nav`
  display: flex;
  gap: 4px;
  height: 32px;
  background: #eee;

  a {
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: black;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background: #ccc;
    }
  }
`
