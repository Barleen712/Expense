import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../Store/Store";
const selectMoney = (state: RootState) => state.Money;
const currentDate = new Date();
export const selectTransactions = createSelector([(state) => state.Money.amount], (transactions) => {
  const extendedTransactions = [];

  // transactions.forEach((item) => {
  //   let startMonthIndex;
  //   if (typeof item.startMonth === "string") {
  //     const date = new Date(`${item.startMonth} 1, ${item.startYear}`);
  //     startMonthIndex = isNaN(date.getMonth()) ? new Date(item.Date).getMonth() : date.getMonth();
  //   } else {
  //     startMonthIndex = item.startMonth ?? new Date(item.Date).getMonth();
  //   }

  //   const startDate = new Date(
  //     item.startYear ?? new Date(item.Date).getFullYear(),
  //     startMonthIndex,
  //     item.startDate ?? new Date(item.Date).getDate()
  //   );

  //   const addedDate = new Date(item.Date);
  //   const addedTime = {
  //     hours: addedDate.getHours(),
  //     minutes: addedDate.getMinutes(),
  //     seconds: addedDate.getSeconds(),
  //     milliseconds: addedDate.getMilliseconds(),
  //   };

  //   const endDate = item.endAfter === "Date" ? new Date(item.endDate) : null;
  //   const maxRepeats = item.endAfter === "Never" ? 365 : 12;
  //   const firstOccurrence = new Date(startDate);
  //   firstOccurrence.setHours(addedTime.hours);
  //   firstOccurrence.setMinutes(addedTime.minutes);
  //   firstOccurrence.setSeconds(addedTime.seconds);
  //   firstOccurrence.setMilliseconds(addedTime.milliseconds);

  //   extendedTransactions.push({
  //     ...item,
  //     Date: firstOccurrence.toISOString(),
  //   });

  //   let repeatCount = 0;
  //   let currentDate = new Date(firstOccurrence); // Start from the first occurrence

  //   while (true) {
  //     // If "Never" and maxRepeats reached, break the loop
  //     if (item.endAfter === "Never" && repeatCount >= maxRepeats) break;
  //     // If "Date" and we pass the endDate, break the loop
  //     if (item.endAfter === "Date" && currentDate >= endDate) break;

  //     let nextDate = new Date(currentDate); // clone to avoid mutation

  //     // Apply the exact time from the item.Date (when the transaction is added)
  //     nextDate.setHours(addedTime.hours);
  //     nextDate.setMinutes(addedTime.minutes);
  //     nextDate.setSeconds(addedTime.seconds);
  //     nextDate.setMilliseconds(addedTime.milliseconds);

  //     switch (item.Frequency) {
  //       case "Daily":
  //         nextDate.setDate(nextDate.getDate() + 1);
  //         break;
  //       case "Weekly":
  //         nextDate.setDate(nextDate.getDate() + 7);
  //         break;
  //       case "Monthly":
  //         nextDate.setMonth(nextDate.getMonth() + 1);
  //         // Ensure it doesn't go out of bounds in a shorter month (e.g., February)
  //         const day = nextDate.getDate();
  //         const nextMonth = nextDate.getMonth() + 1;
  //         const daysInNextMonth = new Date(nextDate.getFullYear(), nextMonth + 1, 0).getDate();
  //         nextDate.setDate(Math.min(day, daysInNextMonth));
  //         break;
  //       case "Yearly":
  //         nextDate.setFullYear(nextDate.getFullYear() + 1);
  //         break;
  //       default:
  //         return;
  //     }

  //     // Avoid pushing past endDate if "Date" is used
  //     if (item.endAfter === "Date" && nextDate > endDate) break;

  //     extendedTransactions.push({
  //       ...item,
  //       Date: nextDate.toISOString(),
  //     });

  //     currentDate = nextDate;
  //     repeatCount++;
  //   }
  // });
  return transactions;
});

export const selectBudget = createSelector([selectMoney], (money) => money.budget);

export const selectIncomeTotal = createSelector([selectTransactions], (transactions) =>
  transactions
    .filter((item) => new Date(item.Date) <= new Date())
    .reduce((acc, item) => (item.moneyCategory === "Income" ? acc + item.amount : acc), 0)
);

export const selectExpenseTotal = createSelector([selectTransactions], (transactions) =>
  transactions
    .filter((item) => new Date(item.Date) <= new Date())
    .reduce(
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

  const dated = transactions.filter((item) => new Date(item.Date) <= new Date());

  for (const transaction of dated) {
    const date = new Date(transaction.Date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    const category = transaction.category.includes("->") ? "Transfer" : transaction.category;

    if (!monthlyData[monthKey]) monthlyData[monthKey] = {};
    if (!monthlyData[monthKey][category]) monthlyData[monthKey][category] = 0;

    monthlyData[monthKey][category] += transaction.amount;

    if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
    monthlyTotals[monthKey] += transaction.amount;
  }

  const result: Record<string, { category: string; amount: number; total: number }[]> = {};

  for (const month in monthlyData) {
    const expenseTotal = monthlyTotals[month] || 1;
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

  const dated = transactions.filter((item) => new Date(item.Date) <= new Date());

  for (const txn of dated) {
    const date = new Date(txn.Date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
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
    // Ensure month is 0-indexed (0–11), adjust accordingly if not
    const monthNumber = typeof item.month === "number" ? item.month : parseInt(item.month, 10);
    const monthKey = `${item.year}-${String(monthNumber + 1).padStart(2, "0")}`; // Format: YYYY-MM

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
      year: item.year,
      month: monthKey,
    };

    if (!result[monthKey]) result[monthKey] = [];
    result[monthKey].push(budgetEntry);
  }

  return result;
});
