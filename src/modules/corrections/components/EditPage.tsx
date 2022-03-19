import styled from '@emotion/styled'
import { FC, useCallback, useState } from 'react'

import GenreForm from '../../genres/components/forms/GenreForm'
import { GenreName, GenreOutput, GenreUiState } from '../../genres/model'
import { useGenreQuery } from '../../genres/services'
import { fromApi } from '../../genres/utils/convert'
import { useAddCorrectionMutation } from '../services'
import { toEditCorrectionApi } from '../utils/convert'

const EditPage: FC<{ type: GenreName; id: number }> = ({ type, id }) => {
  const { data, error } = useGenreQuery({ type, id })

  if (data) {
    return <EditInner id={id} initialData={data} />
  }

  if (error) {
    return <div>Error</div>
  }

  return <div>Loading...</div>
}

const EditInner: FC<{ id: number; initialData: GenreOutput }> = ({
  id,
  initialData,
}) => {
  const [data, setData] = useState<GenreUiState>(fromApi(initialData))

  const { mutate: addCorrection, isLoading: isSubmitting } =
    useAddCorrectionMutation()
  const handleAddCorrection = useCallback(
    () => addCorrection(toEditCorrectionApi(id, data)),
    [addCorrection, data, id]
  )

  return (
    <Layout>
      <Form>
        <GenreForm data={data} onChange={setData} />
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

export default EditPage

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
