// Cleaned-up Home.tsx
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
import { Linearchart } from "../../Transaction/FinancialReport/Graph";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { selectTransactions, selectMonthlyExpenseTotals, selectMonthlyIncomeTotals } from "../../../../Slice/Selectors";
import TransactionList from "../TransactionList/TransactionsList";
import { StringConstants, currencies, profilepics, Month, checkApplicationPermission } from "../../../Constants";
import { useTranslation } from "react-i18next";
import useTransactionListener from "../../../../Saga/TransactionSaga";
import useBudgetListener from "../../../../Saga/BudgetSaga";
import useNotificationListener from "../../../../Saga/NotificationSaga";
import { RootState } from "../../../../Store/Store";
import MonthPicker from "react-native-month-year-picker";
import { Props } from "./types";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { getStyles } from "./styles";
import Expense from "../../../../assets/ExpenseHome.svg";
import Income from "../../../../assets/IncomeHome.svg";
import CameraGreen from "../../../../assets/CameraGreen.svg";
import ImageGreen from "../../../../assets/ImageGreen.svg";
import DocumentGreen from "../../../../assets/DocumentGreen.svg";
import CameraRed from "../../../../assets/CameraRed.svg";
import ImageRed from "../../../../assets/ImageRed.svg";
import DocumentRed from "../../../../assets/DocumentRed.svg";

