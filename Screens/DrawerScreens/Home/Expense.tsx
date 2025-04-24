import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Switch,
  ImageBackground,
  Modal,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  ScrollView,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import { AddNotification, updateBudgetDocument, updateDocument } from "../../FirestoreHandler";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../Components/CustomTextInput";
import CustomD from "../../../Components/Practice";
import SelectImageWithDocumentPicker from "./Attachment";
import { useDispatch, useSelector } from "react-redux";

import { uploadImage } from "../../Constants";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../Constants";
import { updateBudget, updateTransaction } from "../../../Slice/IncomeSlice";
import { AddTransaction } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
import { BudgetCategory } from "../../../Slice/Selectors";
import { onDisplayNotification } from "../Budget/TestNotification";
type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}
const category = ["Shopping", "Food", "Entertainment", "Subscription", "Transportation", "Bills", "Miscellaneous"];
const wallet = ["PayPal", "Google Pay", "Paytm", "PhonePe", "Apple Pay"];
const modal = [
  require("../../../assets/CameraRed.png"),
  require("../../../assets/ImageRed.png"),
  require("../../../assets/DocumentRed.png"),
];
export default function Expense({ navigation, route }: Props) {
  const budget = useSelector(BudgetCategory);
  const exceeded = useSelector((state) => state.Money.exceedNotification);
  const expenseAlert = useSelector((state) => state.Money.expenseAlert);
  const parameters = route.params;
  const [Expense, setExpense] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Expenses, setExpenses] = useState<string>(`$${parameters.amount}`);
  const [selectedCategory, setSelectedCategory] = useState(`${parameters.category}`);
  const [selectedWallet, setSelectedWallet] = useState(`${parameters.wallet}`);
  const [Description, setDescription] = useState(`${parameters.title}`);
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const openDocument = async () => {
    if (!document) return;

    if (Platform.OS === "ios" || (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(document);
    } else {
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: document,
        flags: 1,
      });
    }
  };
  const handleExpenseChange = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    setExpenses(`$${numericValue}`);
  };
  const handleFocus = () => {
    if (Expenses === "" || Expenses === "$0" || Expenses === "$") {
      setExpenses("$");
    }
  };
  const dispatch = useDispatch();
  const user = auth.currentUser;
  async function add() {
    const numericExpense = parseFloat(Expenses.replace("$", "") || "0");
    let supabaseImageUrl = null;
    if (numericExpense === 0) {
      alert("Add amount");
      return;
    }
    if (selectedCategory === "Category") {
      alert("Select Category");
      return;
    }
    if (Description === "") {
      alert("Add Description");
      return;
    }
    if (selectedWallet === "Wallet") {
      alert("Select Wallet");
      return;
    }
    if (image) {
      supabaseImageUrl = await uploadImage(image);
    }
    // dispatch(
    //   addTransaction({
    //     amount: numericExpense,
    //     description: Description,
    //     category: selectedCategory,
    //     wallet: selectedWallet,
    //     moneyCategory: "Expense",
    //     attachment: {
    //       type: "image",
    //       uri: supabaseImageUrl,
    //     },
    //   })
    // );
    AddTransaction({
      amount: numericExpense,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      moneyCategory: "Expense",
      Date: new Date().toISOString(),
      userId: user.uid,
      attachment: {
        type: "image",
        uri: supabaseImageUrl,
      },
    });
    const Budget = budget.some((item) => item.category === selectedCategory);
    if (Budget) {
      const Budget = budget.find((item) => item.category === selectedCategory);
      if (
        Budget.amountSpent + numericExpense >= (Budget.alertPercent / 100) * Budget.budgetvalue &&
        Budget.notification === true &&
        Budget.notified === false
      ) {
        updateBudgetDocument("Budgets", Budget.id, {
          amount: Budget.budgetvalue,
          category: Budget.category,
          notification: Budget.notification,
          percentage: Budget.alertPercent,
          notified: true,
        });
        dispatch(
          updateBudget({
            amount: Budget.budgetvalue,
            category: Budget.category,
            notification: Budget.notification,
            percentage: Budget.alertPercent,
            notified: true,
            id: Budget.id,
          })
        );
        onDisplayNotification({
          title: `${selectedCategory} budget has exceeded the percentage`,
          body: `Your ${selectedCategory} budget has exceeded the limit i.e ${Budget.alertPercent}%`,
        });
        AddNotification({
          title: `${selectedCategory} budget has exceeded the percentage`,
          body: `Your ${selectedCategory} budget has exceeded the limit i.e ${Budget.alertPercent}%`,
          date: new Date().toISOString(),
          userId: user.uid,
        });
      }
      if (Budget) {
        const Budget = budget.find((item) => item.category === selectedCategory);
        if (Budget.amountSpent + numericExpense >= Budget.budgetvalue && exceeded === true) {
          onDisplayNotification({
            title: `${selectedCategory} budget has exceeded the limit`,
            body: `Your ${selectedCategory} budget has exceeded the limit i.e 100%`,
          });
          AddNotification({
            title: `${selectedCategory} budget has exceeded the limit`,
            body: `Your ${selectedCategory} budget has exceeded the limit i.e 100%`,
            date: new Date().toISOString(),
            userId: user.uid,
          });
        }
      }
      if (expenseAlert) {
        onDisplayNotification({
          title: `Added Expense`,
          body: `You added an expense of ${selectedCategory} of amount ${Expenses}`,
        });
        AddNotification({
          title: `Added Expense`,
          body: `You added an expense of ${selectedCategory} of amount ${Expenses}`,
          date: new Date().toISOString(),
          userId: user.uid,
        });
      }
    }
    navigation.goBack();
  }

  const { t } = useTranslation();
  function editExpense() {
    const numericExpense = parseFloat(Expenses.replace("$", "") || "0");
    dispatch(
      updateTransaction({
        amount: numericExpense,
        description: Description,
        category: selectedCategory,
        wallet: selectedWallet,
        id: parameters.id,
        moneyCategory: "Expense",
      })
    );
    updateDocument("Transactions", parameters.id, {
      amount: numericExpense,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
    });
    navigation.goBack();
    navigation.goBack();
  }
  console.log(expenseAlert);
  return (
    <View style={styles.container}>
      <Header title={t("Expense")} press={() => navigation.goBack()} bgcolor="rgba(253, 60, 74, 1)" color="white" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            scrollEnabled={Platform.OS === "ios" ? false : true}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.add, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
              <View style={styles.balanceView}>
                <Text style={styles.balance}>{t(StringConstants.Howmuch)}</Text>
                <TouchableOpacity activeOpacity={1}>
                  <TextInput
                    value={Expenses}
                    keyboardType="numeric"
                    onChangeText={handleExpenseChange}
                    style={styles.amount}
                    onFocus={handleFocus}
                  ></TextInput>
                </TouchableOpacity>
              </View>
              <View style={[styles.selection]}>
                <CustomD
                  name={t(parameters.category)}
                  data={category}
                  styleButton={styles.textinput}
                  styleItem={styles.dropdownItems}
                  styleArrow={styles.arrowDown}
                  onSelectItem={(item) => setSelectedCategory(item)}
                />
                <Input
                  title={t(StringConstants.Description)}
                  color="rgb(56, 88, 85)"
                  css={styles.textinput}
                  isPass={false}
                  name={Description}
                  onchange={setDescription}
                />
                <CustomD
                  name={t(parameters.wallet)}
                  data={wallet}
                  styleButton={styles.textinput}
                  styleItem={styles.dropdownItems}
                  styleArrow={styles.arrowDown}
                  onSelectItem={(item) => setSelectedWallet(item)}
                />
                {showAttach && (
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={[
                      styles.textinput,
                      { borderStyle: "dashed", alignItems: "center", flexDirection: "row", justifyContent: "center" },
                    ]}
                  >
                    <Entypo name="attachment" size={24} color="black" />
                    <Text>{t(StringConstants.Addattachment)}</Text>
                  </TouchableOpacity>
                )}
                {image && (
                  <View style={{ width: "100%", marginLeft: 30 }}>
                    <Image source={{ uri: image }} style={{ width: 90, height: 80, borderRadius: 10 }} />
                  </View>
                )}
                {photo && (
                  <View style={{ width: "100%", marginLeft: 30 }}>
                    <Image source={{ uri: photo }} style={{ width: 90, height: 80, borderRadius: 10 }} />
                  </View>
                )}
                {document && (
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: "grey",
                      borderRadius: 5,
                      width: "90%",
                      height: "10%",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(205, 153, 141, 0.13)",
                    }}
                  >
                    <TouchableOpacity onPress={() => openDocument()}>
                      <Text>{document.split("/").pop()}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* <View style={styles.notiView}>
                  <View style={styles.noti}>
                    <Text style={styles.notiTitle}>{t("Repeat")}</Text>
                    <Text style={styles.notiDes}>{t(StringConstants.RecentTransaction)}</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
                      value={Expense}
                      thumbColor={"white"}
                      onValueChange={setExpense}
                    />
                  </View>
                </View> */}
                <CustomButton
                  title={t(StringConstants.Continue)}
                  bg="rgba(205, 153, 141, 0.13)"
                  color="rgba(253, 60, 74, 1)"
                  press={parameters.edit ? editExpense : add}
                />
              </View>
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
              <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={styles.modalOverlay}>
                  <TouchableOpacity style={styles.modalContainer}>
                    <SelectImageWithDocumentPicker
                      toggle={toggleModal}
                      setAttach={() => setAttach(!showAttach)}
                      image={image}
                      setImage={setImage}
                      setclose={() => setclose(!close)}
                      setDocument={setDocument}
                      modalItems={modal}
                      setPhoto={setPhoto}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            {close && (
              <>
                {(image || photo) && (
                  <TouchableOpacity
                    style={{ position: "absolute", bottom: Platform.OS === "ios" ? "35%" : "31%", left: "28%" }}
                    onPress={() => {
                      setImage(null);
                      setPhoto(null);
                      setAttach(!showAttach);
                      setDocument(null);
                      setclose(false);
                    }}
                  >
                    <Image style={{ width: 15, height: 15 }} source={require("../../../assets/close.png")} />
                  </TouchableOpacity>
                )}

                {document && (
                  <TouchableOpacity
                    style={{ position: "absolute", bottom: Platform.OS === "ios" ? "30%" : "28%", right: "3%" }}
                    onPress={() => {
                      setImage(null);
                      setAttach(!showAttach);
                      setDocument(null);
                      setclose(false);
                    }}
                  >
                    <Image style={{ width: 15, height: 15 }} source={require("../../../assets/close.png")} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
