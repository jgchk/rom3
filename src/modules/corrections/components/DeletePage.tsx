import styled from '@emotion/styled'
import { FC, useCallback } from 'react'

import { GenreName } from '../../genres/model'
import { useGenreQuery } from '../../genres/services'
import { useAddCorrectionMutation } from '../services'
import { toDeleteCorrectionApi } from '../utils/convert'

const DeletePage: FC<{ type: GenreName; id: number }> = ({ type, id }) => {
  const { data, error } = useGenreQuery({ type, id })

  const { mutate: addCorrection, isLoading: isSubmitting } =
    useAddCorrectionMutation()
  const handleAddCorrection = useCallback(
    () => addCorrection(toDeleteCorrectionApi(type, id)),
    [addCorrection, id, type]
  )

  if (data) {
    return (
      <Layout>
        <Form>
          <div>Delete {data.name}</div>
          <button
            type='submit'
            disabled={isSubmitting}
            onClick={() => handleAddCorrection()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Form>Error</Form>
      </Layout>
    )
  }

  return (
    <Layout>
      <Form>Loading...</Form>
    </Layout>
  )
}

export default DeletePage

const Layout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 500px;
`
