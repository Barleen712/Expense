import React, { useState, useMemo, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, Dimensions, BackHandler } from "react-native";
import Header from "../../../../Components/Header";
import { getStyles } from "./styles";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DropdownComponent from "../../../../Components/DropDown";
import { currencies, StringConstants, CATEGORY_COLORS } from "../../../Constants";
import {
  selectExpensesAndTransfers,
  selectIncome,
  CategoryExpense,
  CategoryIncome,
  selectTransactions,
  selectMonthlyIncomeTotals,
  selectMonthlyExpenseTotals,
} from "../../../../Slice/Selectors";
import { DonutChart, Linearchart } from "./Graph";
import TransactionList from "../../Home/TransactionList/TransactionsList";
import CategoryList from "./CategoryList";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "../../../../Store/Store";
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

export default function FinancialReport({ navigation }: Readonly<Props>) {
  const [line, setline] = useState(true);
  const [pie, setpie] = useState(false);
  const [Expense, setExpense] = useState(true);
  const [Income, setIncome] = useState(false);
  const [month, setMonth] = useState(Month[new Date().getMonth()].value);
  const monthIndex = Month.findIndex((item) => item.value === month);
  const monthKey = `${new Date().getFullYear()}-${String(monthIndex + 1).padStart(2, "0")}`;
  const incomes = useSelector(selectMonthlyIncomeTotals) as { [key: string]: number };
  const income = incomes[monthKey] || 0;
  const expenses = useSelector(selectMonthlyExpenseTotals) as { [key: string]: number };
  const expense = expenses[monthKey] || 0;
  const transaction = useSelector(selectTransactions);
  const incomeValues = useSelector(selectIncome);
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const sortedIncome = [...incomeValues]
    .sort((a, b) => {
      return new Date(b.Date).getTime() - new Date(a.Date).getTime();
    })
    .filter((item) => Month[new Date(item.Date).getMonth()].value === month && new Date(item.Date) <= new Date());
  const sortedExpense = [...expensesAndTransfers]
    .sort((a, b) => {
      return new Date(b.Date).getTime() - new Date(a.Date).getTime();
    })
    .filter((item) => Month[new Date(item.Date).getMonth()].value === month && new Date(item.Date) <= new Date());
  const sortedTrans = [...transaction].filter(
    (item) => Month[new Date(item.Date).getMonth()].value === month && new Date(item.Date) <= new Date()
  );
  const GraphExpenses = useMemo(
    () =>
      sortedTrans
        .filter(
          (item) =>
            item.moneyCategory === "Expense" ||
            (item.moneyCategory === "Transfer" && Month[new Date(item.Date).getMonth()].value === month)
        )
        .sort((a, b) => {
          return new Date(a.Date).getTime() - new Date(b.Date).getTime();
        })
        .map((expense) => ({ value: expense.amount, date: expense.Date })),
    [sortedTrans]
  );
  const GraphIncome = useMemo(
    () =>
      sortedTrans
        .filter((item) => item.moneyCategory === "Income" && Month[new Date(item.Date).getMonth()].value === month)
        .sort((a, b) => {
          return new Date(a.Date).getTime() - new Date(b.Date).getTime();
        })
        .map((income) => ({ value: income.amount, date: income.Date })),
    [sortedTrans]
  );
  const categoryExpense = useSelector(CategoryExpense);

  const CategorytDataForMonthExpense = categoryExpense[monthKey] || [];
  const pieDataExpense = CategorytDataForMonthExpense.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  const categoryIncome = useSelector(CategoryIncome);

  const CategorytDataForMonthIncome = categoryIncome[monthKey] || [];
  const pieDataIncome = CategorytDataForMonthIncome.map((item) => ({
    percentage: item.total,
    color: CATEGORY_COLORS[item.category],
  }));
  const { t } = useTranslation();
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );
  return (
    <View style={styles.container}>
      <Header
        title={t(StringConstants.FinancialReport)}
        press={() => {
          navigation.popToTop();
        }}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={[styles.transactionHead]}>
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
          onSelectItem={(item) => {
            setMonth(item);
          }}
        />
        <TouchableOpacity style={styles.reportGraph}>
          <TouchableOpacity
            onPress={() => {
              setline(true);
              setpie(false);
            }}
            style={[styles.lineGraph, { backgroundColor: line ? "rgba(42, 124, 118, 1)" : colors.backgroundColor }]}
          >
            <Ionicons name="analytics" size={35} color={line ? "white" : "rgba(42, 124, 118, 1)"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.lineGraph, { backgroundColor: pie ? "rgba(42, 124, 118, 1)" : colors.backgroundColor }]}
            onPress={() => {
              setline(false);
              setpie(true);
            }}
          >
            <Fontisto name="pie-chart-1" size={24} color={pie ? "white" : "rgba(42, 124, 118, 1)"} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      {line && Expense && (
        <View style={[styles.linechart, { flex: 0.4 }]}>
          <Text style={{ margin: 5, paddingLeft: 10, color: colors.color, fontSize: 32, fontWeight: "bold" }}>
            {currencies[currency]}
            {(expense * convertRate).toFixed(2)}
          </Text>
          <Linearchart data={GraphExpenses} height={height} />
        </View>
      )}
      {line && Income && (
        <View style={[styles.linechart, { flex: 0.4 }]}>
          <Text style={{ margin: 5, paddingLeft: 10, color: colors.color, fontSize: 32, fontWeight: "bold" }}>
            {currencies[currency]}
            {(income * convertRate).toFixed(2)}
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
