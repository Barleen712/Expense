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
} from "react-native";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import CustomD from "../../../Components/Practice";
import styles from "../../Stylesheet";
import { Month } from "../../Constants";
import { Linearchart } from "../Transaction/FinancialReport/Graph";
import { useSelector } from "react-redux";
import { db, auth } from "../../FirebaseConfig";
import {
  selectExpensesAndTransfers,
  selectTransactions,
  selectIncomeTotal,
  selectExpenseTotal,
} from "../../../Slice/Selectors";
import TransactionList from "./TransactionsList";
import { StringConstants, currencies } from "../../Constants";
import { useTranslation } from "react-i18next";
export default function Home({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const height = Dimensions.get("window").height * 0.2;
  const { t } = useTranslation();
  const Flat = ["Today", "Week", "Month", "Year"];
  const Rates = useSelector((state) => state.Rates);
  console.log(Rates);
  const currency = Rates.selectedCurrencyCode;
  let convertRate;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
  const [transactions, setTransactions] = useState([]);
  const totalIncome = useMemo(() => {
    return transactions
      .filter((item) => item.moneyCategory === "Income")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions]);
  const totalExpense = useMemo(() => {
    return transactions
      .filter((item) => item.moneyCategory === "Expense")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "Transactions"), where("userId", "==", user.uid));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data)
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions: ", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.Date) - new Date(a.Date);
  });
  const GraphExpenses = useMemo(
    () =>
      transactions
        .filter((item) => item.moneyCategory === "Expense" || item.moneyCategory === "Transfer")
        .sort((a, b) => {
          return new Date(a.Date) - new Date(b.Date);
        })
        .map((expense) => ({ value: expense.amount })),
    [transactions]
  );
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
          <Text style={styles.username}>{t(StringConstants.AccountBalance)}</Text>
          <Text style={styles.heading}>$94500</Text>
        </View>
        <View style={styles.homeHeadView}>
          <View style={[styles.headButton, { backgroundColor: "rgba(0, 168, 107, 1)" }]}>
            <Image source={require("../../../assets/Income.png")} />
            <View style={{ padding: 5 }}>
              <Text style={styles.homeTitle}>{t(StringConstants.Income)}</Text>
              <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 24, color: "white", fontWeight: "bold" }}>
                {currencies[currency]}
                {(totalIncome * convertRate).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={[styles.headButton, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
            <Image source={require("../../../assets/Expense.png")} />
            <View style={{ padding: 5 }}>
              <Text style={styles.homeTitle}>{t(StringConstants.Expense)}</Text>
              <Text style={{ fontSize: Platform.OS === "ios" ? 21 : 24, color: "white", fontWeight: "bold" }}>
                {currencies[currency]}
                {(totalExpense * convertRate).toFixed(2)}
              </Text>
            </View>
          </View>
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
        <TransactionList data={sortedTransactions.slice(0, 5)} />
      </View>
    </SafeAreaView>
  );
}
