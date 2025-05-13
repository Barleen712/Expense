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

export const CategoryExpense = createSelector([selectExpensesAndTransfers], (transactions) => {
  const monthlyData: Record<string, { [category: string]: number }> = {};

  const monthlyTotals: Record<string, number> = {};

  // Step 1: Group by month and category
  for (const transaction of transactions) {
    const monthKey = new Date(transaction.Date).getMonth();
    const category = transaction.category.includes("->") ? "Transfer" : transaction.category;

    if (!monthlyData[monthKey]) monthlyData[monthKey] = {};
    if (!monthlyData[monthKey][category]) monthlyData[monthKey][category] = 0;

    monthlyData[monthKey][category] += transaction.amount;

    // Track total expense for month
    if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
    monthlyTotals[monthKey] += transaction.amount;
  }

  // Step 2: Build formatted result
  const result: Record<string, { category: string; amount: number; total: number }[]> = {};

  for (const month in monthlyData) {
    const expenseTotal = monthlyTotals[month] || 1; // avoid division by 0
    result[month] = Object.entries(monthlyData[month])
      .map(([category, amount]) => ({
        category,
        amount,
        total: (amount / expenseTotal) * 100,
      }))
      .sort((a, b) => b.total - a.total);
  }

  return result;
});

export const CategoryIncome = createSelector([selectIncome], (transactions) => {
  const monthlyCategoryMap: Record<string, Record<string, number>> = {};
  const monthlyIncomeTotal: Record<string, number> = {};

  for (const txn of transactions) {
    const monthKey = new Date(txn.Date).getMonth();
    const category = txn.category;

    if (!monthlyCategoryMap[monthKey]) monthlyCategoryMap[monthKey] = {};
    if (!monthlyIncomeTotal[monthKey]) monthlyIncomeTotal[monthKey] = 0;

    if (!monthlyCategoryMap[monthKey][category]) monthlyCategoryMap[monthKey][category] = 0;

    monthlyCategoryMap[monthKey][category] += txn.amount;
    monthlyIncomeTotal[monthKey] += txn.amount;
  }

  const result: Record<string, { category: string; total: number }[]> = {};

  for (const month in monthlyCategoryMap) {
    const incomeTotal = monthlyIncomeTotal[month] || 1;
    result[month] = Object.entries(monthlyCategoryMap[month])
      .map(([category, amount]) => ({
        category,
        amount,
        total: (amount / incomeTotal) * 100,
      }))
      .sort((a, b) => b.total - a.total);
  }
  return result;
});

export const BudgetCategory = createSelector([selectBudget, CategoryExpense], (budgetItems, categoryByMonth) => {
  const result: Record<string, any[]> = {};

  for (const item of budgetItems) {
    const monthKey = item.month;

    const categoriesForMonth = categoryByMonth[monthKey] || [];
    const categorySpent = categoriesForMonth.find((value) => value.category === item.category);
    const spentAmount = categorySpent ? categorySpent.amount : 0;

    const budgetEntry = {
      id: item.id,
      category: item.category,
      budgetvalue: item.amount,
      amountSpent: spentAmount,
      alertPercent: item.percentage,
      notification: item.notification,
      notified: item.notified,
    };
    if (!result[monthKey]) result[monthKey] = [];
    result[monthKey].push(budgetEntry);
  }
  return result;
});
