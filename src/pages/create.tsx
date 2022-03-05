import styled from '@emotion/styled'
import { Scene, Style, Trend } from '@prisma/client'
import { NextPage } from 'next'
import { useState } from 'react'

import FormElement from '../components/FormElement'
import SceneForm from '../components/SceneForm'
import StyleForm from '../components/StyleForm'
import TrendForm from '../components/TrendForm'
import { capitalize } from '../utils/string'
import { InferMutationInput } from '../utils/trpc'

export type SceneObject = Scene & { type: 'scene' }
export type StyleObject = Style & { type: 'style' }
export type TrendObject = Trend & { type: 'trend' }
type GenreObject = SceneObject | StyleObject | TrendObject

const isScene = (o: GenreObject): o is SceneObject => o.type === 'scene'
const isStyle = (o: GenreObject): o is StyleObject => o.type === 'style'
const isTrend = (o: GenreObject): o is TrendObject => o.type === 'trend'

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
export type TrendInput = Omit<
  InferMutationInput<'trends.add'>,
  'alternateNames' | 'trendInfluencedBy' | 'styleInfluencedBy'
> & {
  type: 'trend'
  alternateNames: string
  trendInfluencedBy: TrendObject[]
  styleInfluencedBy: StyleObject[]
}
type InputType = SceneInput | StyleInput | TrendInput

const getInfluencedBy = (oldData?: InputType): GenreObject[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'scene':
    case 'style':
      return oldData.influencedBy
    case 'trend':
      return [...oldData.styleInfluencedBy, ...oldData.trendInfluencedBy]
  }
}

const makeScene = (oldData?: InputType): [SceneInput, boolean] => {
  const oldInfluencedBy = getInfluencedBy(oldData)
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
  const oldInfluencedBy = getInfluencedBy(oldData)
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

const makeTrend = (oldData?: InputType): [TrendInput, boolean] => {
  const oldInfluencedBy = getInfluencedBy(oldData)
  const trendInfluencedBy = oldInfluencedBy.filter(isTrend)
  const styleInfluencedBy = oldInfluencedBy.filter(isStyle)
  const lostData =
    trendInfluencedBy.length + styleInfluencedBy.length !==
    oldInfluencedBy.length
  return [
    {
      type: 'trend',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      trendInfluencedBy,
      styleInfluencedBy,
    },
    lostData,
  ]
}

type ObjectType = 'scene' | 'style' | 'trend'

const objectTypes: ObjectType[] = ['scene', 'style', 'trend']

const Create: NextPage = () => {
  const [data, setData] = useState<SceneInput | StyleInput | TrendInput>(
    makeScene()[0]
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
              const objectType = e.target.value as ObjectType
              const [newData, dataLost] = (() => {
                switch (objectType) {
                  case 'scene':
                    return makeScene(data)
                  case 'style':
                    return makeStyle(data)
                  case 'trend':
                    return makeTrend(data)
                }
              })()
              const shouldRun = dataLost
                ? confirm(
                    'Some data may be lost in the conversion. Are you sure you want to continue?'
                  )
                : true
              if (shouldRun) setData(newData)
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
