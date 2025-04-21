import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IncomeEntry {
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
  Date: string;
  id: string;
}
interface BudgetEntery {
  amount: number;
  category: number;
  percentage: number;
  notification: boolean;
  id: string;
}

interface IncomeState {
  amount: IncomeEntry[];
  budget: BudgetEntery[];
  loading: boolean;
}

const initialState: IncomeState = {
  amount: [],
  budget: [],
  loading: false,
};

export const ExpenseTrackerSlice = createSlice({
  name: "Money",
  initialState,
  reducers: {
    loadingTransaction: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addTransaction: (state, action) => {
      const existingTransaction = state.amount.find((transaction) => transaction.id === action.payload.id);
      if (!existingTransaction) {
        state.amount.push(action.payload);
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      const index = state.amount.findIndex((item) => item.id === id);
      state.amount = [...state.amount.slice(0, index), ...state.amount.slice(index + 1)];
    },
    updateTransaction: (state, action) => {
      const { id, amount, category, wallet, description } = action.payload;
      const index = state.amount.findIndex((item) => item.id === id);
      state.amount[index].amount = amount;
      state.amount[index].category = category;
      state.amount[index].description = description;
      state.amount[index].wallet = wallet;
    },
    addBudget: (state, action) => {
      const existingTransaction = state.budget.find((transaction) => transaction.id === action.payload.id);
      if (!existingTransaction) {
        state.budget.unshift(action.payload);
      }
    },
    deleteBudget: (state, action) => {
      const id = action.payload;
      const index = state.budget.findIndex((item) => item.id === id);
      state.budget = [...state.budget.slice(0, index), ...state.budget.slice(index + 1)];
    },
    updateBudget: (state, action) => {
      const { id, amount, category, percentage, noti } = action.payload;
      const index = state.budget.findIndex((item) => item.id === id);
      state.budget[index].amount = amount;
      state.budget[index].category = category;
      state.budget[index].notification = noti;
      state.budget[index].percentage = percentage;
    },
    clearData: (state) => {
      state.amount = [];
      state.budget = [];
      state.loading = false;
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  addBudget,
  deleteBudget,
  updateBudget,
  updateTransaction,
  loadingTransaction,
  clearData,
} = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
