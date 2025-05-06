import React, { useState,useContext } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Switch,

  Modal,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as Sharing from "expo-sharing";
import {getRealm} from "../../../../Realm/realm"
import * as IntentLauncher from "expo-intent-launcher";
import { auth } from "../../../FirebaseConfig";
import { updateDocument } from "../../../FirestoreHandler";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../../Components/CustomTextInput";
import { ThemeContext } from "../../../../Context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import SelectImageWithDocumentPicker from "../Attachment";

import { uploadImage, Weeks } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../../../Constants";
import { updateTransaction } from "../../../../Slice/IncomeSlice";
import { AddTransaction } from "../../../FirestoreHandler";
import FrequencyModal from "../../../../Components/FrequencyModal";
import DropdownComponent from "../../../../Components/DropDown";
import { getStyles } from "./styles";
type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}
const wallet = [
  { value: "PayPal", label: "PayPal" },
  { value: "GooglePay", label: "GooglePay" },
  { label: "Paytm", value: "Paytm" },
  { label: "PhonePe", value: "PhonePe" },
  { label: "ApplePay", value: "ApplePay" },
];

const category = [
  { value: "Salary", label: "Salary" },
  { value: "Passive Income", label: "Passive Income" },
];
const Month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

const date = [];
for (let i = 1; i <= 31; i++) {
  date.push(i);
}
const year = [];
for (let i = 0; i <= 31; i++) {
  year.push(new Date().getFullYear() + i);
}
export default function Income({ navigation, route }: Props) {
  const parameters = route.params;
  const [Switchs, setSwitch] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Income, setIncome] = useState<string>(`$${parameters.amount}`);
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
  const [Frequencymodal, setFrequencyModal] = useState(false);
  const [incomeError, setIncomeError] = useState("");
  const [categoryError, setcategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [walletError, setwalletError] = useState("");
  const modal = [
    require("../../../../assets/Camera.png"),
    require("../../../../assets/Image.png"),
    require("../../../../assets/Document.png"),
  ];
  const handleFocus = () => {
    if (Income === "" || Income === "$0" || Income === "$") {
      setIncome("$");
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
      setIncomeError("Enter a valid number with only one decimal point");
      return;
    }
    if (!/^\d*\.?\d*$/.test(cleaned)) {
      setIncomeError("Enter a valid number");
      return;
    }

    if (cleaned.length > 7) {
      setIncomeError("Maximum 7 digits allowed");
      return;
    }
    setIncomeError("");
    setIncome(`$${cleaned}`);
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
    console.log("hello")
    const realm = await getRealm();
   
    console.log(realm)
    const numericIncome = parseFloat(Income.replace("$", "") || "0");
    let supabaseImageUrl = null;
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
    if (image) {
      setLoading(true);
      supabaseImageUrl = await uploadImage(image);
    }
    // dispatch(
    //   addTransaction({
    //     amount: numericIncome,
    //     description: Description,
    //     category: selectedCategory,
    //     wallet: selectedWallet,
    //     moneyCategory: "Income",
    //     attachment: {
    //       type: "image",
    //       uri: supabaseImageUrl,
    //     },
    //   })
    // );
    AddTransaction({
      amount: numericIncome,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      moneyCategory: "Income",
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
    const transaction = {
      _id:new Date().toISOString(),
      amount: numericIncome,
      description: Description,
      category: selectedCategory,
      wallet: selectedWallet,
      moneyCategory: "Income",
      Frequency: frequency,
      endAfter: endAfter || null,
      weekly: week || null,
      endDate: endDate || null,
      startDate: startDate,
      startMonth: month,
      startYear: new Date().getFullYear(),
      userId: user?.uid || "unknown",
      createdAt: new Date(),
    };
    console.log("added")
    try {
      realm.write(() => {
        realm.create("Transaction", transaction);
      });
      console.log("done")
    }
    catch(error)
    {
      console.log(error)
    }
  
    setLoading(false);
    navigation.goBack();
  }
  function editIncome() {
    const numericIncome = parseFloat(Income.replace("$", "") || "0");
    dispatch(
      updateTransaction({
        amount: numericIncome,
        description: Description,
        category: selectedCategory,
        wallet: selectedWallet,
        id: parameters.id,
        moneyCategory: "Income",
      })
    );
    updateDocument("Transactions", parameters.id, {
      amount: numericIncome,
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
        <ActivityIndicator size="large" color="rgba(0, 168, 107, 1)" />
      </View>
    );
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
      const { colors, setTheme, theme } = useContext(ThemeContext);
      const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header
        title={t(StringConstants.Income)}
        press={() => navigation.goBack()}
        bgcolor="rgba(0, 168, 107, 1)"
        color="white"
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            scrollEnabled={Platform.OS === "ios" ? false : true}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.add, { backgroundColor: "rgba(0, 168, 107, 1)" }]}>
              <View style={styles.balanceView}>
                <Text style={styles.balance}>{t(StringConstants.Howmuch)}</Text>
                <TouchableOpacity activeOpacity={1}>
                  <TextInput
                    value={Income}
                    keyboardType="numeric"
                    onChangeText={handleIncomeChange}
                    style={styles.amount}
                    onFocus={handleFocus}
                  ></TextInput>
                </TouchableOpacity>
                {incomeError !== "" && (
                  <Text
                    style={styles.error}
                  >
                    *{incomeError}
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
                    style={styles.error}
                  >
                    *{categoryError}
                  </Text>
                )}
                <Input
                  title={t(StringConstants.Description)}
                  color="black"
                  css={styles.textinput}
                  isPass={false}
                  name={Description}
                  onchange={setDescription}
                  handleFocus={handleDescriptionChange}
                />
                {descriptionError !== "" && (
                  <Text
                    style={styles.error}
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
                    style={styles.error}
                  >
                    *{walletError}
                  </Text>
                )}
                {showAttach && (
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={styles.attachment}
                  >
                    <Entypo name="attachment" size={24} color={colors.color} />
                    <Text style={{color:colors.color}}>{t(StringConstants.Addattachment)}</Text>
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
                      backgroundColor: "rgba(220, 234, 233, 0.6)",
                    }}
                  >
                    <TouchableOpacity onPress={() => openDocument()}>
                      <Text>{document.split("/").pop()}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.notiView}>
                  <View style={styles.noti}>
                    <Text style={styles.notiTitle}>{t("Repeat")}</Text>
                    <Text style={styles.notiDes}>{t(StringConstants.RepeatTransaction)}</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgba(0, 168, 107, 1)" }}
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
                  color="rgba(0, 168, 107, 1)"
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
                      <Text style={{ fontSize: 16, fontWeight: "bold",color:colors.color }}>Frequency</Text>
                      <Text style={{ color: "rgba(145, 145, 159, 1)", fontSize: 14 }}>
                        {frequency}
                        {frequency === "Yearly" && ` - ${month} ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Monthly" &&
                          " - " + Month[new Date().getMonth()] + ` ${startDate} ` + new Date().getFullYear()}
                        {frequency === "Weekly" && ` - ${Weeks[week]}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold",color:colors.color }}>End After</Text>
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
                  bg="rgba(0, 168, 107, 1)"
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
                      setAttach={setAttach}
                      image={image}
                      setImage={setImage}
                      setclose={setclose}
                      setDocument={setDocument}
                      modalItems={modal}
                      setPhoto={setPhoto}
                      close={close}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            {close && (
              <>
                {(image || photo) && (
                  <TouchableOpacity
                    style={{ position: "absolute", bottom: Platform.OS === "ios" ? "35%" : "30%", left: "27%" }}
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
                    <Image style={{ width: 15, height: 15 }} source={require("../../../../assets/close.png")} />
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
