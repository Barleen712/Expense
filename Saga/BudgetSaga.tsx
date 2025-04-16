// BudgetSaga.ts
import { call, put, select, takeLatest } from "redux-saga/effects";
import { onDisplayNotification } from "../Screens/DrawerScreens/Budget/TestNotification";
import { BudgetCategory } from "../Slice/Selectors";
import { addTransaction } from "../Slice/IncomeSlice";
console.log(addTransaction.type);
function* handleExpenseCheck(action) {
  if (action.payload.moneyCategory === "Expense") {
    const budgetItems: {
      category: string;
      budgetvalue: number;
      amountSpent: number;
      alertPercent: number;
      notification: number;
    }[] = yield select(BudgetCategory);
    const category = action.payload.category;

    const matchingBudget = budgetItems.find((item) => item.category === category);

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
          title: "Budget Exceed",
          body: "You have exceded the limit",
        });
      }
    }
  }
}

export function* BudgetSaga() {
  yield takeLatest("Money/addTransaction", handleExpenseCheck);
}
