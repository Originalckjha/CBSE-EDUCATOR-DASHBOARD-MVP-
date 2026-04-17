import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@/lib/storage'
import type { User } from '@/types'

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: storage.get<User>('user'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload
      storage.set('user', action.payload)
    },
    logout(state) {
      state.user = null
      storage.remove('user')
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        storage.set('user', state.user)
      }
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
