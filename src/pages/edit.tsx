import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { getFirstOrValue } from '../common/utils/array'
import FormElement from '../modules/genres/components/FormElement'
import GenreForm from '../modules/genres/components/forms/GenreForm'
import GenreNameSelect from '../modules/genres/components/GenreNameSelect'
import { EditContextProvider } from '../modules/genres/contexts/EditContext'
import { useEditGenreMutation, useGenreQuery } from '../modules/genres/services'
import { fromApi, toEditApi } from '../modules/genres/utils/convert'
import {
  GenreName,
  GenreOutput,
  GenreUiState,
  isGenreName,
  makeUiState,
} from '../modules/genres/utils/types'

const Edit: NextPage = () => {
  const router = useRouter()

  const type = useMemo(() => {
    const type_ = getFirstOrValue(router.query.type)
    if (type_ && isGenreName(type_)) return type_
  }, [router.query.type])

  const id = useMemo(() => {
    const idStr = getFirstOrValue(router.query.id)
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
  const { data, isFetching } = useGenreQuery({ type, id })

  // we don't want to load the form with stale data then change it on the user while
  // they're editing.
  // instead, let's show a loader until fresh data is loaded.
  if (isFetching) {
    return <div>Loading...</div>
  }

  if (data) {
    return <EditInnerInner type={type} id={id} data={data} />
  }

  return <div>Error</div>
}

const EditInnerInner: FC<{
  type: GenreName
  id: number
  data: GenreOutput
}> = ({ type: originalType, id, data: originalData }) => {
  const [data, setData] = useState<GenreUiState>(fromApi(originalData))

  const { mutate, isLoading: isSubmitting } = useEditGenreMutation()
  const handleEdit = useCallback(
    () =>
      mutate(toEditApi(originalType, id, data), {
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: (res) => {
          toast.success(`Edited ${res.name}!`)
        },
      }),
    [data, id, mutate, originalType]
  )

  return (
    <EditContextProvider type={originalType} id={id}>
      <Layout>
        <Form>
          <FormElement>
            <label>Type</label>
            <GenreNameSelect
              value={data.type}
              onChange={(val) => {
                const [newData, dataLost] = makeUiState(val, data)
                const shouldRun = dataLost
                  ? confirm(
                      'Some data may be lost in the conversion. Are you sure you want to continue?'
                    )
                  : true
                if (shouldRun) setData(newData)
              }}
            />
          </FormElement>
          <GenreForm data={data} onChange={setData} />
          <button
            type='submit'
            disabled={isSubmitting}
            onClick={() => handleEdit()}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </Form>
      </Layout>
    </EditContextProvider>
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
