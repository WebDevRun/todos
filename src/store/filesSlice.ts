import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

interface IFile {
  name: string
  url: string
  size: number
}

interface IInitialState {
  filesInfomation: IFile[] | null
  loading: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | undefined
}

export const sendFiles = createAsyncThunk<
  any,
  { id: string; files: File[] },
  { rejectValue: IInitialState['error'] }
>('file/sendFile', async ({ id, files }, { rejectWithValue }) => {
  try {
    const snapshots = await Promise.all(
      files.map(
        async (file) =>
          await uploadBytes(ref(storage, `todos/${id}/${file.name}`), file)
      )
    )

    console.log({ snapshots })
  } catch (e) {
    const error = e as Error
    rejectWithValue(error.message)
  }
})

const initialState: IInitialState = {
  filesInfomation: null,
  loading: 'idle',
  error: undefined,
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFiles.pending, (state) => {
        state.loading = 'loading'
      })
      .addCase(sendFiles.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.filesInfomation = action.payload
      })
      .addCase(sendFiles.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message
      })
  },
})

export default filesSlice.reducer
