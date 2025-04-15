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
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../../Constants";
import {
  selectIncomeTotal,
  selectExpenseTotal,
  selectExpensesAndTransfers,
  selectIncome,
  CategoryExpense,
  CategoryIncome,
} from "../../../../Slice/Selectors";
import { DonutChart } from "./Graph";
import { Linearchart } from "./Graph";
import TransactionList from "../../Home/TransactionsList";
import CategoryList from "./CategoryList";
import { CATEGORY_COLORS } from "../../../Constants";
import { Month } from "../../../Constants";
const height = Dimensions.get("window").height * 0.22;

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
    () =>
      expensesAndTransfers
        .slice()
        .reverse()
        .map((expense) => ({ value: expense.amount })),
    [expensesAndTransfers]
  );
  const GraphIncome = useMemo(
    () =>
      incomeValues
        .slice()
        .reverse()
        .map((income) => ({ value: income.amount })),
    [incomeValues]
  );

  const categoryExpense = useSelector(CategoryExpense);
  const pieDataExpense = categoryExpense.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  const categoryIncome = useSelector(CategoryIncome);
  const pieDataIncome = categoryIncome.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t(StringConstants.FinancialReport)} press={() => navigation.goBack()} />
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
      {pie && Expense && (
        <View style={[styles.linechart, { flex: 0.4 }]}>
          <DonutChart data={pieDataExpense} value={expense} />
        </View>
      )}
      {pie && Income && (
        <View style={[styles.linechart, { flex: 0.4 }]}>
          <DonutChart data={pieDataIncome} value={income} />
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
            <Text style={[styles.setuptext, { color: Expense ? "white" : "rgba(42, 124, 118, 1)" }]}>
              {t(StringConstants.Expense)}
            </Text>
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
            <Text style={[styles.setuptext, { color: Income ? "white" : "rgba(42, 124, 118, 1)" }]}>
              {t(StringConstants.Income)}
            </Text>
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
        {pie && Expense && <CategoryList category={categoryExpense} />}
        {pie && Income && <CategoryList category={categoryIncome} />}
      </View>
    </View>
  );
}
