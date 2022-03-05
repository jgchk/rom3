import styled from '@emotion/styled'
import { Scene } from '@prisma/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import Multiselect from '../../components/Multiselect'
import trpc from '../../services'

const CreateScene: NextPage = () => {
  const [name, setName] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [alternateNamesStr, setAlternateNamesStr] = useState('')
  const [influencedByObjs, setInfluencedByObjs] = useState<Scene[]>([])

  const { mutate } = trpc.useMutation('scenes.add')
  const utils = trpc.useContext()
  const router = useRouter()
  const handleCreate = useCallback(() => {
    const alternateNames = alternateNamesStr.split(',').map((s) => s.trim())
    const influencedBy = influencedByObjs.map((scene) => scene.id)
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
          await utils.invalidateQueries(['scenes.all'])
          utils.setQueryData(['scenes.byId'], data)

          await router.push('/scenes')
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

const InfluencedByDropdown: FC<{ onChange: (selected: Scene[]) => void }> = ({
  onChange,
}) => {
  const { data, error, isLoading } = trpc.useQuery(['scenes.all'])

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

export default CreateScene

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
