import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import {
  useCorrectionQuery,
  useDeleteCorrectionMutation,
  useMergeCorrectionMutation,
} from '../../../common/services/corrections'
import { defaultCorrectionName } from '../constants'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import UpdateNameDialog from './UpdateNameDialog'

const Navbar: FC = () => {
  const { id } = useCorrectionContext()

  const { data } = useCorrectionQuery(id)

  const renderCorrectionName = useCallback(() => {
    if (data) return data.name ?? defaultCorrectionName
    return 'Loading...'
  }, [data])

  const [showNameDialog, setShowNameDialog] = useState(false)

  const { mutate: mergeCorrection, isLoading: isMerging } =
    useMergeCorrectionMutation()
  const router = useRouter()
  const handleMergeCorrection = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

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
    )
  }, [id, mergeCorrection, router])

  const { mutate: deleteCorrection, isLoading: isDeleting } =
    useDeleteCorrectionMutation()
  const handleDeleteCorrection = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
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
    <>
      <Container>
        <Submenu>
          <div>{renderCorrectionName()}</div>
          <button
            onClick={() => setShowNameDialog(true)}
            disabled={showNameDialog}
          >
            Rename
          </button>
          <Link href={`/corrections/${id}/edit/tree`}>
            <a>Tree</a>
          </Link>
          <Link href={`/corrections/${id}/edit`}>
            <a>Change List</a>
          </Link>
        </Submenu>
        <Submenu>
          <button
            onClick={() => handleDeleteCorrection()}
            disabled={isDeleting}
          >
            Delete
          </button>
          <button onClick={() => handleMergeCorrection()} disabled={isMerging}>
            Merge
          </button>
        </Submenu>
      </Container>
      {showNameDialog && (
        <UpdateNameDialog id={id} onClose={() => setShowNameDialog(false)} />
      )}
    </>
  )
}

export default Navbar

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 32px;
  background: #eee;
`

const Submenu = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  height: 100%;

  & > * {
    padding: 0 8px;
  }

  a,
  button {
    display: flex;
    align-items: center;
    height: 100%;
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
