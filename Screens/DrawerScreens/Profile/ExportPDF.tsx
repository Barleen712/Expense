import { printToFileAsync } from "expo-print";
import * as Sharing from "expo-sharing";
import { RootState } from "../../../Store/Store";
import { Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

import { selectTransactions, selectExpenseTotal, selectIncomeTotal, BudgetCategory } from "../../../Slice/Selectors";
import store from "../../../Store/Store";

export const generateReportPDF = async () => {
  const state: RootState = store.getState();

  const transactions = selectTransactions(state);
  const incomeTotal = selectIncomeTotal(state);
  const expenseTotal = selectExpenseTotal(state);
  const budgetData = BudgetCategory(state);
  const transactionRows = transactions
    .map((t) => {
      const date = new Date(t.Date).toLocaleDateString();
      return `
      <tr>
        <td>${date}</td>
        <td>${t.moneyCategory}</td>
        <td>${t.category}</td>
        <td>$${t.amount}</td>
        <td>${t.description}</td>
        <td>${t.wallet}</td>
      </tr>
    `;
    })
    .join("");

  const budgetRows = budgetData
    .map(
      (b) => `
    <tr>
      <td>${b.category}</td>
      <td>$${b.budgetvalue}</td>
      <td>$${b.amountSpent}</td>
      <td>${b.alertPercent}%</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <html>
      <head>
        <style>
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
          th { background-color: #f2f2f2; }
          h2 { color: rgb(42, 124, 118); font-family: Arial, sans-serif;}
          
        </style>
      </head>
      <body>
        <h2>Income & Expense Report</h2>
        <p><strong>Total Income:</strong> $${incomeTotal}</p>
        <p><strong>Total Expenses:</strong> $${expenseTotal}</p>
        
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
          <tbody>${transactionRows}</tbody>
        </table>

        <h2>Budget Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Alert %</th>
            </tr>
          </thead>
          <tbody>${budgetRows}</tbody>
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await printToFileAsync({ html, base64: false });

    await Sharing.shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });

    if (Platform.OS === "android") {
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: uri,
        flags: 1,
        type: "application/pdf",
      });
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
