import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import trpc from '../../services'

const CreateStyle: NextPage = () => {
  const [name, setName] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [alternateNamesStr, setAlternateNamesStr] = useState('')
  const [influencedByObjs, setInfluencedByObjs] = useState<SelectItem[]>([])

  const { mutate } = trpc.useMutation('styles.add')
  const utils = trpc.useContext()
  const router = useRouter()
  const handleCreate = useCallback(() => {
    const alternateNames = alternateNamesStr.split(',').map((s) => s.trim())
    const influencedBy = influencedByObjs.map(({ value }) => value)
    return mutate(
      {
        name,
        shortDesc,
        longDesc,
        alternateNames,
        influencedBy,
      },
      {
        onError: (error) => {
          console.log({ ...error })
          toast.error(error.message)
        },
        onSuccess: async (data) => {
          await utils.invalidateQueries(['styles.all'])
          utils.setQueryData(['styles.byId'], data)

          await router.push('/styles')
        },
      }
    )
  }, [
    alternateNamesStr,
    influencedByObjs,
    longDesc,
    mutate,
    name,
    router,
    shortDesc,
    utils,
  ])

  return (
    <Layout>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          handleCreate()
        }}
      >
        <FormElement>
          <label>Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormElement>
        <FormElement>
          <label>Alternate Names</label>
          <input
            value={alternateNamesStr}
            onChange={(e) => setAlternateNamesStr(e.target.value)}
          />
        </FormElement>
        <FormElement>
          <label>Influences</label>
          <InfluencedByDropdown
            value={influencedByObjs}
            onChange={(value) => setInfluencedByObjs(value)}
          />
        </FormElement>
        <FormElement>
          <label>Short Description *</label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </FormElement>
        <FormElement>
          <label>Long Description *</label>
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            style={{ width: '100%', height: 300 }}
            required
          />
        </FormElement>
        <button type='submit'>Submit</button>
      </Form>
    </Layout>
  )
}

type SelectItem = { value: number; label: string }

const InfluencedByDropdown: FC<{
  value: SelectItem[]
  onChange: (value: SelectItem[]) => void
}> = ({ value, onChange }) => {
  const { data, error } = trpc.useQuery(['styles.all'])

  const handleRemoveItem = useCallback(
    (itemValue: number) =>
      onChange(value.filter((item) => item.value !== itemValue)),
    [onChange, value]
  )

  const renderSelectOptions = useCallback(() => {
    if (data) {
      if (data.length === 0) {
        return <option>No influences available</option>
      }
      return (
        <>
          {data.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </>
      )
    }

    if (error) {
      return <option>Error loading influences</option>
    }

    return <option>Loading...</option>
  }, [data, error])

  return (
    <div>
      {value.map((item) => (
        <button key={item.value} onClick={() => handleRemoveItem(item.value)}>
          {item.label}
        </button>
      ))}
      <select>{renderSelectOptions()}</select>
    </div>
  )
}

export default CreateStyle

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

const FormElement = styled.div`
  label {
    display: block;
  }
`
