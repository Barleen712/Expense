import React, { useState, useMemo } from "react";
import { View, Text, Image, Touchable, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../Components/Header";
import styles from "../../../Stylesheet";
import CustomD from "../../../../Components/Practice";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { useSelector } from "react-redux";
import {
  selectIncomeTotal,
  selectExpenseTotal,
  selectExpensesAndTransfers,
  selectIncome,
  CategoryExpense,
} from "../../../../Slice/Selectors";
import { DonutChart } from "./Graph";
import { Linearchart } from "./Graph";
import TransactionList from "../../Home/TransactionsList";
import CategoryList from "./CategoryList";
const CATEGORY_COLORS: Record<string, string> = {
  Food: "rgba(253, 60, 74, 1)",
  Transport: "yellow",
  Shopping: "rgba(252, 172, 18, 1)",
  Entertainment: "#6CCACF",
  Subscription: "rgba(127, 61, 255, 1)",
  Transportation: "yellow",
  Transfer: "rgba(0, 119, 255, 1)",
  Bills: "purple",
  Miscellaneous: "#2A7C6C",
};
const height = Dimensions.get("window").height * 0.22;
const Month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
type financialProp = StackNavigationProp<StackParamList, "FinancialReport">;

interface Props {
  navigation: financialProp;
}

export default function FinancialReport({ navigation }: Props) {
  const [line, showline] = useState(true);
  const [pie, showpie] = useState(false);
  const [Expense, setExpense] = useState(true);
  const [Income, setIncome] = useState(false);
  const income = useSelector(selectIncomeTotal);
  const expense = useSelector(selectExpenseTotal);
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const incomeValues = useSelector(selectIncome);
  const GraphExpenses = useMemo(
    () => expensesAndTransfers.map((expense) => ({ value: expense.amount })),
    [expensesAndTransfers]
  );
  const GraphIncome = useMemo(() => incomeValues.map((income) => ({ value: income.amount })), [incomeValues]);
  GraphExpenses.reverse();
  GraphIncome.reverse();
  const category = useSelector(CategoryExpense);
  const pieData = category.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Financial Report" press={() => navigation.goBack()} />
        <View style={[styles.transactionHead]}>
          <CustomD
            name="Month"
            data={Month}
            styleButton={styles.homeMonth}
            styleItem={styles.dropdownItems}
            styleArrow={styles.homeArrow}
          />
          <TouchableOpacity style={styles.reportGraph}>
            <TouchableOpacity
              onPress={() => {
                showline(true);
                showpie(false);
              }}
              style={[styles.lineGraph, { backgroundColor: line ? "rgba(42, 124, 118, 1)" : "white" }]}
            >
              <Ionicons name="analytics" size={35} color={line ? "white" : "rgba(42, 124, 118, 1)"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.lineGraph, { backgroundColor: pie ? "rgba(42, 124, 118, 1)" : "white" }]}
              onPress={() => {
                showline(false);
                showpie(true);
              }}
            >
              <Fontisto name="pie-chart-1" size={24} color={pie ? "white" : "rgba(42, 124, 118, 1)"} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {line && Expense && (
          <View style={[styles.linechart, { flex: 0.4 }]}>
            <Text style={[styles.typeText, { margin: 5, paddingLeft: 10, color: "black" }]}>{expense}</Text>
            <Linearchart data={GraphExpenses} height={height} />
          </View>
        )}
        {line && Income && (
          <View style={[styles.linechart, { flex: 0.4 }]}>
            <Text style={[styles.typeText, { margin: 5, paddingLeft: 10, color: "black" }]}>{income}</Text>
            <Linearchart data={GraphIncome} height={height} />
          </View>
        )}
        {pie && (
          <View style={[styles.linechart, { flex: 0.4 }]}>
            <DonutChart data={pieData} value={expense} />
          </View>
        )}
        <View style={styles.ExpenseIncomeSelect}>
          <View style={styles.SelectOptions}>
            <TouchableOpacity
              onPress={() => {
                setExpense(true);
                setIncome(false);
              }}
              style={[
                styles.ExpenseSelect,
                { backgroundColor: Expense ? "rgba(42, 124, 118, 1)" : "rgba(220, 234, 233, 0.6)", borderRadius: 35 },
              ]}
            >
              <Text style={[styles.setuptext, { color: Expense ? "white" : "rgba(42, 124, 118, 1)" }]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setExpense(false);
                setIncome(true);
              }}
              style={[
                styles.ExpenseSelect,
                { backgroundColor: Income ? "rgba(42, 124, 118, 1)" : "rgba(220, 234, 233, 0.6)", borderRadius: 35 },
              ]}
            >
              <Text style={[styles.setuptext, { color: Income ? "white" : "rgba(42, 124, 118, 1)" }]}>Income</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0.5, alignItems: "center" }}>
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 10,
              marginTop: 0,
              width: "90%",
            }}
          >
            <CustomD
              name={"Transaction"}
              data={["Transaction", "Category"]}
              styleButton={styles.Trans}
              styleItem={styles.dropdownItems}
              styleArrow={styles.homeArrow}
            />
            <TouchableOpacity>
              <Image
                source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/sort.png")}
                style={styles.sortImage}
              />
            </TouchableOpacity>
          </View>
          {line && Expense && <TransactionList data={expensesAndTransfers} />}
          {line && Income && <TransactionList data={incomeValues} />}
          {pie && <CategoryList />}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
