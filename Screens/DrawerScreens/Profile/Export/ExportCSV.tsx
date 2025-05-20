import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { RootState } from "../../../../Store/Store";
import { selectIncomeTotal, selectExpenseTotal, selectTransactions, BudgetCategory } from "../../../../Slice/Selectors";
import { store } from "../../../../Store/Store";

const data = [
  { label: "Income", value: "0" },
  { label: "Expense", value: "1" },
  { label: "Transfer", value: "2" },
  { label: "Budget", value: "3" },
  { label: "All", value: "4" },
];

const date = [
  { label: "Today", value: "0" },
  { label: "Last 7 days", value: "1" },
  { label: "Last 15 days", value: "2" },
  { label: "This Month", value: "3" },
];

export const GenerateCSVReport = async (exportdata: string, dateRange: string) => {
  const state: RootState = store.getState();
  const transactions = selectTransactions(state);
  const incomeTotal = selectIncomeTotal(state);
  const expenseTotal = selectExpenseTotal(state);
  const budgetData = BudgetCategory(state);
  const filterOption = data.find((item) => item.value === exportdata);
  const now = new Date();
  let startDate: Date;
  switch (dateRange) {
    case "0":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "1":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "2":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 15);
      break;
    case "3":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(0);
  }

  const filteredTransactions = transactions.filter((item) => {
    const itemDate = new Date(item.Date);
    const matchCategory = filterOption?.value === "4" || item.moneyCategory === filterOption?.label;
    const matchDate = itemDate >= startDate;
    return matchCategory && matchDate;
  });
  let csvContent = "Financial Report\n";

  if (filterOption?.value !== "3") {
    csvContent += `Total Income: $${incomeTotal}\n`;
    csvContent += `Total Expenses: $${expenseTotal}\n\n`;

    csvContent += "Transactions:\n";
    csvContent += "Date,Type,Category,Amount,Description,Wallet\n";
    filteredTransactions.forEach((t) => {
      const date = new Date(t.Date).toLocaleDateString();
      csvContent += `${date},${t.moneyCategory},${t.category},$${t.amount},${t.description},${t.wallet}\n`;
    });
    csvContent += "\n";
  }

  const includeBudget = filterOption?.value === "3" || filterOption?.value === "4";
  if (includeBudget) {
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonthBudgets = budgetData[currentMonthKey] || [];

    csvContent += "Budget Summary:\n";
    csvContent += "Category,Budget,Spent,Alert %\n";

    currentMonthBudgets.forEach((b) => {
      csvContent += `${b.category},$${b.budgetvalue},$${b.amountSpent},${b.alertPercent}%\n`;
    });
  }

  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  const fileName = `ExpenseTracker_${filterOption?.label}_${month}-${year}.csv`;
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
