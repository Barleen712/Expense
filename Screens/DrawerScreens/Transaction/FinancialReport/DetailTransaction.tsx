import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import styles from "../../../Stylesheet";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../../Components/Header";
import { CustomButton } from "../../../../Components/CustomButton";
import { selectTransactions } from "../../../../Slice/Selectors";
import { deleteTransaction } from "../../../../Slice/IncomeSlice";
import { useSelector, useDispatch } from "react-redux";
import CustomModal from "../../Budget/Modal";
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
  des: string;
  keyVal: string;
  uri: string;
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
  keyVal,
  uri,
}: DetailTransactionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [succes, setsuccess] = useState(false);
  const dispatch = useDispatch();
  function toggleSuccess() {
    setsuccess(!succes);
  }
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  function deleteTransactions() {
    dispatch(deleteTransaction({ keyVal }));
  }
  return (
    <View style={styles.container}>
      <Header title="Detail Transaction" press={() => navigation.goBack()} bgcolor={bg} color="white" />
      <View style={[styles.DetailHead, { backgroundColor: bg }]}>
        <Text style={[styles.number, { fontWeight: "bold" }]}>${amount}</Text>
        {title && <Text style={[styles.notiTitle, { color: "white" }]}>{title}</Text>}
        <Text style={[styles.MonthText, { fontSize: 12 }]}>{time}</Text>
      </View>
      <View style={styles.TypeContainer}>
        <View style={styles.type}>
          <Text style={styles.typeHead}>Type</Text>
          <Text style={styles.Export1text}>{type}</Text>
        </View>
        <View style={styles.type}>
          <Text style={styles.typeHead}>Category</Text>
          <Text style={styles.Export1text}>{category}</Text>
        </View>
        <View style={styles.type}>
          <Text style={[styles.typeHead]}>Wallet</Text>
          <Text style={styles.Export1text}>{wallet}</Text>
        </View>
      </View>
      <View style={styles.dashedline}>
        <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Line 3.png")} />
      </View>
      <View style={styles.Description}>
        <Text style={styles.username}>Description</Text>
        <Text style={[styles.exportText, { paddingLeft: 0 }]}>{des}</Text>
      </View>
      <View style={styles.attachView}>
        <Text style={styles.username}>Attachment</Text>
        <Image style={styles.attachImg} source={{ uri: uri }} onError={() => console.log("Failed to load image")} />
      </View>
      <View style={[styles.Apply, { flex: 0.1 }]}>
        <CustomButton title="Edit" bg={color} color={bg} />
      </View>
      <TouchableOpacity style={styles.Trash} onPress={toggleModal}>
        <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/trash.png")} />
      </TouchableOpacity>
      <CustomModal
        visible={modalVisible}
        setVisible={() => setModalVisible(!modalVisible)}
        color={color}
        bg={bg}
        head="Remove this transaction"
        text="Are you sure you want to remove this transaction?"
        onsuccess="Transaction has been removed successfully"
        navigation={navigation}
        deleteT={deleteTransactions}
      />
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
      title={value.description}
      time="Saturday 4 June 2021 16:20"
      type="Expense"
      category={value.category}
      wallet={value.wallet}
      des="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
            velit mollit. Exercitation veniam consequat sunt nostrud amet."
      keyVal={value.key}
      uri={value.attachment.uri}
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
      time="Saturday 4 June 2021 16:20"
      type="Income"
      category={value.category}
      wallet={value.wallet}
      des="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
            velit mollit. Exercitation veniam consequat sunt nostrud amet."
      keyVal={value.key}
      uri={value.attachment.uri}
    />
  );
}
export function DetailTransaction_Transfer({ navigation, route }) {
  const { value } = route.params;
  return (
    <DetailTransaction
      navigation={navigation}
      bg="rgba(0, 119, 255, 1)"
      color="rgba(115, 116, 119, 0.14)"
      amount={value.amount}
      time="Saturday 4 June 2021 16:20"
      type="Transfer"
      category="PayPal"
      wallet="Chase"
      des="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
            velit mollit. Exercitation veniam consequat sunt nostrud amet."
      keyVal={value.key}
      uri={value.attachment.uri}
    />
  );
}
