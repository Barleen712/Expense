import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../Store/Store";
const selectMoney = (state: RootState) => state.Money;

export const selectTransactions = createSelector([(state) => state.Money.amount], (transactions) => {
  const expanded = [];

  transactions.forEach((tx) => {
    const {
      Frequency,
      startDate,
      endDate, // This is the specific end date
      endAfter, // This is either a date or "never"
      id,
      repeat,
    } = tx;

    if (repeat && Frequency && startDate) {
      const start = new Date(startDate);
      const current = new Date(start);

      const end = endDate ? new Date(endDate) : null;
      const endAfterDate = endAfter && endAfter !== "never" ? new Date(endAfter) : null;

      let count = 0;

      while ((!end || current <= end) && (!endAfterDate || current <= endAfterDate)) {
        expanded.push({
          ...tx,
          Date: current.toISOString(),
          id: `${id}_${current.getTime()}`,
        });

        // Apply frequency logic (daily, weekly, monthly)
        if (Frequency === "daily") current.setDate(current.getDate() + 1);
        else if (Frequency === "weekly") current.setDate(current.getDate() + 7);
        else if (Frequency === "monthly") current.setMonth(current.getMonth() + 1);
        else break;

        count++;
      }
    } else {
      expanded.push(tx);
    }
  });

  return expanded;
});

export const selectBudget = createSelector([selectMoney], (money) => money.budget);

export const selectIncomeTotal = createSelector([selectTransactions], (transactions) =>
  transactions.reduce((acc, item) => (item.moneyCategory === "Income" ? acc + item.amount : acc), 0)
);

export const selectExpenseTotal = createSelector([selectTransactions], (transactions) =>
  transactions.reduce(
    (acc, item) => (item.moneyCategory === "Expense" || item.moneyCategory === "Transfer" ? acc + item.amount : acc),
    0
  )
);
export const selectExpensesAndTransfers = createSelector([selectTransactions], (transactions) =>
  transactions.filter((item) => item.moneyCategory === "Expense" || item.moneyCategory === "Transfer")
);
export const selectIncome = createSelector([selectTransactions], (transactions) =>
  transactions.filter((item) => item.moneyCategory === "Income")
);

export const CategoryExpense = createSelector(
  [selectExpensesAndTransfers, selectExpenseTotal],
  (transactions, expenseTotal) => {
    const categoryMap = transactions.reduce((acc, transaction) => {
      const category = transaction.category.includes("->") ? "Transfer" : transaction.category;

      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap)
      .map(([category, total]) => ({
        category,
        amount: total,
        total: (total / expenseTotal) * 100,
      }))
      .sort((a, b) => b.total - a.total);
  }
);
export const CategoryIncome = createSelector([selectIncome, selectIncomeTotal], (transactions, incomeTotal) => {
  const categoryMap = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;

    return acc;
  }, {} as Record<string, number>);
  return Object.entries(categoryMap)
    .map(([category, total]) => ({
      category,
      total: (total / incomeTotal) * 100,
    }))
    .sort((a, b) => b.total - a.total);
});
export const BudgetCategory = createSelector(
  [selectBudget, CategoryExpense, selectExpenseTotal],
  (budget, categoryPercentages, totalExpenses) => {
    return budget.map((item) => {
      const categorySpent = categoryPercentages.find((value) => value.category === item.category);

      const spentAmount = categorySpent ? categorySpent.amount : 0;

      return {
        id: item.id,
        category: item.category,
        budgetvalue: item.amount,
        amountSpent: spentAmount,
        alertPercent: item.percentage,
        notification: item.notification,
        notified: item.notified,
      };
    });
  }
);
