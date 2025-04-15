import { configureStore } from "@reduxjs/toolkit";
import ExpenseTrackerReducer from "../Slice/IncomeSlice";
import CurrencyConverterReducer from "../Slice/CurrencySlice";
import createSagaMiddleware from "redux-saga";
import CurrencySaga from "../Saga/Saga";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    Money: ExpenseTrackerReducer,
    Rates: CurrencyConverterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(CurrencySaga);
export default store;
export type RootState = ReturnType<typeof store.getState>;
