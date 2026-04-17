import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@/lib/storage'
import type { ClassItem } from '@/types'

interface ClassesState {
  items: ClassItem[]
  searchQuery: string
}

const initialState: ClassesState = {
  items: storage.get<ClassItem[]>('classes') ?? [],
  searchQuery: '',
}

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    addClass(state, action: PayloadAction<ClassItem>) {
      state.items.unshift(action.payload)
      storage.set('classes', state.items)
    },
    updateClass(state, action: PayloadAction<ClassItem>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = action.payload
        storage.set('classes', state.items)
      }
    },
    deleteClass(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload)
      storage.set('classes', state.items)
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
  },
})

export const { addClass, updateClass, deleteClass, setSearchQuery } = classesSlice.actions
export default classesSlice.reducer
