import React, { useState } from "react";
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
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const transactions = useSelector(selectTransactions);
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.transactionHead}>
        <CustomD
          name="Month"
          data={Month}
          styleButton={styles.homeMonth}
          styleItem={styles.dropdownItems}
          styleArrow={styles.homeArrow}
        />
        <TouchableOpacity onPress={toggleModal}>
          <Image source={require("../../../assets/sort.png")} style={styles.sortImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.reportView}>
        <TouchableOpacity style={styles.financialReport} onPress={() => navigation.navigate("FinancialReportExpense")}>
          <Text style={styles.reportText}>{t(StringConstants.Seeyourfinancialreport)}</Text>
          <Image style={styles.arrows} source={require("../../../assets/arrow.png")} />
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { height: "65%" }]}>
              <View style={styles.filter}>
                <Text style={styles.notiTitle}>{t(StringConstants.FilterTransaction)}</Text>
                <TouchableOpacity style={styles.reset}>
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
                    <TouchableOpacity style={styles.filterButton}>
                      <Text style={styles.filterButtonText}>{t(item)}</Text>
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
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.filterButton}>
                      <Text style={styles.filterButtonText}>{t(item)}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={styles.FilterCategory}>
                <Text style={styles.notiTitle}>{t(StringConstants.Category)}</Text>
                <TouchableOpacity style={[styles.settingsOptions, { marginTop: 20 }]}>
                  <Text style={styles.settingtitle}>{t(StringConstants.ChooseCategory)}</Text>
                  <Image style={{ position: "absolute", right: "1%" }} source={require("../../../assets/arrow.png")} />
                </TouchableOpacity>
                <View style={styles.Apply}>
                  <CustomButton title={t("Apply")} bg="rgb(42, 124, 118)" color="white" />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={{ width: "100%", flex: 0.75, alignItems: "center" }}>
        <TransactionList data={transactions} />
      </View>
    </View>
  );
}
