import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Budget from "../Screens/DrawerScreens/Budget/Budget";

interface IncomeEntry {
  key: string;
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
  attachment: {
    type: "image" | "document";
    uri: string | null;
    name?: string;
  };
}
interface BudgetEntery {
  amount: number;
  category: number;
  percentage: number;
}

interface IncomeState {
  amount: IncomeEntry[];
  budget: BudgetEntery[];
}

const initialState: IncomeState = {
  amount: [],
  budget: [],
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
    addBudget: (state, action) => {
      state.budget.unshift(action.payload);
    },
    deleteBudget: (state, action) => {
      const index = action.payload;
      state.budget = [...state.budget.slice(0, index), ...state.budget.slice(index + 1)];
    },
    updateBudget: (state, action) => {
      const { index, amount, category, percentage } = action.payload;
      state.budget[index] = { amount, category, percentage };
    },
  },
});

export const { addTransaction, deleteTransaction, addBudget, deleteBudget, updateBudget } = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