export default function Home({ navigation }: Readonly<Props>) {
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  const user = useSelector((state: RootState) => state.Money.signup);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const language = useSelector((state: RootState) => state.Money.preferences.language);
  const transaction = useSelector(selectTransactions);
  const monthlyincome: { [key: string]: number } = useSelector(selectMonthlyIncomeTotals);
  const monthlyexpense: { [key: string]: number } = useSelector(selectMonthlyExpenseTotals);
  const Rates = useSelector((state: RootState) => state.Rates);
  const badgeCount = useSelector((state: RootState) => state.Money.badgeCount);
  const loading = useSelector((state: RootState) => state.Money.loading);
  const [selectedMonth_Year, setselectedMonth_Year] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState<string | { uri: string } | number>("");
  const today = new Date(selectedMonth_Year);
  const langList = [
    { name: "Arabic", tc: "ar" },
    { name: "Chinese", tc: "zh" },
    { name: "English", tc: "en" },
    { name: "Italian", tc: "it" },
    { name: "Spanish", tc: "es" },
    { name: "Hindi", tc: "hi" },
  ];
  const langindex = langList.find((item) => item.name === language);
  const convertRate = currency === "USD" ? 1 : Rates.Rate[currency];
  const height = Dimensions.get("window").height * 0.2;
  const Flat = ["Today", "Week", "Month", "Year"];
  const selectedKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const income = monthlyincome[selectedKey] || 0;
  const expense = monthlyexpense[selectedKey] || 0;
  const accountBalance = (94500 + income - expense) * convertRate;

  useEffect(() => {
    checkApplicationPermission();
    if (typeof user?.Photo.uri === "number") {
      setPhoto(user.index != null ? profilepics[user.index] : require("../../../../assets/user.png"));
    } else if (!user?.Photo?.uri) {
      setPhoto(require("../../../../assets/user.png"));
    } else {
      setPhoto(user.Photo);
    }
  }, [navigation, user]);

  useTransactionListener();
  useBudgetListener();
  useNotificationListener();

  const filteredAndSortedTransactions = useMemo(
    () =>
      [...transaction]
        .filter((item) => new Date(item.Date) <= new Date())
        .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()),
    [transaction]
  );

  const GraphExpenses = useMemo(() => {
    const expenses = transaction.filter(
      (item) =>
        (item.moneyCategory === "Expense" || item.moneyCategory === "Transfer") && new Date(item.Date) <= new Date()
    );

    const mapToAmountAndDate = (items: any[]) =>
      items
        .map((item) => ({ value: item.amount, date: new Date(item.Date) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const filterBy = Flat[selectedIndex];

    switch (filterBy) {
      case "Today":
        return mapToAmountAndDate(
          expenses.filter((item) => {
            return (
              new Date(item.Date).getDate() === new Date().getDate() &&
              new Date(item.Date).getMonth() === new Date(selectedMonth_Year).getMonth() &&
              new Date(item.Date).getFullYear() === new Date(selectedMonth_Year).getFullYear()
            );
          })
        );
      case "Week": {
        const selectedMonth = selectedMonth_Year.getMonth();
        const selectedYear = selectedMonth_Year.getFullYear();
        const todayDate = new Date().getDate();

        let endDate = new Date(selectedYear, selectedMonth, todayDate);
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        if (todayDate > daysInMonth) {
          endDate = new Date(selectedYear, selectedMonth, daysInMonth);
        }

        const now = new Date();
        endDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        return mapToAmountAndDate(
          expenses.filter((item) => {
            const d = new Date(item.Date);
            return d >= startDate && d <= endDate;
          })
        );
      }

      case "Month":
        return mapToAmountAndDate(
          expenses.filter((item) => {
            const d = new Date(item.Date);
            return (
              d.getMonth() === new Date(selectedMonth_Year).getMonth() &&
              d.getFullYear() === new Date(selectedMonth_Year).getFullYear()
            );
          })
        );
      case "Year":
        return mapToAmountAndDate(
          expenses.filter((item) => new Date(item.Date).getFullYear() === new Date(selectedMonth_Year).getFullYear())
        );
      default:
        return [];
    }
  }, [transaction, selectedIndex, selectedMonth_Year]);

  const onValueChange = (event: string, newDate?: Date) => {
    if (Platform.OS === "android") {
      if (event === "dateSetAction" && newDate) setselectedMonth_Year(newDate);
      setShow(false);
    } else if (newDate) setselectedMonth_Year(newDate);
  };

  const openTransaction = (moneyCategory: "Income" | "Expense") => {
    const isIncome = moneyCategory === "Income";
    navigation.navigate("Transaction", {
      amount: 0,
      category: "Category",
      categoryData: isIncome
        ? [
            { value: "Salary", label: "Salary" },
            { value: "Passive Income", label: "Passive Income" },
          ]
        : [
            { label: "Shopping", value: "Shopping" },
            { label: "Food", value: "Food" },
            { label: "Entertainment", value: "Entertainment" },
            { label: "Subscription", value: "Subscription" },
            { label: "Transportation", value: "Transportation" },
            { label: "Bills", value: "Bills" },
            { label: "Miscellaneous", value: "Miscellaneous" },
          ],
      modal: isIncome ? [CameraGreen, ImageGreen, DocumentGreen] : [CameraRed, ImageRed, DocumentRed],
      edit: false,
      title: "",
      wallet: "Wallet",
      url: "",
      frequency: "",
      endDate: new Date().toISOString(),
      endAfter: "",
      repeat: false,
      startDate: today.getDate(),
      startMonth: today.getMonth(),
      weekly: today.getDay().toString(),
      type: "",
      bg: isIncome ? "rgba(0, 168, 107, 1)" : "rgb(255, 0, 17)",
      moneyCategory,
    });
  };

  if (loading) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.backgroundColor }}
      >
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="black" barStyle="default" />
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={colors.LinearGradient as [string, string, ...string[]]} style={styles.homeHeadgradient}>
          {badgeCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{badgeCount}</Text>
            </View>
          )}
          <TouchableOpacity
            style={{ position: "absolute", right: "6%", top: "8%" }}
            onPress={() => navigation.navigate("DisplayNotification")}
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
              {t(Month[today.getMonth()])} {today.getFullYear()}
            </Text>
            <Image style={styles.homeArrow} source={require("../../../../assets/arrowDown.png")} />
          </TouchableOpacity>
          {show && (
            <MonthPicker
              onChange={onValueChange}
              value={selectedMonth_Year}
              minimumDate={new Date(2020, 1)}
              maximumDate={new Date()}
              locale={langindex?.tc}
              mode="short"
            />
          )}
          <View style={{ padding: 8, alignItems: "center" }}>
            <Text style={styles.username}>{t(StringConstants.AccountBalance)}</Text>
            <Text style={styles.heading}>
              {currencies[currency]}
              {accountBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.homeHeadView}>
            <TouchableOpacity
              style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}
              onPress={() => openTransaction("Income")}
            >
              <Income />
              <View style={{ padding: 5 }}>
                <Text style={styles.homeTitle}>{t(StringConstants.Income)}</Text>
                <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 18, color: "white", fontWeight: "bold" }}>
                  {currencies[currency]}
                  {(income * convertRate).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}
              onPress={() => openTransaction("Expense")}
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
            />
          </View>

          <View style={styles.filterRecent}>
            <Text style={styles.notiTitle}>{t(StringConstants.RecentTransaction)}</Text>
            <TouchableOpacity style={styles.reset} onPress={() => navigation.navigate("Transactions")}>
              <Text style={[styles.homeTitle, { color: "rgb(42, 124, 118)" }]}>{t(StringConstants.SeeAll)}</Text>
            </TouchableOpacity>
          </View>

          {filteredAndSortedTransactions.length === 0 ? (
            <View style={{ flex: 0.6, justifyContent: "center", alignItems: "center", width: "90%" }}>
              <Text style={styles.budgetText}>
                {t("Start tracking your finances by making your first transaction.")}
              </Text>
            </View>
          ) : (
            <View style={{ width: "98%", flex: 1, alignItems: "center", justifyContent: "center" }}>
              <TransactionList data={filteredAndSortedTransactions.slice(0, 5)} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
