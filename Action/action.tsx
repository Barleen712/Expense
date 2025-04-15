export const fetchRates = () => ({ type: "FETCH_RATES" });
export const fetchRatesSuccess = (rates: string) => ({
  type: "FETCH_RATES_SUCCESS",
  payload: rates,
});
export const fetchRatesFailure = (error: string) => ({
  type: "FETCH_RATES_FAILURE",
  payload: error,
});
