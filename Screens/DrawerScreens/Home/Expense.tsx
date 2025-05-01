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
import FrequencyModal from "../../../Components/FrequencyModal";
import { uploadImage } from "../../Constants";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../Constants";
import { updateBudget, updateTransaction } from "../../../Slice/IncomeSlice";
import { AddTransaction } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
import { BudgetCategory } from "../../../Slice/Selectors";
import { onDisplayNotification } from "../Budget/TestNotification";
import { ActivityIndicator } from "react-native-paper";
import DropdownComponent from "../../../Components/DropDown";
type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}
const category = [
  { label: "Shopping", value: "Shopping" },
  { label: "Food", value: "Food" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Subscription", value: "Subscription" },
  { label: "Transportation", value: "Transportation" },
  { label: "Bills", value: "Bills" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];

const wallet = [
  { value: "PayPal", label: "PayPal" },
  { value: "GooglePay", label: "GooglePay" },
  { label: "Paytm", value: "Paytm" },
  { label: "PhonePe", value: "PhonePe" },
  { label: "ApplePay", value: "ApplePay" },
];
const modal = [
  require("../../../assets/CameraRed.png"),
  require("../../../assets/ImageRed.png"),
  require("../../../assets/DocumentRed.png"),
];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
export default function Expense({ navigation, route }: Props) {
  const budget = useSelector(BudgetCategory);
  const exceeded = useSelector((state) => state.Money.exceedNotification);
  const expenseAlert = useSelector((state) => state.Money.expenseAlert);
  const parameters = route.params;
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
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [endAfter, setendAfter] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(new Date().getDay());
  const [startDate, setStartDate] = useState(new Date().getDate());
  const [endDate, setEndDate] = useState(new Date());
  const [Switchs, setSwitch] = useState(false);
  const [Frequencymodal, setFrequencyModal] = useState(false);
  const [expenseError, setExpenseError] = useState("");
  const [categoryError, setcategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [walletError, setwalletError] = useState("");
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const monthlyBudget = budget[currentMonth] || [];
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
    if (text.includes(",")) {
      setExpenseError("Commas are not allowed");
      return;
    }
    const cleaned = text.replace(/[^0-9.]/g, "");

    const decimalCount = (cleaned.match(/\./g) || []).length;
    if (decimalCount > 1) {
      setExpenseError("Enter a valid number with only one decimal point");
      return;
    }
    if (!/^\d*\.?\d*$/.test(cleaned)) {
      setExpenseError("Enter a valid number");
      return;
    }

    if (cleaned.length > 7) {
      setExpenseError("Maximum 7 digits allowed");
      return;
    }
    setExpenseError("");
    setExpenses(`$${cleaned}`);
  };
  function handleDescriptionChange() {
    if (descriptionError) {
      setDescriptionError("");
    }
  }
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
      setExpenseError("Add amount");
      return;
    }
    if (selectedCategory === "Category") {
      setcategoryError("Select Category");
      return;
    }
    if (Description === "") {
      setDescriptionError("Add Description");
      return;
    }
    if (selectedWallet === "Wallet") {
      setwalletError("Select Wallet");
      return;
    }
    if (image) {
      setLoading(true);
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
      Frequency: frequency,
      endAfter: endAfter,
      weekly: week,
      endDate: endDate.toISOString(),
      startDate: startDate,
      startMonth: month,
      startYear: new Date().getFullYear(),
    });

    const Budget = monthlyBudget.some((item) => item.category === selectedCategory);
    if (Budget) {
      const Budget = monthlyBudget.find((item) => item.category === selectedCategory);
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
    setLoading(false);
    navigation.goBack();
  }
  function opensModal() {
    setSwitch(!Switchs);
    if (Switchs === false) {
      setFrequencyModal(!Frequencymodal);
    }
    setFrequency(""), setMonth(new Date().getMonth());
    setStartDate(new Date().getDate());
    setWeek(new Date().getDay());
    setEndDate(new Date());
    setendAfter("");
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
  if (loading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "rgba(228, 225, 225, 0.5)", alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" color="rgba(253, 60, 74, 1)" />
      </View>
    );
  }
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
                {expenseError !== "" && (
                  <Text
                    style={{
                      color: "rgb(246, 246, 246)",
                      marginTop: 4,
                      marginLeft: 10,
                      fontFamily: "Inter",
                    }}
                  >
                    *{expenseError}
                  </Text>
                )}
              </View>
              <View style={[styles.selection]}>
                <DropdownComponent
                  data={category}
                  value={selectedCategory}
                  name={t(parameters.category)}
                  styleButton={styles.textinput}
                  onSelectItem={(item) => {
                    setSelectedCategory(item);
                    setcategoryError("");
                  }}
                />
                {categoryError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: 4,
                      marginLeft: 10,
                      fontFamily: "Inter",
                      width: "90%",
                    }}
                  >
                    *{categoryError}
                  </Text>
                )}
                <Input
                  title={t(StringConstants.Description)}
                  color="rgb(56, 88, 85)"
                  css={styles.textinput}
                  isPass={false}
                  name={Description}
                  onchange={setDescription}
                  handleFocus={handleDescriptionChange}
                />
                {descriptionError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: 4,
                      marginLeft: 10,
                      fontFamily: "Inter",
                      width: "90%",
                    }}
                  >
                    *{descriptionError}
                  </Text>
                )}

                <DropdownComponent
                  data={wallet}
                  value={selectedWallet}
                  name={t(parameters.wallet)}
                  styleButton={styles.textinput}
                  onSelectItem={(item) => {
                    setSelectedWallet(item);
                    setwalletError("");
                  }}
                />
                {walletError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: 4,
                      marginLeft: 10,
                      fontFamily: "Inter",
                      width: "90%",
                    }}
                  >
                    *{walletError}
                  </Text>
                )}
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
                <View style={styles.notiView}>
                  <View style={styles.noti}>
                    <Text style={styles.notiTitle}>{t("Repeat")}</Text>
                    <Text style={styles.notiDes}>{t(StringConstants.RepeatTransaction)}</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgba(253, 60, 74, 1)" }}
                      value={Switchs}
                      thumbColor={"white"}
                      onValueChange={opensModal}
                    />
                  </View>
                </View>
                {Switchs && (
                  <FrequencyModal
                    frequency={frequency}
                    setFrequency={setFrequency}
                    endAfter={endAfter}
                    setendAfter={setendAfter}
                    color="rgba(253, 60, 74, 1)"
                    month={month}
                    setMonth={setMonth}
                    week={week}
                    setWeek={setWeek}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    Frequencymodal={Frequencymodal}
                    setFrequencyModal={setFrequencyModal}
                  />
                )}
                {Switchs && (
                  <View
                    style={{
                      width: "100%",
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Frequency</Text>
                      <Text style={{ color: "rgba(145, 145, 159, 1)", fontSize: 14 }}>
                        {frequency}
                        {frequency === "Yearly" && ` - ${Month[month]} ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Monthly" &&
                          " - " + Month[new Date().getMonth()] + ` ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Weekly" && ` - ${week}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>End After</Text>
                      <Text style={{ color: "rgba(145, 145, 159, 1)", fontSize: 14 }}>
                        {endAfter === "Never" && endAfter}
                        {endAfter === "Date" && `${new Date(endDate).toDateString()}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setFrequencyModal(!Frequencymodal)}
                      style={{
                        backgroundColor: "rgba(56, 184, 176, 0.23)",
                        padding: 10,
                        borderRadius: 20,
                        //paddingLeft: 10,
                        //  paddingRight: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        //width: "18%",
                        //height: "20%",
                        flex: 0.4,
                      }}
                    >
                      <Text style={{ color: "rgb(42, 124, 118)", fontSize: 16, fontWeight: "bold" }}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <CustomButton
                  title={t(StringConstants.Continue)}
                  bg="rgba(253, 60, 74, 1)"
                  color="white"
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
                    style={{ position: "absolute", bottom: Platform.OS === "ios" ? "25%" : "21%", left: "26%" }}
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
