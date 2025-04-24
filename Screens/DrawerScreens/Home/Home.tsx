import React, { useMemo, useState, useTransition } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Platform,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomD from "../../../Components/Practice";
import styles from "../../Stylesheet";
import { Month } from "../../Constants";
import { Linearchart } from "../Transaction/FinancialReport/Graph";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { selectTransactions, selectIncomeTotal, selectExpenseTotal } from "../../../Slice/Selectors";
import TransactionList from "./TransactionsList";
import { StringConstants, currencies } from "../../Constants";
import { useTranslation } from "react-i18next";
import useTransactionListener from "../../../Saga/TransactionSaga";
import useBudgetListener from "../../../Saga/BudgetSaga";
import useNotificationListener from "../../../Saga/NotificationSaga";

export default function Home({ navigation }) {
  const index = new Date().getMonth();
  useTransactionListener();
  useBudgetListener();
  useNotificationListener();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [month, selectMonth] = useState(Month[index]);
  const height = Dimensions.get("window").height * 0.2;
  const { t } = useTranslation();
  const Flat = ["Today", "Week", "Month", "Year"];
  const Rates = useSelector((state) => state.Rates);
  const currency = Rates.selectedCurrencyCode;
  let convertRate;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
  const transaction = useSelector(selectTransactions);
  const sortedTransactions = [...transaction].sort((a, b) => {
    return new Date(b.Date) - new Date(a.Date);
  });
  const income = useSelector(selectIncomeTotal);
  const expense = useSelector(selectExpenseTotal);
  const GraphExpenses = useMemo(
    () =>
      transaction
        .filter((item) => item.moneyCategory === "Expense" || item.moneyCategory === "Transfer")
        .sort((a, b) => {
          return new Date(a.Date) - new Date(b.Date);
        })
        .map((expense) => ({ value: expense.amount })),
    [transaction]
  );
  const loading = useSelector((state: RootState) => state.Money.loading);
  if (loading)
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <SafeAreaView style={[styles.container]}>
        <LinearGradient colors={["rgb(229, 255, 243)", "rgba(205, 230, 200, 0.09)"]} style={styles.homeHeadgradient}>
          <TouchableOpacity
            onPress={() => navigation.navigate("DisplayNotification")}
            style={{ position: "absolute", right: "4%", top: "5%" }}
          >
            <Ionicons name="notifications" size={24} color="rgb(56, 88, 85)" />
          </TouchableOpacity>
          <TouchableOpacity style={{ position: "absolute", left: "4%", top: "3%" }}>
            <Image style={{ height: 30, width: 30 }} source={require("../../../assets/Avatar.png")} />
          </TouchableOpacity>
          <CustomD
            name={t(month)}
            data={Month}
            styleButton={styles.homeMonth}
            styleItem={styles.dropdownItems}
            styleArrow={styles.homeArrow}
            onSelectItem={(item) => selectMonth(item)}
          />
          <View style={{ padding: 8 }}>
            <Text style={styles.username}>{t(StringConstants.AccountBalance)}</Text>
            <Text style={styles.heading}>$94500</Text>
          </View>
          <View style={styles.homeHeadView}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Income", {
                  amount: 0,
                  category: "Category",
                  edit: false,
                  title: "",
                  wallet: "Wallet",
                })
              }
              style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}
            >
              <Image style={{ height: 40, width: 40 }} source={require("../../../assets/Income.png")} />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>{t(StringConstants.Income)}</Text>
                <Text
                  style={{
                    fontSize: Platform.OS === "ios" ? 21 : 22,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {currencies[currency]}
                  {(income * convertRate).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Expense", {
                  amount: 0,
                  category: "Category",
                  edit: false,
                  title: "",
                  wallet: "Wallet",
                })
              }
              style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}
            >
              <Image style={{ height: 40, width: 40 }} source={require("../../../assets/Expense.png")} />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>{t(StringConstants.Expense)}</Text>
                <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 22, color: "white", fontWeight: "bold" }}>
                  {currencies[currency]}
                  {(expense * convertRate).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.linechart}>
          <Text style={[styles.notiTitle, { marginLeft: 5, marginTop: Platform.OS === "ios" ? 10 : 15 }]}>
            {t(StringConstants.SpendFrequency)}
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
                      {t(item)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
          </View>
          <View style={styles.filterRecent}>
            <Text style={styles.notiTitle}>{t(StringConstants.RecentTransaction)}</Text>
            <TouchableOpacity style={styles.reset} onPress={() => navigation.navigate("Transactions")}>
              <Text style={[styles.homeTitle, { color: "rgb(42, 124, 118)" }]}>{t(StringConstants.SeeAll)}</Text>
            </TouchableOpacity>
          </View>
          {/* <TransactionList data={sortedTransactions.slice(0,3)}/> */}
          <View style={{ width: "90%", flex: 1 }}>
            <TransactionList data={sortedTransactions.slice(0, 5)} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
