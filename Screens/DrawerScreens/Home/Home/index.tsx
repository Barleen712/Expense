import React, { useEffect, useMemo, useState, useContext } from "react";
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
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Month } from "../../../Constants";
import { Linearchart } from "../../Transaction/FinancialReport/Graph";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { selectTransactions, selectIncomeTotal, selectExpenseTotal } from "../../../../Slice/Selectors";
import TransactionList from "../TransactionList/TransactionsList";
import { StringConstants, currencies, profilepics } from "../../../Constants";
import { useTranslation } from "react-i18next";
import useTransactionListener from "../../../../Saga/TransactionSaga";
import useBudgetListener from "../../../../Saga/BudgetSaga";
import useNotificationListener from "../../../../Saga/NotificationSaga";
import { getUseNamerDocument } from "../../../../Saga/BudgetSaga";
import { RootState } from "../../../../Store/Store";
import MonthPicker from "react-native-month-year-picker";
import { Props } from "./types";
import { ThemeContext } from "../../../../Context/ThemeContext";
import { getStyles } from "./styles";

export default function Home({ navigation }: Props) {
  async function getData() {
    const user = await getUseNamerDocument();
    if (typeof user?.Photo.uri === "number") {
      setPhoto(profilepics[user?.Index]);
    } else {
      setPhoto(user?.Photo);
    }
    if (!user?.Photo) {
      setPhoto(profilepics[1]);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  const index = new Date().getMonth();
  useTransactionListener();
  useBudgetListener();
  useNotificationListener();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [photo, setPhoto] = useState("");
  const height = Dimensions.get("window").height * 0.2;
  const { t } = useTranslation();
  const Flat = ["Today", "Week", "Month", "Year"];
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = Rates.selectedCurrencyCode;
  const [selectedMonth_Year, setSelectionMonth_Year] = useState(new Date());
  const [show, setShow] = useState(false);
  const today = new Date();
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
  const badgeCount = useSelector((state) => state.Money.badgeCount);
  const GraphExpenses = useMemo(() => {
    const expense = transaction.filter((item) => item.moneyCategory === "Expense" || item.moneyCategory === "Transfer");

    const mapToAmountAndDate = (items) =>
      items
        .map((item) => ({
          value: item.amount,
          date: new Date(item.Date),
        }))
        .sort((a, b) => a.date - b.date);

    switch (Flat[selectedIndex ?? 0]) {
      case "Today":
        return mapToAmountAndDate(
          expense.filter((item) => {
            const itemDate = new Date(item.Date);
            return (
              itemDate.getDate() === today.getDate() &&
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getFullYear() === today.getFullYear()
            );
          })
        );

      case "Week": {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        return mapToAmountAndDate(
          expense.filter((item) => {
            const itemDate = new Date(item.Date);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate >= sevenDaysAgo && itemDate <= today;
          })
        );
      }

      case "Month":
        return mapToAmountAndDate(
          expense.filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
          })
        );

      case "Year":
        return mapToAmountAndDate(
          expense.filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate.getFullYear() === today.getFullYear();
          })
        );

      default:
        return [];
    }
  }, [transaction, selectedIndex]);

  const loading = useSelector((state: RootState) => state.Money.loading);
  const onValueChange = (event: string, newDate?: Date) => {
    const isAndroid = Platform.OS === "android";

    if (isAndroid) {
      if (event === "dateSetAction" && newDate) {
        setSelectionMonth_Year(newDate);
      }
      setShow(false);
    } else if (newDate) {
      setSelectionMonth_Year(newDate);
    }
  };
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
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <SafeAreaView style={[styles.container]}>
        <LinearGradient colors={colors.LinearGradient} style={styles.homeHeadgradient}>
          {badgeCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{badgeCount}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("DisplayNotification")}
            style={{ position: "absolute", right: "6%", top: "8%" }}
          >
            <Ionicons name="notifications" size={28} color={colors.textcolor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: "absolute", left: "4%", top: "8%" }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image style={{ height: 30, width: 30, borderRadius: 50, borderWidth: 1 }} source={photo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeMonth} onPress={() => setShow(true)}>
            <Text style={styles.MonthText}>
              {Month[new Date(selectedMonth_Year).getMonth()]} {new Date(selectedMonth_Year).getFullYear()}
            </Text>
            <Image style={styles.homeArrow} source={require("../../../../assets/arrowDown.png")} />
          </TouchableOpacity>
          {show && (
            <MonthPicker
              onChange={onValueChange}
              value={selectedMonth_Year}
              minimumDate={new Date(2020, 1)}
              maximumDate={new Date()}
              locale="en"
            />
          )}
          <View style={{ padding: 8 }}>
            <Text style={styles.username}>{t(StringConstants.AccountBalance)}</Text>
            <Text style={styles.heading}>${94500 + income - expense}</Text>
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
              <Image style={{ height: 40, width: 40 }} source={require("../../../../assets/Income.png")} />
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
              <Image style={{ height: 40, width: 40 }} source={require("../../../../assets/Expense.png")} />
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
          <Text style={styles.notiTitle}>{t(StringConstants.SpendFrequency)}</Text>
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
          {sortedTransactions.length === 0 ? (
            <View
              style={{
                flex: 0.6,
                justifyContent: "center",
                alignItems: "center",
                width: "90%",
                // backgroundColor: "pink",
              }}
            >
              <Text style={styles.budgetText}>Start tracking your finances by making your first transaction.</Text>
            </View>
          ) : (
            <View style={{ width: "90%", flex: 1 }}>
              <TransactionList data={sortedTransactions.slice(0, 5)} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
