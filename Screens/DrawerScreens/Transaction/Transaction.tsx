import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Touchable,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { selectTransactions } from "../../../Slice/Selectors";
import CustomD from "../../../Components/Practice";
import { CustomButton } from "../../../Components/CustomButton";
import { useSelector } from "react-redux";
import styles from "../../Stylesheet";
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
const data = [
  "Salary",
  "Passive Income",
  "Shopping",
  "Food",
  "Entertainment",
  "Subscription",
  "Transportation",
  "Bills",
  "Miscellaneous",
];
const FilterBy = ["Income", "Expense", "Transfer"];
const SortBy = ["Highest", "Lowest", "Newest", "Oldest"];
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import TransactionList from "../Home/TransactionsList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../FirebaseConfig";
import { query, collection, where, onSnapshot } from "firebase/firestore";

type Transactionprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Transactionprop;
}
export default function Transaction({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [month, setMonth] = useState(Month[new Date().getMonth()]);
  const [sortBy, setSortBy] = useState("");
  const [filteritem, setFilter] = useState("");
  const [reset, setReset] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const transactions = useSelector(selectTransactions);
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.Date) - new Date(a.Date);
  });
  const { t } = useTranslation();
  const containIncome = sortedTransactions.some((item) => item.moneyCategory === "Income");
  const containExpense = sortedTransactions.some((item) => item.moneyCategory === "Expense");
  const [FilterTrans, setFilterTrans] = useState(transactions);
  useEffect(() => {
    setFilterTrans(sortedTransactions);
  }, [transactions]);
  const handleSort = () => {
    try {
      toggleModal();

      const normalizedFilter = filteritem?.toLowerCase() || "";
      const normalizedCategory = selectedCategory?.toLowerCase() || "";

      const filteredResult = transactions.filter((item) => {
        if (!item.moneyCategory || !item.category) return false;

        return (
          item.moneyCategory.toLowerCase() === normalizedFilter && item.category.toLowerCase() === normalizedCategory
        );
      });

      const sorted = [...filteredResult].sort((a, b) => {
        const dateA = new Date(a.Date || 0);
        const dateB = new Date(b.Date || 0);

        switch (sortBy) {
          case "Highest":
            return b.amount - a.amount;
          case "Lowest":
            return a.amount - b.amount;
          case "Newest":
            return dateB - dateA;
          case "Oldest":
            return dateA - dateB;
          default:
            return 0;
        }
      });
      setFilterTrans(sorted);
    } catch (error) {
      console.error("Sorting failed:", error);

      alert("Sorting failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.transactionHead}>
        <CustomD
          name={t(month)}
          data={Month}
          styleButton={styles.homeMonth}
          styleItem={styles.dropdownItems}
          styleArrow={styles.homeArrow}
          onSelectItem={(item) => setMonth(item)}
        />
        <TouchableOpacity onPress={toggleModal}>
          <Image source={require("../../../assets/sort.png")} style={styles.sortImage} />
        </TouchableOpacity>
      </View>
      {containIncome && containExpense && (
        <View style={styles.reportView}>
          <TouchableOpacity
            style={styles.financialReport}
            onPress={() => navigation.navigate("FinancialReportExpense")}
          >
            <Text style={styles.reportText}>{t(StringConstants.Seeyourfinancialreport)}</Text>
            <Image style={styles.arrows} source={require("../../../assets/arrow.png")} />
          </TouchableOpacity>
        </View>
      )}
      {/* <View style={styles.reportView}>
        <TouchableOpacity style={styles.financialReport} onPress={() => navigation.navigate("FinancialReportExpense")}>
          <Text style={styles.reportText}>{t(StringConstants.Seeyourfinancialreport)}</Text>
          <Image style={styles.arrows} source={require("../../../assets/arrow.png")} />
        </TouchableOpacity>
      </View> */}
      {transactions.length === 0 && (
        <View style={{ flex: 0.75, justifyContent: "center", alignItems: "center", marginTop: 200 }}>
          <Text style={styles.budgetText}>
            You have not made any transaction.{"\n"}
            {t(StringConstants.Letmake)}.
          </Text>
        </View>
      )}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { height: "65%" }]}>
              <View style={styles.filter}>
                <Text style={styles.notiTitle}>{t(StringConstants.FilterTransaction)}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setFilterTrans(sortedTransactions);
                    setReset(true);
                    setSortBy("");
                    setFilter("");
                    setSelectedCategory("");
                    toggleModal();
                  }}
                  style={styles.reset}
                >
                  <Text style={[styles.homeTitle, { color: "rgb(42, 124, 118)" }]}>{t("Reset")}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.FilterOptions}>
                <Text style={styles.notiTitle}>{t(StringConstants.FilterBy)}</Text>
                <FlatList
                  numColumns={3}
                  contentContainerStyle={styles.flatListContainer}
                  data={FilterBy}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setFilter(item)}
                      style={[
                        styles.filterButton,
                        { backgroundColor: item === filteritem ? "rgba(174, 225, 221, 0.6)" : "white" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          { color: item === filteritem ? "rgb(42, 124, 118)" : "black" },
                        ]}
                      >
                        {t(item)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={[styles.FilterOptions, { flex: 0.35 }]}>
                <Text style={styles.notiTitle}>{t(StringConstants.SortBy)}</Text>
                <FlatList
                  numColumns={3}
                  contentContainerStyle={styles.flatListContainer}
                  data={SortBy}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => setSortBy(item)}
                        style={[
                          styles.filterButton,
                          { backgroundColor: item === sortBy ? "rgba(174, 225, 221, 0.6)" : "white" },
                        ]}
                      >
                        <Text
                          style={[styles.filterButtonText, { color: item === sortBy ? "rgb(42, 124, 118)" : "black" }]}
                        >
                          {t(item)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <View style={styles.FilterCategory}>
                <Text style={styles.notiTitle}>{t(StringConstants.Category)}</Text>
                <CustomD
                  name={t(StringConstants.ChooseCategory)}
                  data={data}
                  styleButton={styles.settingsOptions}
                  styleText={styles.settingtitle}
                  styleItem={styles.dropdownItems}
                  styleArrow={{ position: "absolute", right: "1%" }}
                  onReset={reset}
                  onSelectItem={(item) => setSelectedCategory(item)}
                />
                {/* // <TouchableOpacity style={[styles.settingsOptions, { marginTop: 20 }]}>
                //   <Text style={styles.settingtitle}>{t(StringConstants.ChooseCategory)}</Text>
                //   <Image style={{ position: "absolute", right: "1%" }} source={require("../../../assets/arrow.png")} />
                // </TouchableOpacity> */}
                <View style={styles.Apply}>
                  <CustomButton title={t("Apply")} bg="rgb(42, 124, 118)" color="white" press={handleSort} />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={{ width: "100%", flex: 0.75, alignItems: "center" }}>
        <TransactionList data={FilterTrans} />
      </View>
    </View>
  );
}
