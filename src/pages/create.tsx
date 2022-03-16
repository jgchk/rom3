import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { capitalize } from '../common/utils/string'
import FormElement from '../modules/genres/components/FormElement'
import GenreForm from '../modules/genres/components/forms/GenreForm'
import { useAddGenreMutation } from '../modules/genres/services'
import { toAddApi } from '../modules/genres/utils/convert'
import {
  GenreName,
  genreNames,
  GenreUiState,
  makeUiState,
} from '../modules/genres/utils/types'
import { makeSceneUiState } from '../modules/genres/utils/types/scenes'

const Create: NextPage = () => {
  const [data, setData] = useState<GenreUiState>(makeSceneUiState()[0])

  const router = useRouter()

  const { mutate, isLoading: isSubmitting } = useAddGenreMutation()
  const handleCreate = useCallback(
    () =>
      mutate(toAddApi(data), {
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: async (res) => {
          toast.success(`Created ${res.name}!`)
          await router.push({
            pathname: '/edit',
            query: { type: res.type, id: res.id },
          })
        },
      }),
    [data, mutate, router]
  )

  return (
    <Layout>
      <Form>
        <FormElement>
          <label>Type</label>
          <select
            value={data.type}
            onChange={(e) => {
              const objectType = e.target.value as GenreName
              const [newData, dataLost] = makeUiState(objectType, data)
              const shouldRun = dataLost
                ? confirm(
                    'Some data may be lost in the conversion. Are you sure you want to continue?'
                  )
                : true
              if (shouldRun) setData(newData)
            }}
          >
            {genreNames.map((objectType) => (
              <option key={objectType} value={objectType}>
                {capitalize(objectType)}
              </option>
            ))}
          </select>
        </FormElement>
        <GenreForm data={data} onChange={setData} />
        <button
          type='submit'
          disabled={isSubmitting}
          onClick={() => handleCreate()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </Form>
    </Layout>
  )
}

export default Create

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
