import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState, AppDispatch } from "../Store/Store";
import i18n from "../i18n/i18next";
interface IncomeEntry {
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
  Date: string;
  _id: string;
  repeat: boolean;
  Frequency?: string;
  endAfter?: string;
  endDate?: Date;
  startDate?: number;
  startMonth?: string;
  startYear?: string;
  url?: string;
  weekly?: string;
  type?: string;
}
interface BudgetEntry {
  Date: string;
  amount: number;
  category: string;
  percentage: number;
  notification: boolean;
  _id: string;
  notified?: boolean;
}
interface NotificationEntry {
  title: string;
  body: string;
  date: string;
  id: string;
}
interface Signup {
  Photo: { uri: string };
  User: string;
  index: null | number;
  pin: string;
  Google: boolean;
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
  notification: NotificationEntry[];
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
  signup: { Photo: { uri: "" }, User: "", index: null, pin: "", Google: false },
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
      try {
        const existingTransaction = state.amount.find((transaction) => transaction._id === action.payload._id);
        if (!existingTransaction) {
          state.amount.push(action.payload);
        }
      } catch (error) {
        console.log(error);
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      const index = state.amount.findIndex((item) => item._id === id);
      state.amount = [...state.amount.slice(0, index), ...state.amount.slice(index + 1)];
    },
    updateTransaction: (state, action) => {
      const {
        id,
        amount,
        category,
        wallet,
        description,
        url,
        Frequency,
        weekly,
        endDate,
        repeat,
        startDate,
        startMonth,
        startYear,
        endAfter,
        type,
      } = action.payload;

      const index = state.amount.findIndex((item) => item._id === id);

      if (index !== -1) {
        state.amount[index] = {
          ...state.amount[index], // Preserve other properties
          type,
          amount,
          category,
          wallet,
          description,
          url,
          Frequency,
          weekly,
          endDate,
          repeat,
          startDate,
          startMonth,
          startYear,
          endAfter,
        };
      }
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
      const existingTransaction = state.notification.find((transaction) => transaction.date === action.payload.date);
      if (!existingTransaction) {
        state.notification.unshift(action.payload);
        state.badgeCount += 1;
      }
    },
    addUser: (state, action) => {
      state.signup = action.payload;
    },
    updateUser: (state, action) => {
      const { Photo, username, Index } = action.payload;

      state.signup.Photo.uri = Photo;
      state.signup.User = username;
      state.signup.index = Index;
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
      state.signup = { Photo: { uri: "" }, User: "", index: null, pin: "", Google: false };
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
  updateUser,
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
      const langMap = {
        English: "en",
        Spanish: "es",
        Italian: "it",
        Hindi: "hi",
        Arabic: "ar",
        Chinese: "zh",
      };
      const langCode = langMap[prefs.language as keyof typeof langMap];
      if (langCode) i18n.changeLanguage(langCode);
    }
  } catch (error) {
    console.error("Failed to load preferences:", error);
  }
};
