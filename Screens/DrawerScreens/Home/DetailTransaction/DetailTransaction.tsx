import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from "react-native";
import { getStyles } from "./styles";
import Header from "../../../../Components/Header";
import { CustomButton } from "../../../../Components/CustomButton";
import { getRealm, markPendingDeleteOrDelete } from "../../../../Realm/realm";
import { deleteTransaction } from "../../../../Slice/IncomeSlice";
import { useSelector, useDispatch } from "react-redux";
import CustomModal from "../../../../Components/Modal/Modal";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { StringConstants, currencies, Month, Weeks } from "../../../Constants";
import { ThemeContext } from "../../../../Context/ThemeContext";
import { RootState } from "../../../../Store/Store";
interface DetailTransactionProps {
  navigation: any;
  bg: string;
  color: string;
  amount: string;
  title?: string;
  time: string;
  type: string;
  category: string;
  wallet: string;
  uri: string;
  id: string;
  des?: string;
}
function DetailTransaction({
  navigation,
  bg,
  color,
  amount,
  title,
  time,
  type,
  category,
  wallet,
  des,
  uri,
  id,
  frequency,
  endAfter,
  endDate,
  repeat,
  startDate,
  startMonth,
  weekly,
}: DetailTransactionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, showImage] = useState(false);
  const [succes, setsuccess] = useState(false);
  const dispatch = useDispatch();
  function toggleSuccess() {
    setsuccess(!succes);
  }
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  async function deleteTransactions() {
    dispatch(deleteTransaction(id));
    const realm = await getRealm();
    await markPendingDeleteOrDelete(realm, id);
  }
  const { t } = useTranslation();
  const Rates = useSelector((state: RootState) => state.Rates);
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const convertRate = Rates.Rate[currency];
  function EditTransaction() {
    if (type === "Income") {
      navigation.navigate("Income", {
        amount,
        title,
        category,
        wallet,
        edit: true,
        id,
        url: uri,
        frequency,
        endAfter,
        endDate,
        repeat,
        startDate,
        startMonth,
        weekly,
      });
    } else if (type === "Expense") {
      navigation.navigate("Expense", {
        amount,
        title,
        category,
        wallet,
        edit: true,
        id,
        url: uri,
        frequency,
        endAfter,
        endDate,
        repeat,
        startDate,
        startMonth,
        weekly,
      });
    } else {
      navigation.navigate("Transfer", { amount, to: category, from: type, title: title, edit: true, id, url: uri });
    }
  }
  const DisplayDate = new Date(time);
  const year = DisplayDate.getFullYear();
  const indexMnonth = DisplayDate.getMonth();
  const indexDay = DisplayDate.getDay();
  const day = Weeks[indexDay];
  const month = Month[indexMnonth];
  const getDate = DisplayDate.getDate() + 1;
  const getHours = DisplayDate.getHours();
  const getMinute = DisplayDate.getMinutes();
  const DisplayTime = `${day} ${getDate} ${month} ${year} ${getHours}:${getMinute}`;
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  const [imageError, setimageError] = useState(false);
  return (
    <View style={styles.container}>
      <Header title={t("Detail Transaction")} press={() => navigation.goBack()} bgcolor={bg} color="white" />
      <View style={[styles.DetailHead, { backgroundColor: bg }]}>
        <Text style={[styles.number, { fontWeight: "bold" }]}>
          {currencies[currency]}
          {(amount * convertRate).toFixed(2)}
        </Text>
        <Text style={[styles.MonthText, { fontSize: 12 }]}>{DisplayTime}</Text>
      </View>
      <View style={styles.TypeContainer}>
        <View style={styles.type}>
          <Text style={styles.typeHead}>{t("Type")}</Text>
          <Text style={styles.Export1text}>{t(type)}</Text>
        </View>
        <View style={styles.type}>
          <Text style={styles.typeHead}>{t("Category")}</Text>
          <Text style={styles.Export1text}>{t(category)}</Text>
        </View>
        <View style={styles.type}>
          <Text style={[styles.typeHead]}>{t("Wallet")}</Text>
          <Text style={styles.Export1text}>{t(wallet)}</Text>
        </View>
      </View>
      <View style={styles.dashedline}>
        <Image source={require("../../../../assets/Line 3.png")} />
      </View>
      <View style={styles.Description}>
        <Text style={styles.username}>{t("Description")}</Text>
        <ScrollView>
          <Text style={[styles.exportText, { paddingLeft: 0 }]}>{title}</Text>
        </ScrollView>
      </View>
      <View style={styles.attachView}>
        {uri && (
          <View>
            <Text style={styles.username}>{t("Attachment")}</Text>

            {imageError ? (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  height: "80%",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "gray" }}>Network Error</Text>
                <Text style={{ color: "gray" }}>🚫 No Internet Connection .</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => showImage(true)}>
                <FastImage style={styles.attachImg} source={{ uri }} onError={() => setimageError(true)} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={[styles.Apply, { flex: 0.1 }]}>
        <CustomButton title={t("Edit")} bg={bg} color="white" press={EditTransaction} />
      </View>
      <TouchableOpacity style={styles.Trash} onPress={toggleModal}>
        <Image source={require("../../../../assets/trash.png")} />
      </TouchableOpacity>
      <CustomModal
        visible={modalVisible}
        setVisible={() => setModalVisible(!modalVisible)}
        color={colors.nobutton}
        bg={bg}
        head={t(StringConstants.Removethistransaction)}
        text={t(StringConstants.Areyousure)}
        onsuccess={t(StringConstants.Transactionhasbeensuccessfully)}
        navigation={navigation}
        deleteT={deleteTransactions}
      />
      <Modal animationType="slide" transparent={true} visible={image} onRequestClose={() => showImage(false)}>
        <TouchableWithoutFeedback onPress={() => showImage(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: "rgba(24, 13, 13, 0.89)" }]}>
            <View style={{ height: "100%", position: "absolute", bottom: 0, width: "100%" }}>
              <FastImage style={{ height: "100%" }} resizeMode="contain" source={{ uri }} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default function DetailTransaction_Expense({ navigation, route }) {
  const { value } = route.params;
  return (
    <DetailTransaction
      navigation={navigation}
      bg="rgba(253, 60, 74, 1)"
      color="rgba(205, 153, 141, 0.13)"
      amount={value.amount}
      time={value.Date}
      type="Expense"
      category={value.category}
      wallet={value.wallet}
      id={value._id}
      title={value.description}
      uri={value.url}
      frequency={value.Frequency}
      endAfter={value.endAfter}
      endDate={value.endDate}
      repeat={value.repeat}
      startDate={value.startDate}
      startMonth={value.startMonth}
      weekly={value.weekly}
    />
  );
}
export function DetailTransaction_Income({ navigation, route }) {
  const { value } = route.params;
  return (
    <DetailTransaction
      navigation={navigation}
      bg="rgba(0, 168, 107, 1)"
      color="rgba(173, 210, 189, 0.6)"
      amount={value.amount}
      title={value.description}
      time={value.Date}
      type="Income"
      category={value.category}
      wallet={value.wallet}
      id={value._id}
      uri={value.url}
      frequency={value.Frequency}
      endAfter={value.endAfter}
      endDate={value.endDate}
      repeat={value.repeat}
      startDate={value.startDate}
      startMonth={value.startMonth}
      weekly={value.weekly}
    />
  );
}
export function DetailTransaction_Transfer({ navigation, route }) {
  const { value } = route.params;
  const arrow = value.category.indexOf("->");
  const From = value.category.slice(0, arrow);
  const To = value.category.slice(arrow + 3, value.category.length - 1);
  return (
    <DetailTransaction
      navigation={navigation}
      bg="rgba(0, 119, 255, 1)"
      color="rgba(115, 116, 119, 0.14)"
      amount={value.amount}
      time={value.Date}
      type={From}
      category={To}
      wallet="Transfer"
      title={value.description}
      id={value._id}
      uri={value.url}
    />
  );
}
