// BudgetSaga.ts
import { call, put, select, takeLatest } from "redux-saga/effects";
import { v4 as uuidv4 } from "uuid";
import { onDisplayNotification } from "../Screens/DrawerScreens/Budget/TestNotification";
import { BudgetCategory } from "../Slice/Selectors";
import { addNotification } from "../Slice/IncomeSlice";

function* handleExpenseCheck(action) {
  if (action.payload.moneyCategory === "Expense") {
    const budgetItems = yield select(BudgetCategory);
    const category = action.payload.category;
    const matchingBudget = budgetItems.find((item) => item.category === category);
    console.log(matchingBudget);
    if (matchingBudget) {
      const { budgetvalue, amountSpent, alertPercent, notification } = matchingBudget;
      const progress = (amountSpent / budgetvalue) * 100;

      if (progress >= alertPercent && notification) {
        yield call(onDisplayNotification, {
          title: "Budget Alert",
          body: `${category} expenses have crossed ${alertPercent}% of budget!`,
        });
      }

      if (progress > 100) {
        yield call(onDisplayNotification, {
          title: `${category} Budget Exceeded`,
          body: "You have exceeded the limit",
        });
        console.log("heelo1234");
      }
    }
  }
}

export function* BudgetSaga() {
  yield takeLatest("Money/addTransaction", handleExpenseCheck);
}
