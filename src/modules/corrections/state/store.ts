import create from 'zustand'

import { CorrectionGenreApiInputData } from '../services'

type CorrectionStore = {
  id: number

  create: Map<number, CorrectionGenreApiInputData>
  edit: Map<number, CorrectionGenreApiInputData>
  delete: Set<number>

  addCreatedGenre: (data: CorrectionGenreApiInputData) => void
  removeCreatedGenre: (id: number) => void

  addGenreDelete: (id: number) => void
}

const useCorrectionStore = create<CorrectionStore>((set) => ({
  create: new Map(),
  edit: new Map(),
  delete: new Set(),

  id: 0,
  addCreatedGenre: (data) =>
    set((state) => {
      const id = state.id
      const create = state.create
      create.set(id, data)
      return { create, id: id + 1 }
    }),

  removeCreatedGenre: (id) =>
    set((state) => {
      const create = state.create
      create.delete(id)
      return { create }
    }),

  addGenreDelete: (id) =>
    set((state) => {
      const del = state.delete
      del.delete(id)
      return { delete: del }
    }),
}))

export default useCorrectionStore
