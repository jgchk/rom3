import create from 'zustand'
import { persist } from 'zustand/middleware'

import { CorrectionGenreApiInputData } from '../services'

type CorrectionStore = {
  id: number

  create: Record<number, CorrectionGenreApiInputData>
  edit: Record<number, CorrectionGenreApiInputData>
  delete: number[]

  addCreatedGenre: (data: CorrectionGenreApiInputData) => void
  removeCreatedGenre: (id: number) => void

  addGenreDelete: (id: number) => void
}

const useCorrectionStore = create<CorrectionStore>(
  persist(
    (set) => ({
      create: {},
      edit: {},
      delete: [] as number[],

      id: 0,
      addCreatedGenre: (data) =>
        set((state) => {
          const id = state.id
          return { create: { ...state.create, [id]: data }, id: id + 1 }
        }),

      removeCreatedGenre: (id) =>
        set((state) => {
          const create = state.create
          delete create[id]
          return { create: { ...create } }
        }),

      addGenreDelete: (id) =>
        set((state) => ({ delete: state.delete.filter((i) => i !== id) })),
    }),
    { name: 'correction' }
  )
)

export default useCorrectionStore
