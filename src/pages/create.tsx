import styled from '@emotion/styled'
import { Scene, Style } from '@prisma/client'
import { NextPage } from 'next'
import { useState } from 'react'

import FormElement from '../components/FormElement'
import SceneForm from '../components/SceneForm'
import StyleForm from '../components/StyleForm'
import { InferMutationInput } from '../utils/trpc'
import { capitalize } from './utils/string'

export type SceneObject = Scene & { type: 'scene' }
export type StyleObject = Style & { type: 'style' }
type GenreObject = SceneObject | StyleObject

const isScene = (o: GenreObject): o is SceneObject => o.type === 'scene'
const isStyle = (o: GenreObject): o is StyleObject => o.type === 'style'

export type SceneInput = Omit<
  InferMutationInput<'scenes.add'>,
  'alternateNames' | 'influencedBy'
> & {
  type: 'scene'
  alternateNames: string
  influencedBy: SceneObject[]
}
export type StyleInput = Omit<
  InferMutationInput<'styles.add'>,
  'alternateNames' | 'influencedBy'
> & {
  type: 'style'
  alternateNames: string
  influencedBy: StyleObject[]
}
type InputType = SceneInput | StyleInput

const makeScene = (oldData?: InputType): [SceneInput, boolean] => {
  const oldInfluencedBy: GenreObject[] = oldData?.influencedBy ?? []
  const influencedBy = oldInfluencedBy.filter(isScene)
  const lostData = influencedBy.length !== oldInfluencedBy.length
  return [
    {
      type: 'scene',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      influencedBy,
    },
    lostData,
  ]
}

const makeStyle = (oldData?: InputType): [StyleInput, boolean] => {
  const oldInfluencedBy: GenreObject[] = oldData?.influencedBy ?? []
  const influencedBy = oldInfluencedBy.filter(isStyle)
  const lostData = influencedBy.length !== oldInfluencedBy.length
  return [
    {
      type: 'style',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      influencedBy,
    },
    lostData,
  ]
}

type ObjectType = 'scene' | 'style' | 'trend'

const objectTypes: ObjectType[] = ['scene', 'style', 'trend']

const Create: NextPage = () => {
  const [data, setData] = useState<
    SceneInput | StyleInput
    // | (InferMutationInput<'trends.add'> & { type: 'trend' })
  >(makeScene()[0])

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
      // case 'trend':
      //   return <TrendForm />
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
              // TODO: change functino
              const objectType = e.target.value as ObjectType
              switch (objectType) {
                case 'scene': {
                  const [newData, dataLost] = makeScene(data)
                  const shouldRun = dataLost
                    ? confirm(
                        'Some data may be lost in the conversion. Are you sure you want to continue?'
                      )
                    : true
                  if (shouldRun) setData(newData)
                  break
                }
                case 'style': {
                  const [newData, dataLost] = makeStyle(data)
                  const shouldRun = dataLost
                    ? confirm(
                        'Some data may be lost in the conversion. Are you sure you want to continue?'
                      )
                    : true
                  if (shouldRun) setData(newData)
                  break
                }
                case 'trend':
                  throw new Error('TODO')
              }
            }}
          >
            {objectTypes.map((objectType) => (
              <option key={objectType} value={objectType}>
                {capitalize(objectType)}
              </option>
            ))}
          </select>
        </FormElement>
        {renderForm()}
        <button type='submit'>Submit</button>
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
