import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@/lib/storage'
import type { Resource } from '@/types'

interface ResourcesState {
  items: Resource[]
  searchQuery: string
  filterSubject: string
  filterType: string
  filterGrade: string
}

const initialState: ResourcesState = {
  items: storage.get<Resource[]>('resources') ?? [],
  searchQuery: '',
  filterSubject: '',
  filterType: '',
  filterGrade: '',
}

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource(state, action: PayloadAction<Resource>) {
      state.items.unshift(action.payload)
      storage.set('resources', state.items)
    },
    updateResource(state, action: PayloadAction<Resource>) {
      const idx = state.items.findIndex((r) => r.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = action.payload
        storage.set('resources', state.items)
      }
    },
    deleteResource(state, action: PayloadAction<string>) {
      state.items = state.items.filter((r) => r.id !== action.payload)
      storage.set('resources', state.items)
    },
    toggleBookmark(state, action: PayloadAction<string>) {
      const resource = state.items.find((r) => r.id === action.payload)
      if (resource) {
        resource.isBookmarked = !resource.isBookmarked
        storage.set('resources', state.items)
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    setFilterSubject(state, action: PayloadAction<string>) {
      state.filterSubject = action.payload
    },
    setFilterType(state, action: PayloadAction<string>) {
      state.filterType = action.payload
    },
    setFilterGrade(state, action: PayloadAction<string>) {
      state.filterGrade = action.payload
    },
  },
})

export const {
  addResource,
  updateResource,
  deleteResource,
  toggleBookmark,
  setSearchQuery,
  setFilterSubject,
  setFilterType,
  setFilterGrade,
} = resourcesSlice.actions
export default resourcesSlice.reducer
