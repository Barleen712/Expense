import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changeLanguage } from "i18next";
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
  notified?: boolean;
}
interface notificationEntry {
  title: string;
  body: string;
  date: string;
  id: string;
}
interface Signup {
  name: string;
  email: string;
  password: string;
  google: boolean;
}
interface GoogleSign {
  id: string;
  google: boolean;
  username: string;
  photo: string;
}
interface Preferences {
  currency: string;
  language: string;
  theme: string;
  security: string;
}
interface IncomeState {
  amount: IncomeEntry[];
  budget: BudgetEntry[];
  loading: boolean;
  notification: notificationEntry[];
  signup: Signup;
  googleSign: GoogleSign;
  preferences: Preferences;
  exceedNotification: boolean;
  expenseAlert: boolean;
}

const initialState: IncomeState = {
  amount: [],
  budget: [],
  loading: false,
  notification: [],
  signup: { name: "", email: "", password: "", google: false },
  googleSign: { id: "", username: "", google: false, photo: "" },
  preferences: { currency: "USD", language: "English", theme: "Light", security: "Fingerprint" },
  exceedNotification: false,
  expenseAlert: false,
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
    updateExceed: (state, action) => {
      state.exceedNotification = action.payload;
    },
    updateExpenseAlert: (state, action) => {
      state.expenseAlert = action.payload;
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
    addNotification: (state, action) => {
      const existingTransaction = state.notification.find((transaction) => transaction.id === action.payload.id);
      if (!existingTransaction) {
        state.notification.unshift(action.payload);
      }
    },
    addUser: (state, action) => {
      const { name, email, password } = action.payload;
      state.signup.name = name;
      state.signup.email = email;
      state.signup.password = password;
    },
    addGoogleUser: (state, action) => {
      const { id, google, username, photo } = action.payload;
      state.googleSign.id = id;
      state.googleSign.google = google;
      state.googleSign.username = username;
      state.googleSign.photo = photo;
    },
    changeTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    changeLanguages: (state, action) => {
      state.preferences.language = action.payload;
    },
    changeCurrency: (state, action) => {
      state.preferences.currency = action.payload;
    },
    changeSecurity: (state, action) => {
      state.preferences.security = action.payload;
    },
    clearData: (state) => {
      state.amount = [];
      state.budget = [];
      state.loading = false;
      state.notification = [];
      state.signup.name = "";
      state.signup.email = "";
      state.signup.password = "";
      state.googleSign.google = false;
      (state.googleSign.id = ""), (state.googleSign.photo = "");
      state.googleSign.username = "";
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
  addUser,
  clearData,
  changeTheme,
  changeCurrency,
  changeLanguages,
  changeSecurity,
  addGoogleUser,
  updateExceed,
  updateExpenseAlert,
} = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
