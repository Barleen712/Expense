import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  ScrollView,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { CustomButton } from "../../../../Components/CustomButton";
import { AddNotification, updateBudgetDocument, updateDocument } from "../../../FirestoreHandler";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../../Components/CustomTextInput";
import SelectImageWithDocumentPicker from "../Attachment";
import { useDispatch, useSelector } from "react-redux";
import FrequencyModal from "../../../../Components/FrequencyModal";
import { uploadImage } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { StringConstants, currencies } from "../../../Constants";
import { updateBudget, updateTransaction } from "../../../../Slice/IncomeSlice";
import { addTransaction } from "../../../../Slice/IncomeSlice";
import { auth } from "../../../FirebaseConfig";
import { BudgetCategory } from "../../../../Slice/Selectors";
import { onDisplayNotification } from "../../Budget/TestNotification";
import { ActivityIndicator } from "react-native-paper";
import DropdownComponent from "../../../../Components/DropDown";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import { getStyles } from "./styles";
import { getRealm } from "../../../../Realm/realm";
import { syncUnsyncedTransactions } from "../../../../Realm/Sync";
import NetInfo from "@react-native-community/netinfo";
import { updateTransactionRealmAndFirestore } from "../../../../Realm/realm";
import { Weeks } from "../../../Constants";
import { RootState } from "../../../../Store/Store";
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
  { value: "Google Pay", label: "Google Pay" },
  { label: "Paytm", value: "Paytm" },
  { label: "PhonePe", value: "PhonePe" },
  { label: "Apple Pay", value: "Apple Pay" },
];
const modal = [
  require("../../../../assets/CameraRed.png"),
  require("../../../../assets/ImageRed.png"),
  require("../../../../assets/DocumentRed.png"),
];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
export default function Expense({ navigation, route }: Props) {
  const budget = useSelector(BudgetCategory);
  const exceeded = useSelector((state) => state.Money.exceedNotification);
  const expenseAlert = useSelector((state) => state.Money.expenseAlert);
  const parameters = route.params;
  const [showAttach, setAttach] = useState(!parameters.url);
  const [image, setImage] = useState<string | null>(parameters.url);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(parameters.url);
  const [document, setDocument] = useState<string | null>(parameters.url);
  const [photo, setPhoto] = useState<string | null>(parameters.url);
  const [Expenses, setExpenses] = useState<string>(`${parameters.amount}`);
  const [selectedCategory, setSelectedCategory] = useState(`${parameters.category}`);
  const [selectedWallet, setSelectedWallet] = useState(`${parameters.wallet}`);
  const [Description, setDescription] = useState(`${parameters.title}`);
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState(parameters.frequency);
  const [endAfter, setendAfter] = useState(parameters.endAfter);
  const [month, setMonth] = useState(parameters.startMonth);
  const [week, setWeek] = useState(parameters.weekly);
  const [startDate, setStartDate] = useState(parameters.startDate);
  const [endDate, setEndDate] = useState(new Date(parameters.endDate));
  const [Switchs, setSwitch] = useState(parameters.repeat);
  const [Frequencymodal, setFrequencyModal] = useState(false);
  const [expenseError, setExpenseError] = useState("");
  const [categoryError, setcategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [walletError, setwalletError] = useState("");
  const [localPath, setlocalPath] = useState({ type: parameters.type, path: parameters.url });
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const Rates = useSelector((state: RootState) => state.Rates);
  let convertRate: number;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  const monthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const monthlyBudget = budget[monthKey] || [];
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

    const parts = cleaned.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";

    // Limit total digits to 7 (before + after decimal)
    if ((integerPart + decimalPart).length > 7) {
      setExpenseError("Maximum expense allowed is $99,999.99");
      return;
    }

    // Limit to 2 decimal digits
    if (decimalPart.length > 2) {
      setExpenseError("Maximum expense allowed is $99,999.99");
      return;
    }

    const numericValue = parseFloat(cleaned);
    if (numericValue > 99999.99) {
      setExpenseError("Maximum expense allowed is $99,999.99");
      return;
    }

    setExpenseError("");
    setExpenses(cleaned);
  };

  function handleDescriptionChange() {
    if (descriptionError) {
      setDescriptionError("");
    }
  }
  const handleFocus = () => {
    if (Expenses === "0") {
      setExpenses("");
    }
  };
  const dispatch = useDispatch();
  const user = auth.currentUser;
  async function add() {
    const realm = await getRealm();
    const numericExpense = parseFloat(Expenses.replace("$", "") || "0") / convertRate;
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
    const transaction = {
      _id: new Date().toISOString(),
      amount: numericExpense,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      moneyCategory: "Expense",
      Frequency: frequency,
      endAfter: endAfter || null,
      weekly: week.toString(),
      endDate: new Date(endDate).toISOString() || null,
      repeat: Switchs,
      startDate: startDate,
      startMonth: month,
      startYear: new Date().getFullYear(),
      Date: new Date().toISOString(),
      synced: false,
      type: localPath.type || "document",
      url: localPath.path || document,
    };
    console.log(transaction);
    try {
      if (realm) {
        realm.write(() => {
          realm.create("Transaction", transaction);
          dispatch(addTransaction(transaction));
        });
      } else {
        console.log("Realm is undefined");
      }
    } catch (error) {
      console.log(error, "1234");
    }
    const { isConnected } = await NetInfo.fetch();
    if (isConnected) {
      syncUnsyncedTransactions(); // Start syncing if online
    }
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
          userId: user ? user.uid : "",
        });
      }

      if (Budget) {
        const Budget = monthlyBudget.find((item) => item.category === selectedCategory);
        if (Budget.amountSpent + numericExpense >= Budget.budgetvalue && exceeded === true) {
          onDisplayNotification({
            title: `${selectedCategory} budget has exceeded the limit`,
            body: `Your ${selectedCategory} budget has exceeded the limit i.e 100%`,
          });
          AddNotification({
            title: `${selectedCategory} budget has exceeded the limit`,
            body: `Your ${selectedCategory} budget has exceeded the limit i.e 100%`,
            date: new Date().toISOString(),
            userId: user ? user.uid : "",
          });
        }
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
        userId: user ? user.uid : "",
      });
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
  async function editExpense() {
    const realm = await getRealm();
    const numericExpense = parseFloat(Expenses.replace("$", "") || "0") / convertRate;
    const updateData = {
      amount: numericExpense,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      id: parameters.id,
      moneyCategory: "Expense",
      type: localPath.type || "document",
      url: localPath.path,
      Frequency: frequency,
      weekly: week.toString(),
      endDate: new Date(endDate).toISOString() || null,
      repeat: Switchs,
      startDate: startDate,
      startMonth: month,
      startYear: new Date().getFullYear(),
      synced: false,
      endAfter: endAfter || null,
    };
    const { isConnected } = await NetInfo.fetch();
    dispatch(updateTransaction(updateData));
    updateTransactionRealmAndFirestore(realm, user?.uid, parameters.id, updateData, isConnected);
    navigation.goBack();
    navigation.goBack();
  }
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
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
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.amount}>{currencies[currency]}</Text>
                  <TouchableOpacity activeOpacity={1} style={{ width: "90%" }}>
                    <TextInput
                      value={Expenses}
                      keyboardType="numeric"
                      onChangeText={handleExpenseChange}
                      style={styles.amount}
                      onFocus={handleFocus}
                    ></TextInput>
                  </TouchableOpacity>
                </View>
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
                  position="bottom"
                  height={180}
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
                  position="bottom"
                  height={180}
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
                    <Entypo name="attachment" size={24} color={colors.color} />
                    <Text style={{ color: colors.color }}>{t(StringConstants.Addattachment)}</Text>
                  </TouchableOpacity>
                )}
                {localPath.type === "image" && image && (
                  <View style={{ width: "100%", marginLeft: 30 }}>
                    <Image source={{ uri: image }} style={{ width: 90, height: 80, borderRadius: 10 }} />
                    {close && (
                      <>
                        {(image || photo) && (
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              bottom: Platform.OS === "ios" ? "35%" : "30%",
                              left: "21%",
                              top: "-6%",
                            }}
                            onPress={() => {
                              setImage(null);
                              setPhoto(null);
                              setAttach(!showAttach);
                              setDocument(null);
                              setclose(false);
                            }}
                          >
                            <Image style={{ width: 15, height: 15 }} source={require("../../../../assets/close.png")} />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                )}

                {localPath.type === "document" && document && (
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
                    {close && (
                      <>
                        {document && (
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              bottom: Platform.OS === "ios" ? "30%" : "28%",
                              right: "-2%",
                              top: "-10%",
                            }}
                            onPress={() => {
                              setImage(null);
                              setAttach(!showAttach);
                              setDocument(null);
                              setclose(false);
                            }}
                          >
                            <Image style={{ width: 15, height: 15 }} source={require("../../../../assets/close.png")} />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                )}
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
                    setswitch={setSwitch}
                    edit={parameters.edit}
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
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.color }}>{t("Frequency")}</Text>
                      <Text style={{ color: "rgba(145, 145, 159, 1)", fontSize: 14 }}>
                        {frequency}
                        {frequency === "Yearly" && ` - ${Month[month]} ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Monthly" &&
                          " - " + Month[new Date().getMonth()] + ` ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Weekly" && ` - ${Weeks[week]}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.color }}>{t("End After")}</Text>
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
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 0.4,
                      }}
                    >
                      <Text style={{ color: "rgb(42, 124, 118)", fontSize: 16, fontWeight: "bold" }}>{t("Edit")}</Text>
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
                      attach={showAttach}
                      setAttach={setAttach}
                      image={image}
                      setImage={setImage}
                      setclose={setclose}
                      setDocument={setDocument}
                      modalItems={modal}
                      setPhoto={setPhoto}
                      close={close}
                      setlocalPath={setlocalPath}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
