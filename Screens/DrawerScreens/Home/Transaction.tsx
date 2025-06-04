import React, { useState, useContext } from "react";
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
  ScrollView,
  TextInput,
} from "react-native";
import * as Sharing from "expo-sharing";
import { getRealm, updateTransactionRealmAndFirestore } from "../../../Realm/realm";
import * as IntentLauncher from "expo-intent-launcher";
import { auth } from "../../FirebaseConfig";
import { CustomButton } from "../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../Components/CustomTextInput";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import SelectImageWithDocumentPicker from "./Attachment";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useTranslation } from "react-i18next";
import { StringConstants, currencies, Weeks } from "../../Constants";
import { updateTransaction, addTransaction } from "../../../Slice/IncomeSlice";
import FrequencyModal from "../../../Components/FrequencyModal";
import DropdownComponent from "../../../Components/DropDown";
import { getStyles } from "./Expense/styles";
import { syncUnsyncedTransactions } from "../../../Realm/Sync";
import { RootState } from "../../../Store/Store";

type IncomeProp = StackNavigationProp<StackParamList, "Transaction">;

interface Props {
  navigation: IncomeProp;
  route: any;
}
const wallet = [
  { value: "PayPal", label: "PayPal" },
  { value: "Google Pay", label: "Google Pay" },
  { label: "Paytm", value: "Paytm" },
  { label: "PhonePe", value: "PhonePe" },
  { label: "Apple Pay", value: "Apple Pay" },
];

