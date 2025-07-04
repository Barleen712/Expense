import { printToFileAsync } from "expo-print";
import * as Sharing from "expo-sharing";
import { RootState, store } from "../../../../Store/Store";
import {
  selectTransactions,
  selectMonthlyIncomeTotals,
  selectMonthlyExpenseTotals,
  BudgetCategory,
} from "../../../../Slice/Selectors";

const data = [
  { label: "Income", value: "0" },
  { label: "Expense", value: "1" },
  { label: "Transfer", value: "2" },
  { label: "Budget", value: "3" },
  { label: "All", value: "4" },
];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const dateRanges = {
  "0": () => new Date(new Date().setHours(0, 0, 0, 0)), // Today
  "1": () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
  "2": () => new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Last 15 days
  "3": () => new Date(new Date().getFullYear(), new Date().getMonth(), 1), // This month
};

export const generateReportPDF = async (exportdata: string, dateRange: string) => {
  const state: RootState = store.getState();
  const transactions = selectTransactions(state);
  const selectedKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const income = selectMonthlyIncomeTotals(state);
  const incomeTotal = income[selectedKey] || 0;
  const expense = selectMonthlyExpenseTotals(state);
  const expenseTotal = expense[selectedKey] || 0;
  const budgetMap = BudgetCategory(state); // Format: { "YYYY-MM": [...] }

  const now = new Date();
  const startDate = dateRanges[dateRange]?.() || new Date(0);

  const filterOption = data.find((item) => item.value === exportdata);
  const matchCategory = (t) => filterOption?.value === "4" || t.moneyCategory === filterOption?.label;
  const matchDate = (t) => new Date(t.Date) >= startDate && new Date(t.Date) <= new Date();

  const filteredTransactions = transactions.filter((t) => matchCategory(t) && matchDate(t));
  const transactionRows = filteredTransactions
    .map((t) => {
      const date = new Date(t.Date).toLocaleDateString();
      return `
        <tr>
          <td>${date}</td>
          <td>${t.moneyCategory}</td>
          <td>${t.category}</td>
          <td>$${t.amount.toFixed(2)}</td>
          <td>${t.description}</td>
          <td>${t.wallet}</td>
        </tr>`;
    })
    .join("");

  const includeBudget = filterOption?.value === "3" || filterOption?.value === "4";
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const budgetData = includeBudget ? budgetMap[currentMonthKey] || [] : [];

  const budgetRows = budgetData
    .map(
      (b) => `
        <tr>
          <td>${b.category}</td>
          <td>$${b.budgetvalue}</td>
          <td>$${b.amountSpent.toFixed(2)}</td>
          <td>${b.alertPercent}%</td>
        </tr>`
    )
    .join("");

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
          th { background-color: #f2f2f2; }
          h2 { color: rgb(42, 124, 118); }
        </style>
      </head>
      <body>
        <h2>Income & Expense Report</h2>
        ${
          filterOption?.value !== "3"
            ? `
        <p><strong>Total Income:</strong> $${incomeTotal.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> $${expenseTotal.toFixed(2)}</p>

        <h2>Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Wallet</th>
            </tr>
          </thead>
          <tbody>${transactionRows || "<tr><td colspan='6'>No transactions</td></tr>"}</tbody>
        </table>`
            : ""
        }

        ${
          includeBudget
            ? `
        <h2>Budget Summary (${Month[now.getMonth()]}-${now.getFullYear()})</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Alert %</th>
            </tr>
          </thead>
          <tbody>${budgetRows || "<tr><td colspan='4'>No budget data</td></tr>"}</tbody>
        </table>`
            : ""
        }
      </body>
    </html>
  `;

  try {
    const { uri } = await printToFileAsync({ html, base64: false });

    await Sharing.shareAsync(uri, {
      UTI: ".pdf", // iOS-specific
      mimeType: "application/pdf", // Android-specific
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
