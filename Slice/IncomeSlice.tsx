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
interface BudgetEntry {
  amount: number;
  category: number;
  percentage: number;
  notification: boolean;
  id: string;
  notified?:boolean
}
interface notificationEntry{
  title:string,
  body:string,
  date:string,
  id:string

}

interface IncomeState {
  amount: IncomeEntry[];
  budget: BudgetEntry[];
  loading: boolean;
  notification:notificationEntry[]
}

const initialState: IncomeState = {
  amount: [],
  budget: [],
  loading: false,
  notification:[]
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
      const { id, amount, category, percentage, notification, notified } = action.payload;
      const index = state.budget.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.budget[index] = {
          ...state.budget[index],
          amount,
          category,
          percentage,
          notification,
          notified,
        };
      }
    },
    addNotification:(state,action)=>
    {
      const existingTransaction = state.notification.find((transaction) => transaction.id === action.payload.id);
      if (!existingTransaction) {
      state.notification.unshift(action.payload)
      }
    },
    
    clearData: (state) => {
      state.amount = [];
      state.budget = [];
      state.loading = false;
      state.notification=[]
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
  addNotification,
  clearData,
} = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
