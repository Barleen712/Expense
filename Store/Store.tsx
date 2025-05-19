import { configureStore } from "@reduxjs/toolkit";
import ExpenseTrackerReducer from "../Slice/IncomeSlice";
import CurrencyConverterReducer from "../Slice/CurrencySlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../Saga/RooSaga";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Money: ExpenseTrackerReducer,
  Rates: CurrencyConverterReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["Money", "Rates"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
