import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import FormElement from '../components/FormElement'
import SceneForm from '../components/SceneForm'
import StyleForm from '../components/StyleForm'
import TrendForm from '../components/TrendForm'
import { getParam } from '../utils/api'
import { fromApi, toApi } from '../utils/convert'
import {
  GenreInput,
  GenreType,
  genreTypes,
  isGenreType,
  makeInput,
} from '../utils/create'
import { capitalize } from '../utils/string'
import trpc, { InferQueryOutput } from '../utils/trpc'

const Edit: NextPage = () => {
  const router = useRouter()
  const type = useMemo(() => {
    const type_ = getParam(router.query.type)
    if (type_ && isGenreType(type_)) return type_
  }, [router.query.type])
  const id = useMemo(() => {
    const idStr = getParam(router.query.id)
    if (idStr === undefined) return
    const idNum = Number.parseInt(idStr)
    if (Number.isNaN(idNum)) return
    return idNum
  }, [router.query.id])

  if (type === undefined || id === undefined) {
    return <div>Params missing</div>
  }

  return <EditInner type={type} id={id} />
}

const EditInner: FC<{ type: GenreType; id: number }> = ({ type, id }) => {
  const { data, error } = trpc.useQuery(['get', { type, id }])

  if (data) {
    return <EditInnerInner data={data} />
  }

  if (error) {
    return <div>Error</div>
  }

  return <div>Loading...</div>
}

const EditInnerInner: FC<{ data: InferQueryOutput<'get'> }> = ({
  data: originalData,
}) => {
  const [data, setData] = useState<GenreInput>(fromApi(originalData))

  const { mutate, isLoading: isSubmitting } = trpc.useMutation('add')
  const utils = trpc.useContext()
  const handleCreate = useCallback(
    () =>
      mutate(toApi(data), {
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

export default Edit

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
