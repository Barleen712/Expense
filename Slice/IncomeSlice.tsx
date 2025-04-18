import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IncomeEntry {
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
  Date:string,
  id: string;
}
interface BudgetEntery {
  amount: number;
  category: number;
  percentage: number;
  notification: boolean;
}

interface IncomeState {
  amount: IncomeEntry[];
  budget: BudgetEntery[];
  loading:boolean;
}

const initialState: IncomeState = {
  amount: [],
  budget: [],
  loading:false,

};

export const ExpenseTrackerSlice = createSlice({
  name: "Money",
  initialState,
  reducers: {
    loadingTransaction:(state,action: PayloadAction<boolean>)=>
    {
      state.loading=action.payload
    },
    addTransaction: (state,action)=>
    {
      state.loading=false
      const existingTransaction = state.amount.find(
        (transaction) => transaction.id === action.payload.id
      );
      if (!existingTransaction) {
        state.amount.push(action.payload);
      }
    },
    deleteTransaction: (state, action) => {
      const { keyVal } = action.payload;

      const index = state.amount.findIndex((item) => item.key === keyVal);
      state.amount = [...state.amount.slice(0, index), ...state.amount.slice(index + 1)];
    },
    updateTransaction: (state, action) => {
      const { key, amount, category, wallet, description } = action.payload;
      const index = state.amount.findIndex((item) => item.key === key);
      state.amount[index].amount = amount;
      state.amount[index].category = category;
      state.amount[index].description = description;
      state.amount[index].wallet = wallet;
    },
    addBudget: (state, action) => {
      state.budget.unshift(action.payload);
      console.log(state.budget);
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

export const { addTransaction, deleteTransaction, addBudget, deleteBudget, updateBudget, updateTransaction,
  loadingTransaction
} =
  ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
