import { configureStore } from '@reduxjs/toolkit'
import filesSlice from './filesSlice'
import todosSlice from './todosSlice'

export const store = configureStore({
  reducer: {
    todos: todosSlice,
    files: filesSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
