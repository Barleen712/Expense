import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../Store/Store";
const selectMoney = (state: RootState) => state.Money;
const getStartDate = (item) => {
  let startMonthIndex;
  if (typeof item.startMonth === "string") {
    const date = new Date(`${item.startMonth} 1, ${item.startYear}`);
    startMonthIndex = isNaN(date.getMonth()) ? new Date(item.Date).getMonth() : date.getMonth();
  } else {
    startMonthIndex = item.startMonth ?? new Date(item.Date).getMonth();
  }

  return new Date(
    item.startYear ?? new Date(item.Date).getFullYear(),
    startMonthIndex,
    item.startDate ?? new Date(item.Date).getDate()
  );
};

const setTime = (targetDate, sourceDate) => {
  targetDate.setHours(sourceDate.getHours());
  targetDate.setMinutes(sourceDate.getMinutes());
  targetDate.setSeconds(sourceDate.getSeconds());
  targetDate.setMilliseconds(sourceDate.getMilliseconds());
};

const generateRepeats = (item, addedTime, todayISO) => {
  const repeats = [];
  const startDate = getStartDate(item);
  const firstOccurrence = new Date(startDate);
  setTime(firstOccurrence, addedTime);

  let repeatCount = 0;
  let currentDate = new Date(firstOccurrence);
  const endDate = item.endAfter === "Date" ? new Date(item.endDate) : null;
  const maxRepeats = item.endAfter === "Never" ? 365 : 12;

  while (true) {
    if (
      (item.endAfter === "Never" && repeatCount >= maxRepeats) ||
      (item.endAfter === "Date" && currentDate > endDate)
    ) {
      break;
    }

    const iso = currentDate.toISOString();
    if (iso !== todayISO) {
      repeats.push({ ...item, Date: iso });
    }

    let nextDate = new Date(currentDate);
    setTime(nextDate, addedTime);

    switch (item.Frequency) {
      case "Daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "Weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "Monthly": {
        nextDate.setMonth(nextDate.getMonth() + 1);
        const day = nextDate.getDate();
        const nextMonth = nextDate.getMonth() + 1;
        const daysInNextMonth = new Date(nextDate.getFullYear(), nextMonth + 1, 0).getDate();
        nextDate.setDate(Math.min(day, daysInNextMonth));
        break;
      }

      case "Yearly":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        return repeats;
    }

    currentDate = nextDate;
    repeatCount++;
  }

  return repeats;
};

export const selectTransactions = createSelector([(state) => state.Money.amount], (transactions) => {
  const extendedTransactions = [];
  transactions.forEach((item) => {
    const addedDate = new Date(item.Date);
    const todayISO = addedDate.toISOString();

    extendedTransactions.push({
      ...item,
      Date: todayISO,
    });

    if (item.repeat && item.Frequency) {
      const repeats = generateRepeats(item, addedDate, todayISO);
      extendedTransactions.push(...repeats);
    }
  });

  return extendedTransactions;
});

export const selectBudget = createSelector([selectMoney], (money) => money.budget);

const getMonthYearKey = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

// Monthly Income
export const selectMonthlyIncomeTotals = createSelector([selectTransactions], (transactions) => {
  const result = {};
  transactions.forEach((item) => {
    if (item.moneyCategory === "Income" && new Date(item.Date) <= new Date()) {
      const key = getMonthYearKey(item.Date);
      result[key] = (result[key] || 0) + item.amount;
    }
  });
  return result;
});

// Monthly Expense (and Transfer)
export const selectMonthlyExpenseTotals = createSelector([selectTransactions], (transactions) => {
  const result = {};
  transactions.forEach((item) => {
    if ((item.moneyCategory === "Expense" || item.moneyCategory === "Transfer") && new Date(item.Date) <= new Date()) {
      const key = getMonthYearKey(item.Date);
      result[key] = (result[key] || 0) + item.amount;
    }
  });
  return result;
});

export const selectExpensesAndTransfers = createSelector([selectTransactions], (transactions) =>
  transactions.filter((item) => item.moneyCategory === "Expense" || item.moneyCategory === "Transfer")
);
export const selectIncome = createSelector([selectTransactions], (transactions) =>
  transactions.filter((item) => item.moneyCategory === "Income")
);
export const groupedMonthlyExpensesAndTransfers = createSelector([selectExpensesAndTransfers], (transactions) => {
  const grouped: Record<string, typeof transactions> = {};

  transactions
    .filter((item) => new Date(item.Date) <= new Date())
    .forEach((item) => {
      const date = new Date(item.Date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

  return grouped;
});
export const groupedMonthlyIncome = createSelector([selectIncome], (transactions) => {
  const grouped: Record<string, typeof transactions> = {};

  transactions
    .filter((item) => new Date(item.Date) <= new Date())
    .forEach((item) => {
      const date = new Date(item.Date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

  return grouped;
});

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
      id: item._id,
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
