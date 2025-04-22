import { createSelector } from "@reduxjs/toolkit";

const selectMoney = (state: RootState) => state.Money;

export const selectTransactions = createSelector([selectMoney], (money) => money.amount);
export const selectBudget = createSelector([selectMoney], (money) => money.budget);

export const selectIncomeTotal = createSelector([selectTransactions], (transactions) =>
  transactions.reduce(
    (acc, item) => (item.moneyCategory === "Income"?acc + item.amount : acc),
    0
  )
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
        id:item.id,
        category: item.category,
        budgetvalue: item.amount,
        amountSpent: spentAmount,
        alertPercent: item.percentage,
        notification: item.notification,
        notified:item.notified
      };
    });
  }
);