const category = [
  { value: "Salary", label: "Salary" },
  { value: "Passive Income", label: "Passive Income" },
];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
export default function Transaction({ navigation, route }: Readonly<Props>) {
  const parameters = route.params;
  const [Switchs, setSwitchs] = useState(parameters.repeat);
  const [showAttach, setshowAttach] = useState(!parameters.url);
  const [image, setImage] = useState<string | null>(parameters.url);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(parameters.url);
  const [document, setDocument] = useState<string | null>(parameters.url);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Income, setIncome] = useState<string>(Number(parameters.amount).toFixed(2));
  const [selectedCategory, setSelectedCategory] = useState(`${parameters.category}`);
  const [selectedWallet, setSelectedWallet] = useState(`${parameters.wallet}`);
  const [Description, setDescription] = useState(`${parameters.title}`);
  const [frequency, setFrequency] = useState(parameters.frequency);
  const [endAfter, setendAfter] = useState(parameters.endAfter);
  const [month, setMonth] = useState(parameters.startMonth);
  const [week, setWeek] = useState(parameters.weekly);
  const [startDate, setStartDate] = useState(parameters.startDate);
  const [endDate, setEndDate] = useState(new Date(parameters.endDate));
  const [Frequencymodal, setFrequencymodal] = useState(false);
  const [incomeError, setIncomeError] = useState("");
  const [categoryError, setcategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [walletError, setwalletError] = useState("");
  const [localPath, setlocalPath] = useState({ type: parameters.type, path: parameters.url });
  const { isConnected } = useNetInfo();
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const Rates = useSelector((state: RootState) => state.Rates);
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  let convertRate: number;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }

  const handleFocus = () => {
    if (Income === "0.00") {
      setIncome("");
    }
  };
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
  const handleIncomeChange = (text: string) => {
    if (text.includes(",")) {
      setIncomeError("Commas are not allowed");
      return;
    }

    const cleaned = text.replace(/[^0-9.]/g, "");
    const decimalCount = (cleaned.match(/\./g) || []).length;
    if (decimalCount > 1) {
      setIncomeError("Only one decimal point is allowed");
      return;
    }

    const parts = cleaned.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";

    if (decimalPart.length > 2) {
      setIncomeError("Maximum income allowed is $99,999.99");
      return;
    }

    if ((integerPart + decimalPart).length > 7) {
      setIncomeError("Maximum income allowed is $99,999.99");
      return;
    }
    const numericValue = parseFloat(cleaned);
    if (numericValue > 99999.99) {
      setIncomeError("Maximum income allowed is $99,999.99");
      return;
    }

    setIncomeError("");
    setIncome(cleaned);
  };

  function handleDescriptionChange() {
    if (descriptionError) {
      setDescriptionError("");
    }
  }
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = auth.currentUser;
  async function add() {
    const realm = await getRealm();
    const numericIncome = parseFloat(Income.replace("$", "") || "0") / convertRate;
    if (numericIncome === 0) {
      setIncomeError("Enter Amount");
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
      amount: numericIncome,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      moneyCategory: parameters.moneyCategory,
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
      type: localPath.type,
      url: localPath.path,
    };
    console.log(transaction);
    try {
      if (realm) {
        realm.write(() => {
          realm.create("Transaction", transaction);
          dispatch(addTransaction(transaction));
        });
      } else {
        console.warn("Realm instance is undefined.");
      }
    } catch (error) {
      console.log(error, 12335);
    }

    if (isConnected) {
      syncUnsyncedTransactions();
    }

    navigation.goBack();
  }
  async function editIncome() {
    const realm = await getRealm();
    const numericIncome = parseFloat(Income.replace("$", "") || "0") / convertRate;
    const updateData = {
      amount: numericIncome,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      id: parameters.id,
      moneyCategory: parameters.moneyCategory,
      type: localPath.type,
      url: localPath.path || document,
      Frequency: frequency,
      endAfter: endAfter || null,
      weekly: week.toString(),
      endDate: new Date(endDate).toISOString() || null,
      repeat: Switchs,
      startDate: startDate,
      startMonth: month,
      startYear: new Date().getFullYear(),
      synced: false,
    };
    const { isConnected } = await NetInfo.fetch();
    dispatch(updateTransaction(updateData));
    if (user) {
      if (realm) {
        updateTransactionRealmAndFirestore(realm, user.uid, parameters.id, updateData, isConnected);
      } else {
        console.warn("Realm instance is undefined.");
      }
    } else {
      console.warn("User is not authenticated.");
    }
    navigation.goBack();
    navigation.goBack();
  }
  function opensModal() {
    setSwitchs(!Switchs);
    if (Switchs === false) {
      setFrequencymodal(!Frequencymodal);
    }
    setFrequency("");
    setMonth(new Date().getMonth());
    setStartDate(new Date().getDate());
    setWeek(new Date().getDay());
    setEndDate(new Date());
    setendAfter("");
  }
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header
        title={t(parameters.moneyCategory)}
        press={() => navigation.goBack()}
        bgcolor={parameters.bg}
        color="white"
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={[styles.add, { backgroundColor: parameters.bg }]}>
              <View style={styles.balanceView}>
                <Text style={styles.balance}>{t(StringConstants.Howmuch)}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.amount}>{currencies[currency]}</Text>
                  <TouchableOpacity activeOpacity={1} style={{ width: "90%" }}>
                    <TextInput
                      value={Income}
                      keyboardType="numeric"
                      onChangeText={handleIncomeChange}
                      style={styles.amount}
                      onFocus={handleFocus}
                    ></TextInput>
                  </TouchableOpacity>
                </View>
                {incomeError !== "" && (
                  <Text
                    style={[
                      styles.error,
                      { color: parameters.moneyCategory === "Expense" ? "white" : "rgb(255, 0, 17)" },
                    ]}
                  >
                    *{incomeError}
                  </Text>
                )}
              </View>
              <View style={[styles.selection]}>
                <DropdownComponent
                  data={parameters.categoryData}
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
                {categoryError !== "" && <Text style={styles.error}>*{categoryError}</Text>}
                <Input
                  title={t(StringConstants.Description)}
                  color="black"
                  css={styles.textinput}
                  isPass={false}
                  name={Description}
                  onchange={setDescription}
                  handleFocus={handleDescriptionChange}
                />
                {descriptionError !== "" && <Text style={styles.error}>*{descriptionError}</Text>}
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
                {walletError !== "" && <Text style={styles.error}>*{walletError}</Text>}
                {showAttach && (
                  <TouchableOpacity onPress={toggleModal} style={styles.attachment}>
                    <Entypo name="attachment" size={24} color={colors.color} />
                    <Text style={{ color: colors.color }}>{t(StringConstants.Addattachment)}</Text>
                  </TouchableOpacity>
                )}
                {localPath.type === "image" && image && (
                  <View style={{ width: "100%", marginLeft: 30 }}>
                    <Image source={{ uri: image }} style={{ width: 90, height: 80, borderRadius: 10 }} />
                    {close && (
                      <>
                        {(!!image || !!photo) && (
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
                              setshowAttach(!showAttach);
                              setDocument(null);
                              setclose(false);
                            }}
                          >
                            <Image style={{ width: 15, height: 15 }} source={require("../../../assets/close.png")} />
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
                      backgroundColor: "rgba(220, 234, 233, 0.6)",
                    }}
                  >
                    <TouchableOpacity onPress={() => openDocument()}>
                      <Text>{document.split("/").pop()}</Text>
                    </TouchableOpacity>
                    {close && (
                      <>
                        {!!document && (
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              bottom: Platform.OS === "ios" ? "30%" : "28%",
                              right: "-2%",
                              top: "-10%",
                            }}
                            onPress={() => {
                              setImage(null);
                              setshowAttach(!showAttach);
                              setDocument(null);
                              setclose(false);
                            }}
                          >
                            <Image style={{ width: 15, height: 15 }} source={require("../../../assets/close.png")} />
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
                      trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: parameters.bg }}
                      value={Switchs}
                      thumbColor={"white"}
                      onValueChange={opensModal}
                    />
                  </View>
                </View>
                <FrequencyModal
                  frequency={frequency}
                  setFrequency={setFrequency}
                  endAfter={endAfter}
                  setendAfter={setendAfter}
                  color={parameters.bg}
                  month={month}
                  setMonth={setMonth}
                  week={week}
                  setWeek={setWeek}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  Frequencymodal={Frequencymodal}
                  setFrequencyModal={setFrequencymodal}
                  setswitch={setSwitchs}
                  edit={parameters.edit}
                />

                {Switchs && frequency != "" && endAfter != "" && (
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
                      <Text style={{ color: "rgba(145, 145, 159, 1)", fontSize: 13 }}>
                        {frequency}
                        {frequency === "Yearly" && ` - ${Month[month]} ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Monthly" &&
                          " - " + Month[new Date().getMonth()] + ` ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Weekly" && ` - ${Weeks[week]}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.color }}>{t("End After")}</Text>
                      <Text style={{ color: "rgba(145, 145, 159, 1)", fontSize: 13 }}>
                        {endAfter === "Never" && endAfter}
                        {endAfter === "Date" && `${new Date(endDate).toDateString()}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setFrequencymodal(!Frequencymodal)}
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
                  bg={parameters.bg}
                  color="white"
                  press={parameters.edit ? editIncome : add}
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
                      setAttach={setshowAttach}
                      image={image}
                      setImage={setImage}
                      setclose={setclose}
                      setDocument={setDocument}
                      modalItems={parameters.modal}
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
