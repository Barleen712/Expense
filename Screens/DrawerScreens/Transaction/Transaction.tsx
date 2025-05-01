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
import { selectTransactions } from "../../../Slice/Selectors";
import CustomD from "../../../Components/Practice";
import { CustomButton } from "../../../Components/CustomButton";
import { useSelector } from "react-redux";
import styles from "../../Stylesheet";
import DropdownComponent from "../../../Components/DropDown";
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
import TransactionList from "../Home/TransactionsList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";

type Transactionprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Transactionprop;
}
export default function Transaction({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [month, setMonth] = useState(Month[new Date().getMonth()].value);
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
  const [FilterTrans, setFilterTrans] = useState(transactions);
  useEffect(() => {
    let filteredResult = [...sortedTransactions];

    if (month) {
      filteredResult = filteredResult.filter((item) => {
        const transactionMonth = new Date(item.Date).getMonth();
        return transactionMonth === Month.findIndex((item) => item.value === month);
      });
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
          (item) => item.moneyCategory?.toLowerCase() === filteritem.toLowerCase()
        );
      }
      if (selectedCategory) {
        filteredResult = filteredResult.filter(
          (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
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
              return dateB - dateA;
            case "Oldest":
              return dateA - dateB;
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
  return (
    <View style={styles.container}>
      <View style={styles.transactionHead}>
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
          styleItem={styles.dropdownItems}
          onSelectItem={(item) => {
            setMonth(item);
          }}
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
                      onPress={() => {
                        if (filteritem === item) setFilter("");
                        else setFilter(item);
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
              <View style={[styles.FilterOptions, { flex: 0.35 }]}>
                <Text style={styles.notiTitle}>{t(StringConstants.SortBy)}</Text>
                <FlatList
                  numColumns={3}
                  contentContainerStyle={styles.flatListContainer}
                  data={SortBy}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (sortBy === item) setSortBy("");
                          else setSortBy(item);
                        }}
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

                <DropdownComponent
                  data={category}
                  value={selectedCategory}
                  name={t(StringConstants.ChooseCategory)}
                  styleButton={styles.settingsOptions}
                  onSelectItem={(item) => {
                    setSelectedCategory(item);
                  }}
                />
                <View style={styles.Apply}>
                  <CustomButton title={t("Apply")} bg="rgb(42, 124, 118)" color="white" press={handleSort} />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View
        style={{
          width: "100%",
          flex: 1,
          alignItems: "center",
          marginBottom: 80,
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {FilterTrans.length === 0 ? (
          <Text style={styles.budgetText}>No record of transactions</Text>
        ) : (
          <TransactionList data={FilterTrans} />
        )}
      </View>
    </View>
  );
}
