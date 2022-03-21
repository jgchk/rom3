import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import { useAddCorrectionMutation } from '../../../common/services/corrections'
import useCorrectionStore from '../state/store'

const Navbar: FC = () => {
  const createCorrections = useCorrectionStore((state) => state.create)
  const editCorrections = useCorrectionStore((state) => state.edit)
  const deleteCorrections = useCorrectionStore((state) => state.delete)

  const { mutate } = useAddCorrectionMutation()
  const handleSubmit = useCallback(
    () =>
      mutate(
        {
          create: Object.entries(createCorrections).map(([id, data]) => ({
            id: Number.parseInt(id),
            data: data,
          })),
          edit: Object.entries(editCorrections).map(([id, data]) => ({
            id: Number.parseInt(id),
            data: data,
          })),
          delete: [...deleteCorrections],
        },
        {
          onSuccess: () => {
            toast.success('Submitted correction')
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [createCorrections, deleteCorrections, editCorrections, mutate]
  )

  return (
    <Container>
      <Link href='/corrections/edit'>
        <a>List</a>
      </Link>
      <Link href='/corrections/edit/tree'>
        <a>Tree</a>
      </Link>
      <button onClick={() => handleSubmit()}>Submit</button>
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
