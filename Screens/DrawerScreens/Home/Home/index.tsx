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
import { selectTransactions, selectMonthlyExpenseTotals, selectMonthlyIncomeTotals } from "../../../../Slice/Selectors";
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
import Expense from "../../../../assets/ExpenseHome.svg";
import Income from "../../../../assets/IncomeHome.svg";
import { retrieveOldTransactions } from "../../../../Realm/realm";
import { loadTransactionsFromRealm } from "../../../../Realm/realm";
import { useDispatch } from "react-redux";
export default function Home({ navigation }: Props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Money.signup);
  const lang = [
    { name: "Arabic", code: "AR", tc: "ar" },
    { name: "Chinese", code: "ZH", tc: "zh" },
    { name: "English", code: "EN", tc: "en" },
    { name: "Italian", code: "IT", tc: "it" },
    { name: "Spanish", code: "ES", tc: "es" },
    { name: "Hindi", code: "HI", tc: "hi" },
  ];
  async function getData() {
    if (typeof user?.Photo.uri === "number") {
      setPhoto(profilepics[user?.Index]);
    } else {
      setPhoto(user?.Photo);
    }
    if (user?.Photo.uri === null) {
      setPhoto(require("../../../../assets/user.png"));
    }
  }
  useEffect(() => {
    getData();
    // retrieveOldTransactions();
  }, [navigation]);
  const index = new Date().getMonth();
  useTransactionListener();
  useBudgetListener();
  useNotificationListener();
  const language = useSelector((state) => state.Money.preferences.language);
  const currency = useSelector((state) => state.Money.preferences.currency);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [photo, setPhoto] = useState("");
  const height = Dimensions.get("window").height * 0.2;
  const { t } = useTranslation();
  const Flat = ["Today", "Week", "Month", "Year"];
  const Rates = useSelector((state: RootState) => state.Rates);
  const [selectedMonth_Year, setSelectionMonth_Year] = useState(new Date());
  const [show, setShow] = useState(false);
  const today = new Date(selectedMonth_Year);
  let convertRate;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
  const transaction = useSelector(selectTransactions);
  const currentDate = new Date();
  const monthlyincome = useSelector(selectMonthlyIncomeTotals);
  const monthlyexpense = useSelector(selectMonthlyExpenseTotals);
  const selectedKey = `${selectedMonth_Year.getFullYear()}-${String(selectedMonth_Year.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const income = monthlyincome[selectedKey] || 0;
  const expense = monthlyexpense[selectedKey] || 0;
  const filteredAndSortedTransactions = [...transaction]
    .filter((item) => new Date(item.Date) <= currentDate)
    .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  const { colors } = useContext(ThemeContext);
  const badgeCount = useSelector((state) => state.Money.badgeCount);
  const GraphExpenses = useMemo(() => {
    const expense = transaction.filter(
      (item) =>
        (item.moneyCategory === "Expense" || item.moneyCategory === "Transfer") && new Date(item.Date) <= new Date()
    );
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
              itemDate.getDate() === new Date().getDate() &&
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getFullYear() === today.getFullYear()
            );
          })
        );

      case "Week": {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(new Date().getDate() - 6);
        return mapToAmountAndDate(
          expense.filter((item) => {
            const itemDate = new Date(item.Date);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate >= sevenDaysAgo && itemDate <= new Date() && itemDate.getMonth() === today.getMonth();
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
  }, [filteredAndSortedTransactions, selectedIndex, selectedMonth_Year]);
  const langindex = lang.find((item) => item.name === language);
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
          backgroundColor: colors.backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
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
              {t(Month[new Date(selectedMonth_Year).getMonth()])} {new Date(selectedMonth_Year).getFullYear()}
            </Text>
            <Image style={styles.homeArrow} source={require("../../../../assets/arrowDown.png")} />
          </TouchableOpacity>
          {show && (
            <MonthPicker
              onChange={onValueChange}
              value={selectedMonth_Year}
              minimumDate={new Date(2020, 1)}
              maximumDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
              locale={langindex?.tc}
              mode="short"
            />
          )}
          <View style={{ padding: 8, alignItems: "center" }}>
            <Text style={styles.username}>{t(StringConstants.AccountBalance)}</Text>
            <Text style={styles.heading}>
              {currencies[currency]}
              {((94500 + income - expense) * convertRate).toFixed(2)}
            </Text>
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
                  url: "",
                  frequency: "",
                  endDate: new Date().toISOString(),
                  endAfter: "",
                  repeat: false,
                  startDate: new Date().getDate(),
                  startMonth: new Date().getMonth(),
                  weekly: "",
                })
              }
              style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}
            >
              <Income />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>{t(StringConstants.Income)}</Text>
                <Text
                  style={{
                    fontSize: Platform.OS === "ios" ? 21 : 18,
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
                  url: "",
                  frequency: "",
                  endDate: new Date().toISOString(),
                  endAfter: "",
                  repeat: false,
                  startDate: new Date().getDate(),
                  startMonth: new Date().getMonth(),
                  weekly: "",
                })
              }
              style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}
            >
              <Expense />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>{t(StringConstants.Expense)}</Text>
                <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 18, color: "white", fontWeight: "bold" }}>
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
          {filteredAndSortedTransactions.length === 0 ? (
            <View
              style={{
                flex: 0.6,
                justifyContent: "center",
                alignItems: "center",
                width: "90%",
                // backgroundColor: "pink",
              }}
            >
              <Text style={styles.budgetText}>
                {t("Start tracking your finances by making your first transaction.")}
              </Text>
            </View>
          ) : (
            <View style={{ width: "90%", flex: 1 }}>
              <TransactionList data={filteredAndSortedTransactions.slice(0, 5)} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
