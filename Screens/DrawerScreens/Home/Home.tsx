import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Platform,
  Dimensions,
  SafeAreaView,
  BackHandler,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomD from "../../../Components/Practice";
import styles from "../../Stylesheet";
import { Month } from "../../Constants";
import { Linearchart } from "../Transaction/FinancialReport/Graph";
import { useSelector } from "react-redux";
import {
  selectExpensesAndTransfers,
  selectTransactions,
  selectIncomeTotal,
  selectExpenseTotal,
} from "../../../Slice/Selectors";
import TransactionList from "./TransactionsList";
export default function Home({ navigation }) {
  const Flat = ["Today", "Week", "Month", "Year"];
  const income = useSelector(selectIncomeTotal);
  const expense = useSelector(selectExpenseTotal);
  const expensesAndTransfers = useSelector(selectExpensesAndTransfers);
  const transactions = useSelector(selectTransactions);
  const GraphExpenses = useMemo(
    () => expensesAndTransfers.map((expense) => ({ value: expense.amount })),
    [expensesAndTransfers]
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  GraphExpenses.reverse();
  const height = Dimensions.get("window").height * 0.2;
  return (
    <SafeAreaView style={[styles.container]}>
      <LinearGradient colors={["rgb(229, 255, 243)", "rgba(205, 230, 200, 0.09)"]} style={styles.homeHeadgradient}>
        <CustomD
          name="Month"
          data={Month}
          styleButton={styles.homeMonth}
          styleItem={styles.dropdownItems}
          styleArrow={styles.homeArrow}
        />
        <View style={{ padding: 8 }}>
          <Text style={styles.username}>Account Balance</Text>
          <Text style={styles.heading}>$94500</Text>
        </View>
        <View style={styles.homeHeadView}>
          <View style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}>
            <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Income.png")} />
            <View style={{ padding: 5 }}>
              <Text style={styles.homeTitle}>Income</Text>
              <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 24, color: "white", fontWeight: "bold" }}>
                ${income}
              </Text>
            </View>
          </View>
          <View style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
            <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Expense.png")} />
            <View style={{ padding: 5 }}>
              <Text style={styles.homeTitle}>Expense</Text>
              <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 24, color: "white", fontWeight: "bold" }}>
                ${expense}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.linechart}>
        <Text style={[styles.notiTitle, { marginLeft: 5, marginTop: Platform.OS === "ios" ? 10 : 15 }]}>
          Spend Frequency
        </Text>
        <Linearchart data={GraphExpenses} height={height} />
      </View>
      <View style={{ flex: 0.4, alignItems: "center" }}>
        <View style={{ width: "100%", height: "13%", alignItems: "center" }}>
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
        <View style={styles.filterRecent}>
          <Text style={styles.notiTitle}>Recent Transaction</Text>
          <TouchableOpacity style={styles.reset} onPress={() => navigation.navigate("Transactions")}>
            <Text style={[styles.homeTitle, { color: "rgb(42, 124, 118)" }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <TransactionList data={transactions.slice(0, 5)} />
      </View>
    </SafeAreaView>
  );
}
