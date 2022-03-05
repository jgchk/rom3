import styled from '@emotion/styled'
import { Scene, Style, Trend } from '@prisma/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import Multiselect from '../../components/Multiselect'
import trpc from '../../services'

const CreateTrend: NextPage = () => {
  const [name, setName] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [alternateNamesStr, setAlternateNamesStr] = useState('')
  const [influencedByObjs, setInfluencedByObjs] = useState<SelectItem[]>([])

  const { mutate } = trpc.useMutation('trends.add')
  const utils = trpc.useContext()
  const router = useRouter()
  const handleCreate = useCallback(() => {
    const alternateNames = alternateNamesStr.split(',').map((s) => s.trim())
    const styleInfluencedBy = influencedByObjs
      .filter((item) => item.type === 'style')
      .map((style) => style.id)
    const trendInfluencedBy = influencedByObjs
      .filter((item) => item.type === 'trend')
      .map((trend) => trend.id)
    return mutate(
      {
        name,
        shortDesc,
        longDesc,
        alternateNames,
        styleInfluencedBy,
        trendInfluencedBy,
      },
      {
        onError: (error) => {
          console.log({ ...error })
          toast.error(error.message)
        },
        onSuccess: async (data) => {
          await utils.invalidateQueries(['trends.all'])
          utils.setQueryData(['trends.byId'], data)

          await router.push('/trends')
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

type SelectItem =
  | (Scene & {
      type: 'scene'
    })
  | (Style & {
      type: 'style'
    })
  | (Trend & {
      type: 'trend'
    })

const InfluencedByDropdown: FC<{
  onChange: (value: SelectItem[]) => void
}> = ({ onChange }) => {
  const { data, error, isLoading } = trpc.useQuery([
    'genres',
    { type: ['style', 'trend'] },
  ])

  return (
    <Multiselect
      data={data}
      error={error}
      isLoading={isLoading}
      filter={(item, query) =>
        item.name.toLowerCase().startsWith(query.toLowerCase())
      }
      itemDisplay={(item) => item.name}
      itemKey={(item) => item.id}
      onChange={(selected) => onChange(selected)}
    />
  )
}

export default CreateTrend

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
