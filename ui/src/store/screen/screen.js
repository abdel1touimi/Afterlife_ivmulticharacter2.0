import { createSlice } from '@reduxjs/toolkit'
// characterselection, charactercreator
const initialState = import.meta.env.DEV ? 'characterselection' : ''

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    updatescreen: (state,action) => {
      return action.payload
    },
  },
})

export const {updatescreen} = screenSlice.actions

export default screenSlice.reducer
