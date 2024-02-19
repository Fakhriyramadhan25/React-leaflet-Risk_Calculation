import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
export interface CounterState {
  imageName: string,
  imageStart: string,
  imageEnd: string
}

// Define the initial state using that type
const initialState: CounterState = {
  imageName:"LANDSAT/LC8_L1T_TOA",
  imageStart:"2015-12-01",
  imageEnd: "2015-12-31"
}

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    update: (state, action: PayloadAction<any>) =>{
      return state = {
        imageName: action.payload.imageName,
        imageStart: action.payload.imageStart,
        imageEnd: action.payload.imageEnd
      }
    }
  }
})

export const { update } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => (state.counter.imageName, state.counter.imageStart, state.counter.imageEnd)

export default counterSlice.reducer;