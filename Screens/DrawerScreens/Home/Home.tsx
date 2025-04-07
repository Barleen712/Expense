import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Platform, Dimensions, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../Stylesheet";
import Months from "../../../Components/Month";
import { LineChart } from "react-native-gifted-charts";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import CustomD from "../../../Components/Practice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTransactions,
  selectExpenseTotal,
  selectIncomeTotal,
  selectExpensesAndTransfers,
} from "../../../Slice/Selectors";
import { categoryMap } from "../../Constants";
import TransactionList from "./TransactionsList";
const Flat = ["Today", "Week", "Month", "Year"];
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

const lineData = [
  { value: 20 },
  { value: 45 },
  { value: 28 },
  { value: 80 },
  { value: 99 },
  { value: 43 },
  { value: 65 },
  { value: 98 },
  { value: 98 },
  { value: 34 },
  { value: 78 },
  { value: 78 },
  { value: 178 },
  { value: 0 },
];
const date = new Date();
const MonthIndex = date.getMonth();
export default function Home({ navigation }) {
  const [month, showmonth] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const transactions = useSelector(selectTransactions);
  const income = useSelector(selectIncomeTotal);
  const expense = useSelector(selectExpenseTotal);
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const Graph = useMemo(
    () => expensesAndTransfers.map((expense) => ({ value: expense.amount })),
    [expensesAndTransfers]
  );
  Graph.reverse();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["rgb(229, 255, 243)", "rgba(205, 230, 200, 0.09)"]} style={styles.homeHeadgradient}>
          <CustomD
            name={Month[MonthIndex]}
            data={Month}
            styleButton={styles.homeMonth}
            styleItem={styles.dropdownItems}
            styleArrow={styles.homeArrow}
          />
          <View style={{ padding: 10 }}>
            <Text style={styles.username}>Account Balance</Text>
            <Text style={styles.heading}>$94500</Text>
          </View>
          <View style={styles.homeHeadView}>
            <View style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}>
              <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Income.png")} />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>Income</Text>
                <Text style={styles.budgetMonthtext}>${income}</Text>
              </View>
            </View>
            <View style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
              <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Expense.png")} />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>Expense</Text>
                <Text style={styles.budgetMonthtext}>${expense}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        {month && (
          <View style={{ position: "absolute", top: Platform.OS === "ios" ? "10.5%" : "9.5%", width: "100%" }}>
            <Months />
          </View>
        )}
        <View style={styles.linechart}>
          <Text style={[styles.notiTitle, { margin: 15 }]}>Spend Frequency</Text>
          <LineChart
            data={Graph}
            width={Dimensions.get("window").width}
            adjustToWidth={true}
            disableScroll
            yAxisLabelWidth={0}
            height={Dimensions.get("window").height * 0.2}
            startFillColor="rgb(78, 144, 114)" // Start gradient color
            endFillColor="white"
            initialSpacing={0}
            endSpacing={0}
            color="rgb(42, 124, 118)"
            thickness={8}
            hideDataPoints
            hideRules
            showVerticalLines={false}
            areaChart
            hideYAxisText
            hideAxesAndRules
            focusEnabled={false}
            curved
          />
        </View>
        <View style={styles.flat}>
          <FlatList
            data={Flat}
            horizontal
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const isSelected = selectedIndex === index;
              return (
                <TouchableOpacity
                  style={[styles.flatView, { backgroundColor: isSelected ? "rgba(220, 234, 233, 0.6)" : "white" }]}
                  onPress={() => setSelectedIndex(index)}
                >
                  <Text
                    style={[styles.itemText, { color: isSelected ? "rgb(42, 124, 118)" : "rgba(145, 145, 159, 1)" }]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          ></FlatList>
        </View>
        <View style={styles.RecentTrans}>
          <View style={styles.filterRecent}>
            <Text style={styles.notiTitle}>Recent Transaction</Text>
            <TouchableOpacity style={styles.reset} onPress={() => navigation.navigate("Transactions")}>
              <Text style={[styles.homeTitle, { color: "rgb(42, 124, 118)" }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <TransactionList data={transactions.slice(0, 5)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
