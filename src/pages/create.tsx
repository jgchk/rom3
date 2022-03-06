import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import FormElement from '../components/FormElement'
import SceneForm from '../components/SceneForm'
import StyleForm from '../components/StyleForm'
import TrendForm from '../components/TrendForm'
import { toAddApi } from '../utils/convert'
import {
  GenreInput,
  GenreType,
  genreTypes,
  makeInput,
  makeScene,
} from '../utils/create'
import { capitalize } from '../utils/string'
import trpc from '../utils/trpc'

const Create: NextPage = () => {
  const [data, setData] = useState<GenreInput>(makeScene()[0])

  const { mutate, isLoading: isSubmitting } = trpc.useMutation('add')
  const utils = trpc.useContext()
  const handleCreate = useCallback(
    () =>
      mutate(toAddApi(data), {
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: async (res, { type }) => {
          toast.success(`Created ${res.name}!`)

          // TODO: invalidate based on return data
          await utils.invalidateQueries('genres')
          switch (type) {
            case 'scene': {
              await utils.invalidateQueries('scenes.all')
              await utils.invalidateQueries('scenes.byId')
              break
            }
            case 'style': {
              await utils.invalidateQueries('styles.all')
              await utils.invalidateQueries('styles.byId')
              break
            }
            case 'trend': {
              await utils.invalidateQueries('trends.all')
              await utils.invalidateQueries('trends.byId')
              break
            }
          }
        },
      }),
    [data, mutate, utils]
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
          {isSubmitting ? 'Loading...' : 'Submit'}
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
