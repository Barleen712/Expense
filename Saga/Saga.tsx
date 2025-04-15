import { call, put, takeLatest } from "redux-saga/effects";
import { fetchRates, fetchRatesFailure, fetchRatesSuccess } from "../Slice/CurrencySlice";
async function FetchCurrencyRates() {
  const response = await fetch("https://openexchangerates.org/api/latest.json?app_id=f67799b6171b48c39cdb35aecb83f965");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data;
}
function* FetchRates() {
  try {
    const rates: { rates: { [currency: string]: number } } = yield call(FetchCurrencyRates);
    yield put(fetchRatesSuccess(rates));
  } catch (error) {
    yield put(fetchRatesFailure(error));
  }
}
function* CurrencySaga() {
  yield takeLatest(fetchRates.type, FetchRates);
}
export default CurrencySaga;
// https://openexchangerates.org/api/latest.json?app_id=f67799b6171b48c39cdb35aecb83f965
