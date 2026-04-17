import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@/lib/storage'
import type { Note } from '@/types'

interface NotesState {
  items: Note[]
  searchQuery: string
  filterSubject: string
  filterGrade: string
}

const initialState: NotesState = {
  items: storage.get<Note[]>('notes') ?? [],
  searchQuery: '',
  filterSubject: '',
  filterGrade: '',
}

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote(state, action: PayloadAction<Note>) {
      state.items.unshift(action.payload)
      storage.set('notes', state.items)
    },
    updateNote(state, action: PayloadAction<Note>) {
      const idx = state.items.findIndex((n) => n.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = action.payload
        storage.set('notes', state.items)
      }
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.items = state.items.filter((n) => n.id !== action.payload)
      storage.set('notes', state.items)
    },
    togglePin(state, action: PayloadAction<string>) {
      const note = state.items.find((n) => n.id === action.payload)
      if (note) {
        note.isPinned = !note.isPinned
        storage.set('notes', state.items)
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    setFilterSubject(state, action: PayloadAction<string>) {
      state.filterSubject = action.payload
    },
    setFilterGrade(state, action: PayloadAction<string>) {
      state.filterGrade = action.payload
    },
  },
})

export const { addNote, updateNote, deleteNote, togglePin, setSearchQuery, setFilterSubject, setFilterGrade } =
  notesSlice.actions
export default notesSlice.reducer
