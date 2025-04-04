import { configureStore } from "@reduxjs/toolkit";
import ExpenseTrackerReducer from "../Slice/IncomeSlice";

const store = configureStore({
  reducer: {
    Money: ExpenseTrackerReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
