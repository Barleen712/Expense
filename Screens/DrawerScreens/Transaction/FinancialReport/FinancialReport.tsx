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
import DropdownComponent from "../../../../Components/DropDown";
import { currencies, StringConstants } from "../../../Constants";
import {
  selectIncomeTotal,
  selectExpenseTotal,
  selectExpensesAndTransfers,
  selectIncome,
  CategoryExpense,
  CategoryIncome,
  selectTransactions,
} from "../../../../Slice/Selectors";
import { DonutChart } from "./Graph";
import { Linearchart } from "./Graph";
import TransactionList from "../../Home/TransactionsList";
import CategoryList from "./CategoryList";
import { CATEGORY_COLORS } from "../../../Constants";
const height = Dimensions.get("window").height * 0.22;

type financialProp = StackNavigationProp<StackParamList, "FinancialReport">;

interface Props {
  navigation: financialProp;
}
const Month = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

export default function FinancialReport({ navigation }: Props) {
  const [line, showline] = useState(true);
  const [pie, showpie] = useState(false);
  const [Expense, setExpense] = useState(true);
  const [Income, setIncome] = useState(false);
  const [month, setMonth] = useState(Month[new Date().getMonth()].value);
  const income = useSelector(selectIncomeTotal);
  const expense = useSelector(selectExpenseTotal);
  const transaction = useSelector(selectTransactions);
  const incomeValues = useSelector(selectIncome);
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const sortedIncome = [...incomeValues]
    .sort((a, b) => {
      return new Date(b.Date) - new Date(a.Date);
    })
    .filter((item) => Month[new Date(item.Date).getMonth()].value === month);
  const sortedExpense = [...expensesAndTransfers]
    .sort((a, b) => {
      return new Date(b.Date) - new Date(a.Date);
    })
    .filter((item) => Month[new Date(item.Date).getMonth()].value === month);
  const sortedTrans = [...transaction].filter((item) => Month[new Date(item.Date).getMonth()].value === month);
  const GraphExpenses = useMemo(
    () =>
      sortedTrans
        .filter(
          (item) =>
            item.moneyCategory === "Expense" ||
            (item.moneyCategory === "Transfer" && Month[new Date(item.Date).getMonth()].value === month)
        )
        .sort((a, b) => {
          return new Date(a.Date) - new Date(b.Date);
        })
        .map((expense) => ({ value: expense.amount, date: expense.Date })),
    [sortedTrans]
  );
  const GraphIncome = useMemo(
    () =>
      sortedTrans
        .filter((item) => item.moneyCategory === "Income" && Month[new Date(item.Date).getMonth()].value === month)
        .sort((a, b) => {
          return new Date(a.Date) - new Date(b.Date);
        })
        .map((income) => ({ value: income.amount, date: income.Date })),
    [sortedTrans]
  );
  const categoryExpense = useSelector(CategoryExpense);
  const monthIndex = Month.findIndex((item) => item.value === month);
  const selectedMonthKey = `${new Date().getFullYear()}-${String(monthIndex + 1).padStart(2, "0")}`;

  const CategorytDataForMonthExpense = categoryExpense[selectedMonthKey] || [];

  const pieDataExpense = CategorytDataForMonthExpense.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  const categoryIncome = useSelector(CategoryIncome);
  const CategorytDataForMonthIncome = categoryIncome[selectedMonthKey] || [];
  const pieDataIncome = CategorytDataForMonthIncome.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  const { t } = useTranslation();
  const Rates = useSelector((state) => state.Rates);
  const currency = Rates.selectedCurrencyCode;
  const convertRate = Rates.Rate[currency];

  return (
    <View style={styles.container}>
      <Header
        title={t(StringConstants.FinancialReport)}
        press={() => {
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
        }}
      />
      <View style={[styles.transactionHead]}>
        {/* <CustomD
          name={t(month)}
          data={Month}
          styleButton={styles.homeMonth}
          styleItem={styles.dropdownItems}
          styleArrow={styles.homeArrow}
          onSelectItem={(item) => setMonth(item)}
        /> */}
        <DropdownComponent
          data={Month}
          value={month}
          name={t(month)}
          styleButton={{
            borderRadius: 20,
            borderWidth: 0.3,
            borderColor: "grey",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            height: "60%",

            marginTop: 10,
            alignSelf: "flex-start",
            width: "38%",
          }}
          styleItem={styles.dropdownItems}
          onSelectItem={(item) => {
            setMonth(item);
          }}
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
          <Text style={{ margin: 5, paddingLeft: 10, color: "black", fontSize: 32, fontWeight: "bold" }}>
            {currencies[currency]}
            {(expense * convertRate).toFixed(2)}
          </Text>
          <Linearchart data={GraphExpenses} height={height} />
        </View>
      )}
      {line && Income && (
        <View style={[styles.linechart, { flex: 0.4 }]}>
          <Text style={{ margin: 5, paddingLeft: 10, color: "black", fontSize: 32, fontWeight: "bold" }}>
            {currencies[currency]} {(income * convertRate).toFixed(2)}
          </Text>
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
        {line && Expense && (
          <View style={{ flex: 1 }}>
            {sortedExpense.length === 0 && (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.budgetText}>No expense transaction occured</Text>
              </View>
            )}
            <TransactionList data={sortedExpense} />
          </View>
        )}
        {line && Income && (
          <View style={{ flex: 1 }}>
            {sortedIncome.length === 0 && (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.budgetText}>No income transaction occured.</Text>
              </View>
            )}
            <TransactionList data={sortedIncome} />
          </View>
        )}
        {pie && Expense && (
          <>
            {CategorytDataForMonthExpense.length > 0 ? (
              <CategoryList category={CategorytDataForMonthExpense} totalExpense={expense} />
            ) : (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.budgetText}>No expense transaction occurred.</Text>
              </View>
            )}
          </>
        )}

        {pie && Income && (
          <>
            {CategorytDataForMonthIncome.length > 0 ? (
              <CategoryList category={CategorytDataForMonthIncome} totalExpense={income} />
            ) : (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.budgetText}>No income transaction occurred.</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
