import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { selectTransactions } from "../../../Slice/Selectors";
import { CustomButton } from "../../../Components/CustomButton";
import { useSelector } from "react-redux";
import { getStyles } from "./styles";
import DropdownComponent from "../../../Components/DropDown";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
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

const category = [
  { label: "Salary", value: "Salary" },
  { label: "Passive Income", value: "Passive Income" },
  { label: "Shopping", value: "Shopping" },
  { label: "Food", value: "Food" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Subscription", value: "Subscription" },
  { label: "Transportation", value: "Transportation" },
  { label: "Bills", value: "Bills" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];
const FilterBy = ["Income", "Expense", "Transfer"];
const SortBy = ["Highest", "Lowest", "Newest", "Oldest"];
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import TransactionList from "../Home/TransactionList/TransactionsList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";

type Transactionprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Transactionprop;
}
export default function Transaction({ navigation }: Readonly<Props>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [month, setMonth] = useState(Month[new Date().getMonth()].value);
  const [sortBy, setSortBy] = useState("");
  const [filteritem, setfilteritem] = useState("");
  const [reset, setReset] = useState(true);
  const [count, setcount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const transactions = useSelector(selectTransactions);
  const currentDate = new Date();
  const sortedTransactions = [...transactions]
    .filter((item) => new Date(item.Date) <= currentDate)
    .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
  const { t } = useTranslation();
  const [FilterTrans, setFilterTrans] = useState(transactions);
  useEffect(() => {
    let filteredResult = [...sortedTransactions];
    let appliedCount = 0;
    if (month) {
      filteredResult = filteredResult.filter((item) => {
        const transactionMonth = new Date(item.Date).getMonth();
        return transactionMonth === Month.findIndex((item) => item.value === month);
      });
      if (filteritem) appliedCount++;
      if (selectedCategory) appliedCount++;
      if (sortBy) appliedCount++;
      setcount(appliedCount);
    }
    setFilterTrans(filteredResult);
  }, [month, transactions, filteritem, selectedCategory, sortBy]);
  const handleSort = () => {
    try {
      toggleModal();

      let filteredResult = [...transactions];

      if (month) {
        filteredResult = filteredResult.filter((item) => {
          const transactionMonth = new Date(item.Date).getMonth();
          return transactionMonth === Month.findIndex((item) => item.value === month);
        });
      }

      if (filteritem) {
        filteredResult = filteredResult.filter(
          (item) => item.moneyCategory?.toLowerCase() === filteritem.toLowerCase() && new Date(item.Date) <= new Date()
        );
      }
      if (selectedCategory) {
        filteredResult = filteredResult.filter(
          (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase() && new Date(item.Date) <= new Date()
        );
      }
      if (sortBy) {
        filteredResult.sort((a, b) => {
          const dateA = new Date(a.Date || 0);
          const dateB = new Date(b.Date || 0);
          switch (sortBy) {
            case "Highest":
              return b.amount - a.amount;
            case "Lowest":
              return a.amount - b.amount;
            case "Newest":
              return dateB.getTime() - dateA.getTime();
            case "Oldest":
              return dateA.getTime() - dateB.getTime();
            default:
              return 0;
          }
        });
      }

      setFilterTrans(filteredResult);
    } catch (error) {
      console.error("Sorting failed:", error);
      alert("Sorting failed. Please try again.");
    }
  };
  const containIncome = FilterTrans.some((item) => item.moneyCategory === "Income");
  const containExpense = FilterTrans.some((item) => item.moneyCategory === "Expense");
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.transactionHead}>
        <DropdownComponent
          data={Month}
          value={month}
          name={t(month)}
          styleButton={{
            borderRadius: 20,
            borderWidth: 0.5,
            borderColor: colors.color,
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
        {count > 0 && (
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{count}</Text>
          </View>
        )}
        <TouchableOpacity onPress={toggleModal} style={styles.sortButton}>
          <Ionicons name="filter" size={24} color={colors.color} />
        </TouchableOpacity>
      </View>

      {containIncome && containExpense && month === Month[new Date().getMonth()].label && (
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

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedCategory("");
            setSortBy("");
            setfilteritem("");
            toggleModal();
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.filter}>
                  <Text style={styles.notiTitle}>{t(StringConstants.FilterTransaction)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterTrans(sortedTransactions);
                      setReset(true);
                      setSortBy("");
                      setfilteritem("");
                      setSelectedCategory("");
                      setcount(0);
                      toggleModal();
                    }}
                    style={styles.reset}
                  >
                    <Text style={[styles.homeTitle, { color: "rgb(42, 124, 118)" }]}>{t("Reset")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.FilterOptions}>
                  <View style={{ margin: 10 }}>
                    <Text style={styles.notiTitle}>{t(StringConstants.FilterBy)}</Text>
                    <FlatList
                      numColumns={3}
                      contentContainerStyle={styles.flatListContainer}
                      data={FilterBy}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            if (filteritem === item) setfilteritem("");
                            else setfilteritem(item);
                          }}
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
                  <View style={{ margin: 10 }}>
                    <Text style={styles.notiTitle}>{t(StringConstants.SortBy)}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        paddingTop: 10,
                      }}
                    >
                      {SortBy.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            if (sortBy === item) setSortBy("");
                            else setSortBy(item);
                          }}
                          key={item}
                          style={[
                            styles.filterButton,
                            {
                              backgroundColor: item === sortBy ? "rgba(174, 225, 221, 0.6)" : "white",
                              height: 40,
                              padding: 0,

                              margin: 5,
                            },
                          ]}
                        >
                          <Text style={{ color: item === sortBy ? "rgb(42, 124, 118)" : "black", fontWeight: "bold" }}>
                            {t(item)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={{ margin: 10 }}>
                    <Text style={[styles.notiTitle, { marginBottom: 1 }]}>{t(StringConstants.Category)}</Text>
                    <FlatList
                      data={category}
                      numColumns={3}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      style={{ width: "100%", marginTop: 10 }}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.category,
                            { backgroundColor: item.label === selectedCategory ? "rgba(174, 225, 221, 0.6)" : "white" },
                          ]}
                          onPress={() => {
                            if (selectedCategory === item.label) setSelectedCategory("");
                            else setSelectedCategory(item.label);
                          }}
                        >
                          <Text
                            style={{
                              color: item.label === selectedCategory ? "rgb(42, 124, 118)" : "black",
                              fontWeight: "bold",
                            }}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
                {/* <View style={[styles.FilterOptions, { flex: 0.3 }]}>
                  <Text style={styles.notiTitle}>{t(StringConstants.SortBy)}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      flexWrap: "wrap",
                      paddingTop: 10,
                    }}
                  >
                    {SortBy.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (sortBy === item) setSortBy("");
                          else setSortBy(item);
                        }}
                        key={item}
                        style={[
                          styles.filterButton,
                          {
                            backgroundColor: item === sortBy ? "rgba(174, 225, 221, 0.6)" : "white",
                            height: "32%",
                            padding: 0,

                            margin: 5,
                          },
                        ]}
                      >
                        <Text style={{ color: item === sortBy ? "rgb(42, 124, 118)" : "black", fontWeight: "bold" }}>
                          {t(item)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View> */}
                {/* <View style={styles.FilterCategory}>
                  <Text style={[styles.notiTitle, { marginBottom: 1 }]}>{t(StringConstants.Category)}</Text>
                  <FlatList
                    data={category}
                    numColumns={3}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    style={{ width: "90%", marginTop: 10 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.category,
                          { backgroundColor: item.label === selectedCategory ? "rgba(174, 225, 221, 0.6)" : "white" },
                        ]}
                        onPress={() => {
                          if (selectedCategory === item.label) setSelectedCategory("");
                          else setSelectedCategory(item.label);
                        }}
                      >
                        <Text
                          style={{
                            color: item.label === selectedCategory ? "rgb(42, 124, 118)" : "black",
                            fontWeight: "bold",
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View> */}
                <View style={{ flex: 0.1, width: "100%", alignItems: "center", marginBottom: 20 }}>
                  <CustomButton title={t("Apply")} bg="rgb(42, 124, 118)" color="white" press={handleSort} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View
        style={{
          width: "98%",
          flex: 1,
          alignItems: "center",
          marginBottom: 80,
          justifyContent: "center",
          marginTop: 10,
          marginLeft: 5,
        }}
      >
        {FilterTrans.length === 0 ? (
          <Text style={styles.budgetText}>{t("No record of transactions")}</Text>
        ) : (
          <TransactionList data={FilterTrans} />
        )}
      </View>
    </SafeAreaView>
  );
}
