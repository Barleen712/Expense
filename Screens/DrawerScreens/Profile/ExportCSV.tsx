import React from "react";
import { View, Text, Button, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { RootState } from "../../../Store/Store";
import { selectIncomeTotal, selectExpenseTotal, selectTransactions, BudgetCategory } from "../../../Slice/Selectors";
import store from "../../../Store/Store";

export const GenerateCSVReport = async () => {
  const state: RootState = store.getState();
  const transactions = selectTransactions(state);
  const incomeTotal = selectIncomeTotal(state);
  const expenseTotal = selectExpenseTotal(state);
  const budgetData = BudgetCategory(state);
  let csvContent = "Financial Report";
  csvContent += `Total Income :${incomeTotal}\n`;
  csvContent += `Total Expenses:${expenseTotal}\n\n`;

  csvContent += "Transactions:\n";
  csvContent += "Date,Type,Category,Amount,Description,Wallet\n";
  transactions.forEach((t) => {
    const date = new Date(t.Date).toLocaleDateString();
    csvContent += `${date},${t.moneyCategory},${t.category},$${t.amount},${t.description},${t.wallet}\n`;
  });

  csvContent += "\nBudget Summary:\n";
  csvContent += "Category,Budget,Spent,Alert %\n";
  budgetData.forEach((b) => {
    csvContent += `${b.category},$${b.budgetvalue},$${b.amountSpent},${b.alertPercent}%\n`;
  });

  const fileName = `financial_${Date.now()}.csv`;
  const fileUri = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Sharing is not available on this device.");
      return;
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: "Share your CSV report",
    });
  } catch (err) {
    console.error("❌ CSV Generation Error:", err);
    Alert.alert("Error", "Could not generate or share CSV.");
  }
};
