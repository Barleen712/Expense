import { all } from "redux-saga/effects";
import CurrencySaga from "./Saga";

export default function* rootSaga() {
  yield all([CurrencySaga()]);
}
