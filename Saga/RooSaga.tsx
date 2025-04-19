import { all } from "redux-saga/effects";
import CurrencySaga from "./Saga"; // Your existing currency saga
import { BudgetSaga } from "./BudgetNotification"

export default function* rootSaga() {
  yield all([CurrencySaga(), BudgetSaga()]);
}
