import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { capitalize } from '../common/utils/string'
import trpc from '../common/utils/trpc'
import FormElement from '../modules/genres/components/FormElement'
import SceneForm from '../modules/genres/components/SceneForm'
import StyleForm from '../modules/genres/components/StyleForm'
import TrendForm from '../modules/genres/components/TrendForm'
import { toAddApi } from '../modules/genres/utils/convert'
import {
  GenreInput,
  GenreType,
  genreTypes,
  makeInput,
  makeScene,
} from '../modules/genres/utils/create'

const Create: NextPage = () => {
  const [data, setData] = useState<GenreInput>(makeScene()[0])

  const { mutate, isLoading: isSubmitting } = trpc.useMutation('add')
  const utils = trpc.useContext()
  const router = useRouter()
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

          await utils.invalidateQueries('genres')
          utils.setQueryData(['get', { type: res.type, id: res.id }], res)
          switch (res.type) {
            case 'scene': {
              await utils.invalidateQueries('scenes.all')
              utils.setQueryData(['scenes.byId', { id: res.id }], res)
              break
            }
            case 'style': {
              await utils.invalidateQueries('styles.all')
              utils.setQueryData(['styles.byId', { id: res.id }], res)
              break
            }
            case 'trend': {
              await utils.invalidateQueries('trends.all')
              utils.setQueryData(['trends.byId', { id: res.id }], res)
              break
            }
          }
        },
      }),
    [data, mutate, router, utils]
  )

  const renderForm = () => {
    switch (data.type) {
      case 'scene':
        return (
          <SceneForm
            data={data}
            onChange={(val) => {
              const updatedData = typeof val === 'function' ? val(data) : val
              setData({ ...updatedData, type: 'scene' })
            }}
          />
        )
      case 'style':
        return (
          <StyleForm
            data={data}
            onChange={(val) => {
              const updatedData = typeof val === 'function' ? val(data) : val
              setData({ ...updatedData, type: 'style' })
            }}
          />
        )
      case 'trend':
        return (
          <TrendForm
            data={data}
            onChange={(val) => {
              const updatedData = typeof val === 'function' ? val(data) : val
              setData({ ...updatedData, type: 'trend' })
            }}
          />
        )
    }
  }

  return (
    <Layout>
      <Form>
        <FormElement>
          <label>Type</label>
          <select
            value={data.type}
            onChange={(e) => {
              const objectType = e.target.value as GenreType
              const [newData, dataLost] = makeInput(objectType, data)
              const shouldRun = dataLost
                ? confirm(
                    'Some data may be lost in the conversion. Are you sure you want to continue?'
                  )
                : true
              if (shouldRun) setData(newData)
            }}
          >
            {genreTypes.map((objectType) => (
              <option key={objectType} value={objectType}>
                {capitalize(objectType)}
              </option>
            ))}
          </select>
        </FormElement>
        {renderForm()}
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
