import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { capitalize } from '../common/utils/string'
import trpc, { InferQueryOutput } from '../common/utils/trpc'
import FormElement from '../modules/genres/components/FormElement'
import MetaForm from '../modules/genres/components/forms/MetaForm'
import SceneForm from '../modules/genres/components/forms/SceneForm'
import StyleForm from '../modules/genres/components/forms/StyleForm'
import TrendForm from '../modules/genres/components/forms/TrendForm'
import { getParam } from '../modules/genres/utils/api'
import { fromApi, toEditApi } from '../modules/genres/utils/convert'
import {
  GenreName,
  genreNames,
  GenreUiState,
  isGenreName,
  makeUiState,
} from '../modules/genres/utils/types'

const Edit: NextPage = () => {
  const router = useRouter()
  const type = useMemo(() => {
    const type_ = getParam(router.query.type)
    if (type_ && isGenreName(type_)) return type_
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

const EditInner: FC<{ type: GenreName; id: number }> = ({ type, id }) => {
  const { data, error } = trpc.useQuery(['get', { type, id }])

  if (data) {
    return <EditInnerInner type={type} id={id} data={data} />
  }

  if (error) {
    return <div>Error</div>
  }

  return <div>Loading...</div>
}

const EditInnerInner: FC<{
  type: GenreName
  id: number
  data: InferQueryOutput<'get'>
}> = ({ type: originalType, id, data: originalData }) => {
  const [data, setData] = useState<GenreUiState>(fromApi(originalData))

  const { mutate, isLoading: isSubmitting } = trpc.useMutation('edit')
  const utils = trpc.useContext()
  const handleEdit = useCallback(
    () =>
      mutate(toEditApi(originalType, id, data), {
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: async (res) => {
          toast.success(`Edited ${res.name}!`)

          await utils.invalidateQueries('genres')
          utils.setQueryData(['get', { type: res.type, id: res.id }], res)
          switch (res.type) {
            case 'meta': {
              await utils.invalidateQueries('metas.all')
              utils.setQueryData(['metas.byId', { id: res.id }], res)
              break
            }
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
    [data, id, mutate, originalType, utils]
  )

  const renderForm = () => {
    switch (data.type) {
      case 'meta':
        return (
          <MetaForm
            selfId={id}
            data={data}
            onChange={(val) => {
              const updatedData = typeof val === 'function' ? val(data) : val
              setData({ ...updatedData, type: 'meta' })
            }}
          />
        )
      case 'scene':
        return (
          <SceneForm
            selfId={id}
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
            selfId={id}
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
            selfId={id}
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
          {/* TODO: create primitive for typesafe <select> */}
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
        {renderForm()}
        <button
          type='submit'
          disabled={isSubmitting}
          onClick={() => handleEdit()}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
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
