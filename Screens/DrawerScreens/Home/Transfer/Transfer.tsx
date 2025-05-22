import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { getStyles } from "./styles";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../../Components/CustomTextInput";
import SelectImageWithDocumentPicker from "../Attachment";
import { addTransaction } from "../../../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
import { uploadImage, StringConstants } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { auth } from "../../../FirebaseConfig";
import { updateTransactionRealmAndFirestore } from "../../../../Realm/realm";
import { updateTransaction } from "../../../../Slice/IncomeSlice";
import { ThemeContext } from "../../../../Context/ThemeContext";
import TransferImg from "../../../../assets/transfer.svg";
import { getRealm } from "../../../../Realm/realm";
import { syncUnsyncedTransactions } from "../../../../Realm/Sync";
import NetInfo from "@react-native-community/netinfo";
type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}
const modal = [
  require("../../../../assets/CameraBlue.png"),
  require("../../../../assets/ImageBlue.png"),
  require("../../../../assets/DocumentBlue.png"),
];
export default function Income({ navigation, route }: Props) {
  const { from, to, amount, id, edit, title, url } = route.params;
  const [showAttach, setAttach] = useState(!url);
  const [image, setImage] = useState<string | null>(url);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(url);
  const [document, setDocument] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Transfer, setTransfer] = useState<string>(`${amount}`);
  const [From, setFrom] = useState(`${from}`);
  const [To, setTo] = useState(`${to}`);
  const [Description, setDescription] = useState(`${title}`);
  const [loading, setLoading] = useState(false);
  const [TransferError, setTransferError] = useState("");
  const [toError, setToError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [localPath, setlocalPath] = useState({ type: "", path: url });

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
  const handleTransferChange = (text: string) => {
    if (text.includes(",")) {
      setTransferError("Commas are not allowed");
      return;
    }

    const cleaned = text.replace(/[^0-9.]/g, "");

    const decimalCount = (cleaned.match(/\./g) || []).length;
    if (decimalCount > 1) {
      setTransferError("Only one decimal point is allowed");
      return;
    }

    const parts = cleaned.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";

    if (decimalPart.length > 2) {
      setTransferError("Maximum transfer amount is $99,999.99");
      return;
    }

    // Combined digits should not exceed 7
    if ((integerPart + decimalPart).length > 7) {
      setTransferError("Maximum transfer amount is $99,999.99");
      return;
    }

    const numericValue = parseFloat(cleaned);
    if (numericValue > 99999.99) {
      setTransferError("Maximum transfer amount is $99,999.99");
      return;
    }

    setTransferError("");
    setTransfer(cleaned);
  };

  const handleFocus = () => {
    if (Transfer === "0") {
      setTransfer("");
    }
  };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = auth.currentUser;
  function handleDescriptionChange() {
    if (descriptionError) {
      setDescriptionError("");
    }
  }
  async function add() {
    const realm = await getRealm();
    const numericIncome = parseFloat(Transfer.replace("$", "") || "0");
    let supabaseImageUrl = null;
    if (numericIncome === 0) {
      setTransferError("Add amount");
      return;
    }
    if (From === "") {
      setToError("Add From");
      return;
    }
    if (To === "") {
      setToError("Add To");
      return;
    }
    if (Description === "") {
      setDescriptionError("Add description");
      return;
    }

    // if (image) {
    //   setLoading(true);
    //   supabaseImageUrl = await uploadImage(image);
    // }
    // dispatch(
    //   addTransaction({
    //     amount: numericIncome,
    //     description: Description,
    //     category: From + " -> " + To,
    //     moneyCategory: "Transfer",
    //     wallet: "",
    //     attachment: {
    //       type: "image",
    //       uri: supabaseImageUrl,
    //     },
    //   })
    // );
    // AddTransaction({
    //   amount: numericIncome,
    //   description: Description,
    //   category: From + " -> " + To,
    //   moneyCategory: "Transfer",
    //   Date: new Date().toISOString(),
    //   userId: user.uid,
    //   attachment: {
    //     type: "image",
    //     uri: supabaseImageUrl,
    //   },
    // });
    const transaction = {
      _id: new Date().toISOString(),
      amount: numericIncome,
      description: Description,
      category: From + " -> " + To,
      wallet: "",
      moneyCategory: "Transfer",
      Frequency: "",
      endAfter: null,
      weekly: null,
      endDate: null,
      repeat: false,
      Date: new Date().toISOString(),
      synced: false,
      type: localPath.type,
      url: localPath.path,
    };

    try {
      realm.write(() => {
        realm.create("Transaction", transaction);
        dispatch(addTransaction(transaction));
      });
    } catch (error) {
      console.log(error, "1234");
    }
    const { isConnected } = await NetInfo.fetch();
    if (isConnected) {
      syncUnsyncedTransactions(); // Start syncing if online
    }
    setLoading(false);
    navigation.goBack();
  }
  async function editTransfer() {
    const numericExpense = parseFloat(Transfer.replace("$", "") || "0");
    const realm = await getRealm();
    const updateData = {
      amount: numericExpense,
      description: Description,
      category: From + " -> " + To,
      id: id,
      moneyCategory: "Transfer",
      url: localPath.path,
      wallet: "",
    };
    const { isConnected } = await NetInfo.fetch();
    dispatch(updateTransaction(updateData));
    updateTransactionRealmAndFirestore(realm, user?.uid, id, updateData, isConnected);
    navigation.goBack();
    navigation.goBack();
  }
  if (loading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "rgba(228, 225, 225, 0.5)", alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" color="rgba(0, 119, 255, 1)" />
      </View>
    );
  }
  function handleToFromChange() {
    if (toError) {
      setToError("");
    }
  }
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Header
        title={t(StringConstants.Transfer)}
        press={() => navigation.goBack()}
        bgcolor="rgba(0, 119, 255, 1)"
        color="white"
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            scrollEnabled={Platform.OS === "ios" ? false : true}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.add, { backgroundColor: "rgba(0, 119, 255, 1)" }]}>
              <View style={styles.balanceView}>
                <Text style={styles.balance}>{t(StringConstants.Howmuch)}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.amount}>$</Text>
                  <TouchableOpacity activeOpacity={1} style={{ width: "90%" }}>
                    <TextInput
                      value={Transfer}
                      keyboardType="numeric"
                      onChangeText={handleTransferChange}
                      style={styles.amount}
                      onFocus={handleFocus}
                    ></TextInput>
                  </TouchableOpacity>
                </View>
                {TransferError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: 4,
                      marginLeft: 10,
                      fontFamily: "Inter",
                    }}
                  >
                    *{TransferError}
                  </Text>
                )}
              </View>
              <View style={[styles.selection]}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View style={{ width: "50%" }}>
                    <Input
                      title={t("From")}
                      color="rgb(56, 88, 85)"
                      css={styles.textinput}
                      isPass={false}
                      name={From}
                      onchange={setFrom}
                      handleFocus={handleToFromChange}
                    />
                  </View>
                  <View style={{ width: "50%" }}>
                    <Input
                      title={t("To")}
                      color="rgb(56, 88, 85)"
                      css={styles.textinput}
                      isPass={false}
                      name={To}
                      onchange={setTo}
                      handleFocus={handleToFromChange}
                    />
                  </View>
                  <TransferImg
                    height={40}
                    style={{
                      position: "absolute",
                      top: "25%",
                      left: "45%",
                    }}
                  />
                  {/* <Image
                    style={{ width: 40, height: 40, position: "absolute", top: "25%", left: "45%" }}
                    source={require("../../../../assets/Transfer.png")}
                  /> */}
                </View>
                {toError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: 4,
                      marginLeft: 10,
                      fontFamily: "Inter",
                      width: "90%",
                    }}
                  >
                    *{toError}
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
                {image && (
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
                      backgroundColor: "rgba(141, 163, 205, 0.21)",
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
                  bg="rgba(0, 119, 255, 1)"
                  color="white"
                  press={edit ? editTransfer : add}
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
