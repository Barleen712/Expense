import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../Store/Store";
import i18n from "../i18n/i18next";
import { act } from "react";
interface IncomeEntry {
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
  Date: string;
  id: string;
  repeat: boolean;
  Frequency?: string;
  endAfter?: string;
  endDate?: Date;
  startDate?: number;
  startMonth?: string;
  startYear?: string;
}
interface BudgetEntry {
  Date: string;
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
  Photo: { uri: string };
  user: string;
  index: null | number;
  pin: string;
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
  badgeCount: number;
}

const initialState: IncomeState = {
  amount: [],
  budget: [],
  loading: false,
  notification: [],
  signup: { Photo: { uri: "" }, user: "", index: null, pin: "" },
  googleSign: { id: "", username: "", google: false, photo: "" },
  preferences: { currency: "USD", language: "English", theme: "Light", security: "PIN" },
  exceedNotification: false,
  expenseAlert: false,
  badgeCount: 0,
};

export const ExpenseTrackerSlice = createSlice({
  name: "Money",
  initialState,
  reducers: {
    loadingTransaction: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addTransaction: (state, action) => {
      const existingTransaction = state.amount.find((transaction) => transaction._id === action.payload._id);
      if (!existingTransaction) {
        state.amount.push(action.payload);
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      console.log(action.payload);
      const index = state.amount.findIndex((item) => item._id === id);
      state.amount = [...state.amount.slice(0, index), ...state.amount.slice(index + 1)];
    },
    updateTransaction: (state, action) => {
      const { id, amount, category, wallet, description, url } = action.payload;
      const index = state.amount.findIndex((item) => item._id === id);
      state.amount[index].amount = amount;
      state.amount[index].category = category;
      state.amount[index].description = description;
      state.amount[index].wallet = wallet;
      state.amount[index].url = url;
    },
    updateExceed: (state, action) => {
      state.exceedNotification = action.payload;
    },
    updateExpenseAlert: (state, action) => {
      state.expenseAlert = action.payload;
    },
    addBudget: (state, action) => {
      const existingTransaction = state.budget.find((transaction) => transaction._id === action.payload._id);
      if (!existingTransaction) {
        state.budget.unshift(action.payload);
      }
    },
    deleteBudget: (state, action) => {
      const id = action.payload;
      const index = state.budget.findIndex((item) => item._id === id);
      state.budget = [...state.budget.slice(0, index), ...state.budget.slice(index + 1)];
    },
    updateBudget: (state, action) => {
      const { id, amount, category, percentage, notification, notified } = action.payload;
      const index = state.budget.findIndex((item) => item._id === id);
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
    updateBadge: (state, action) => {
      state.badgeCount = action.payload;
    },
    addNotification: (state, action) => {
      const existingTransaction = state.notification.find((transaction) => transaction.id === action.payload.id);
      if (!existingTransaction) {
        state.notification.unshift(action.payload);
        state.badgeCount += 1;
      }
    },
    addUser: (state, action) => {
      state.signup = action.payload;
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
    removeNotification: (state) => {
      state.notification = [];
    },
    clearData: (state) => {
      state.amount = [];
      state.budget = [];
      state.loading = false;
      state.notification = [];
      state.signup = { Photo: { uri: "" }, user: "", index: null, pin: "" };
      state.googleSign = { id: "", username: "", google: false, photo: "" };
      state.preferences = { currency: "USD", language: "English", theme: "Light", security: "PIN" };
      state.exceedNotification = false;
      state.expenseAlert = false;
      state.badgeCount = 0;
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
  removeNotification,
  updateBadge,
} = ExpenseTrackerSlice.actions;
export default ExpenseTrackerSlice.reducer;
export const updatePreferences =
  (key: keyof Preferences, value: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentPrefs = getState().Money.preferences;
      const newPrefs = { ...currentPrefs, [key]: value };
      await AsyncStorage.setItem("@preferences", JSON.stringify(newPrefs));

      switch (key) {
        case "theme":
          dispatch(changeTheme(value));
          break;
        case "currency":
          dispatch(changeCurrency(value));
          break;
        case "security":
          dispatch(changeSecurity(value));
          break;
      }
    } catch (error) {
      console.error("Failed to update preference:", error);
    }
  };
export const loadPreferences = () => async (dispatch: AppDispatch) => {
  try {
    const stored = await AsyncStorage.getItem("@preferences");

    if (stored) {
      const prefs: Preferences = JSON.parse(stored);
      dispatch(changeTheme(prefs.theme));
      dispatch(changeCurrency(prefs.currency));
      dispatch(changeLanguages(prefs.language));
      dispatch(changeSecurity(prefs.security));
      // 🔥 Add this line to actually apply the language in i18n:
      const langMap = {
        English: "en",
        Spanish: "es",
        Italian: "it",
        Hindi: "hi",
        Arabic: "ar",
        Chinese: "zh",
      };
      const langCode = langMap[prefs.language];
      if (langCode) i18n.changeLanguage(langCode);
    }
  } catch (error) {
    console.error("Failed to load preferences:", error);
  }
};
