import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import {
  useDeleteCorrectionMutation,
  useMergeCorrectionMutation,
} from '../../../common/services/corrections'
import { useCorrectionContext } from '../contexts/CorrectionContext'

const Navbar: FC = () => {
  const { id } = useCorrectionContext()

  const { mutate: mergeCorrection, isLoading: isMerging } =
    useMergeCorrectionMutation()
  const router = useRouter()
  const handleMergeCorrection = useCallback(
    () =>
      mergeCorrection(
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
    [id, mergeCorrection, router]
  )

  const { mutate: deleteCorrection, isLoading: isDeleting } =
    useDeleteCorrectionMutation()
  const handleDeleteCorrection = useCallback(() => {
    const conf = confirm('Are you sure?')
    if (!conf) return

    deleteCorrection(
      { id },
      {
        onSuccess: () => {
          toast.success('Deleted correction')
          void router.push('/corrections')
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [deleteCorrection, id, router])

  return (
    <Container>
      <Submenu>
        <Link href={`/corrections/${id}/edit`}>
          <a>Change List</a>
        </Link>
        <Link href={`/corrections/${id}/edit/tree`}>
          <a>Tree</a>
        </Link>
      </Submenu>
      <Submenu>
        <button onClick={() => handleDeleteCorrection()} disabled={isDeleting}>
          Delete
        </button>
        <button onClick={() => handleMergeCorrection()} disabled={isMerging}>
          Merge
        </button>
      </Submenu>
    </Container>
  )
}

export default Navbar

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 32px;
  background: #eee;

  a,
  button {
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: black;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      background: #ccc;
    }
  }
`

const Submenu = styled.div`
  display: flex;
  gap: 4px;
  height: 100%;
`
