import {
  createSlice,
  createAsyncThunk,
  AnyAction,
  Action,
} from '@reduxjs/toolkit'
import { ref, get, set, remove, update } from 'firebase/database'
import { database } from '../firebase'

interface RejectAction extends Action {
  error: Error
}

export interface IUploadFilesData {
  name: string
  url: string
  size: number
}

export interface ITodo {
  id: string
  title: string
  description?: string
  endDate: string
  complite: boolean
  uploadFilesData?: IUploadFilesData[]
}

interface IInitialState {
  todos: ITodo[]
  loading: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | undefined
}

const initialState: IInitialState = {
  todos: [],
  loading: 'idle',
  error: undefined,
}

export const getTodos = createAsyncThunk<
  ITodo[],
  undefined,
  { rejectValue: IInitialState['error'] }
>('todos/getTodos', async (_, { rejectWithValue }) => {
  try {
    const snapshot = await get(ref(database, 'todos'))
    return snapshot.val()
  } catch (e) {
    const error = e as Error
    return rejectWithValue(error.message)
  }
})

export const addTodo = createAsyncThunk<
  ITodo,
  ITodo,
  { rejectValue: IInitialState['error'] }
>('todos/addTodo', async (todo, { rejectWithValue }) => {
  try {
    await set(ref(database, `todos/${todo.id}`), todo)
    return todo
  } catch (e) {
    const error = e as Error
    return rejectWithValue(error.message)
  }
})

export const deleteTodo = createAsyncThunk<
  ITodo['id'] | undefined,
  ITodo['id'],
  { rejectValue: IInitialState['error'] }
>('todos/deleteTodo', async (id, { rejectWithValue }) => {
  try {
    await remove(ref(database, `todos/${id}`))
    return id
  } catch (e) {
    const error = e as Error
    rejectWithValue(error.message)
  }
})

export const updateTodo = createAsyncThunk<
  ITodo | undefined,
  ITodo,
  { rejectValue: IInitialState['error'] }
>('todos/updateTodo', async (todo, { rejectWithValue }) => {
  try {
    await update(ref(database, `todos/${todo.id}`), todo)
    return todo
  } catch (e) {
    const error = e as Error
    rejectWithValue(error.message)
  }
})

export const setComplite = createAsyncThunk<
  ITodo | undefined,
  ITodo,
  { rejectValue: IInitialState['error'] }
>('todos/setComplite', async (todo, { rejectWithValue }) => {
  try {
    await update(ref(database, `todos/${todo.id}`), todo)
    return todo
  } catch (e) {
    const error = e as Error
    rejectWithValue(error.message)
  }
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.loading = 'loading'
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.todos = Object.values(action.payload)
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.todos.push(action.payload)
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.todos = state.todos.filter((todo) => todo.id !== action.payload)
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.todos = state.todos.map((todo) => {
          if (todo.id === action.payload?.id) todo = action.payload
          return todo
        })
      })
      .addCase(setComplite.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.todos = state.todos.map((todo) => {
          if (todo.id === action.payload?.id)
            todo.complite = action.payload?.complite
          return todo
        })
      })
      .addMatcher(
        (action: AnyAction): action is RejectAction =>
          action.type.endsWith('rejected'),
        (state, action) => {
          state.loading = 'failed'
          state.error = action.error.message
        }
      )
  },
})

export default todosSlice.reducer
