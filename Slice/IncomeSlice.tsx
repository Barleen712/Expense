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
  income: number;
  expense: number;
}

const initialState: IncomeState = {
  amount: [],
  income: 0,
  expense: 0,
};

export const ExpenseTrackerSlice = createSlice({
  name: "Money",
  initialState,
  reducers: {
    addValue: (state, action) => {
      const currentDate = new Date().toISOString();
      state.amount.unshift({
        key: currentDate,
        ...action.payload,
      });
    },
    total: (state) => {
      state.income = state.amount.reduce((acc, item) => {
        if (item.moneyCategory === "Income") {
          return acc + item.amount;
        }
        return acc;
      }, 0);
      state.expense = state.amount.reduce((acc, item) => {
        if (item.moneyCategory === "Expense") {
          return acc + item.amount;
        }
        return acc;
      }, 0);
    },
  },
});

export const { addValue, total } = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
