import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import notesReducer from './slices/notesSlice'
import classesReducer from './slices/classesSlice'
import resourcesReducer from './slices/resourcesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    classes: classesReducer,
    resources: resourcesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
