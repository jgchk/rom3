import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import Select from '../common/components/Select'
import { getFirstOrValue } from '../common/utils/array'
import { capitalize } from '../common/utils/string'
import FormElement from '../modules/genres/components/FormElement'
import GenreForm from '../modules/genres/components/forms/GenreForm'
import { EditContextProvider } from '../modules/genres/contexts/EditContext'
import { useEditGenreMutation, useGenreQuery } from '../modules/genres/services'
import { fromApi, toEditApi } from '../modules/genres/utils/convert'
import {
  GenreName,
  genreNames,
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
  const { data, error } = useGenreQuery({ type, id })

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
            <Select
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
              options={genreNames.map((genreName) => ({
                key: genreName,
                value: genreName,
                label: capitalize(genreName),
              }))}
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
