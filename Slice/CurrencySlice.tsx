import { createSlice } from "@reduxjs/toolkit";

interface Currency {
  Rate: { [currency: string]: number };
  Loading: boolean;
  error: string | null;
}
const initialState: Currency = {
  Rate: {},
  Loading: false,
  error: null,
};
const Currency_Convert = createSlice({
  name: "Rates",
  initialState,
  reducers: {
    fetchRates: (state) => {
      state.Loading = true;
    },
    fetchRatesSuccess: (state, action) => {
      (state.Loading = false), (state.Rate = action.payload.rates), console.log(state.Rate);
    },
    fetchRatesFailure: (state, action) => {
      (state.Loading = false), (state.error = action.payload);
    },
  },
});
export const { fetchRates, fetchRatesFailure, fetchRatesSuccess } = Currency_Convert.actions;
export default Currency_Convert.reducer;
