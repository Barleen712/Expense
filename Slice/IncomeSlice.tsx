import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IncomeEntry {
  key: string;
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
}

interface IncomeState {
  amount: IncomeEntry[];
}

const initialState: IncomeState = {
  amount: [],
};

export const ExpenseTrackerSlice = createSlice({
  name: "Money",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<IncomeEntry, "key">>) => {
      const currentDate = new Date().toISOString();
      state.amount.unshift({
        key: currentDate,
        ...action.payload,
      });
    },
    deleteTransaction: (state, action) => {
      const { keyVal } = action.payload;

      const index = state.amount.findIndex((item) => item.key === keyVal);
      state.amount = [...state.amount.slice(0, index), ...state.amount.slice(index + 1)];
    },
  },
});

export const { addTransaction, deleteTransaction } = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
