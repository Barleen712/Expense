import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
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
import { getStyles } from "../Expense/styles";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import Header from "../../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../../Components/CustomTextInput";
import SelectImageWithDocumentPicker from "../Attachment";
import { addTransaction, updateTransaction } from "../../../../Slice/IncomeSlice";
import { useDispatch, useSelector } from "react-redux";
import { StringConstants, currencies } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { auth } from "../../../FirebaseConfig";
import { updateTransactionRealmAndFirestore, getRealm } from "../../../../Realm/realm";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import TransferImg from "../../../../assets/transfer.svg";
import { syncUnsyncedTransactions } from "../../../../Realm/Sync";
import NetInfo from "@react-native-community/netinfo";
import { RootState } from "../../../../Store/Store";
import CameraBlue from "../../../../assets/CameraBlue.svg";
import ImageBlue from "../../../../assets/ImageBlue.svg";
import DocumentBlue from "../../../../assets/DocumentBlue.svg";
type IncomeProp = StackNavigationProp<StackParamList, "Transfer">;

interface Props {
  navigation: IncomeProp;
  route: any;
}
const modal = [CameraBlue, ImageBlue, DocumentBlue];
export default function Income({ navigation, route }: Readonly<Props>) {
  const { from, to, amount, id, edit, title, url, type } = route.params;
  const [showAttach, setshowAttach] = useState(!url);
  const [image, setImage] = useState<string | null>(url);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(url);
  const [document, setDocument] = useState<string | null>(url);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Transfer, setTransfer] = useState<string>(Number(amount).toFixed(2));
  const [From, setFrom] = useState(`${from}`);
  const [To, setTo] = useState(`${to}`);
  const [Description, setDescription] = useState(`${title}`);
  const [loading, setLoading] = useState(false);
  const [TransferError, setTransferError] = useState("");
  const [toError, setToError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [localPath, setlocalPath] = useState({ type: type, path: url });
  const currency = useSelector((state: RootState) => state.Money.preferences.currency);
  const Rates = useSelector((state: RootState) => state.Rates);
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  let convertRate: number;
  if (currency === "USD") {
    convertRate = 1;
  } else {
    convertRate = Rates.Rate[currency];
  }
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
    if (Transfer === "0.00") {
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
    const numericIncome = parseFloat(Transfer.replace("$", "") || "0") / convertRate;
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
    const transaction = {
      _id: new Date().toISOString(),
      amount: numericIncome,
      description: Description,
      category: From + " -> " + To,
      wallet: "",
      moneyCategory: "Transfer",
      Frequency: "",
      endAfter: null,
      weekly: "",
      endDate: null,
      repeat: false,
      Date: new Date().toISOString(),
      synced: false,
      startDate: 0,
      startMonth: 0,
      startYear: new Date().getFullYear(),
      type: localPath.type,
      url: localPath.path || document,
    };

    try {
      if (realm) {
        realm.write(() => {
          realm.create("Transaction", transaction);
          dispatch(addTransaction(transaction));
        });
      } else {
        console.log("Realm instance is undefined.");
      }
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
    const numericExpense = parseFloat(Transfer.replace("$", "") || "0") / convertRate;
    const realm = await getRealm();
    const updateData = {
      amount: numericExpense,
      description: Description,
      category: From + " -> " + To,
      id: id,
      Frequency: "",
      endAfter: null,
      weekly: "",
      endDate: null,
      repeat: false,
      moneyCategory: "Transfer",
      Date: new Date().toISOString(),
      synced: false,
      startDate: 0,
      startMonth: 0,
      startYear: new Date().getFullYear(),
      type: localPath.type,
      url: localPath.path || document,
      wallet: "",
    };
    const { isConnected } = await NetInfo.fetch();
    dispatch(updateTransaction(updateData));
    if (realm) {
      if (user?.uid) {
        updateTransactionRealmAndFirestore(realm, user.uid, id, updateData, isConnected);
      } else {
        console.warn("User UID is undefined.");
      }
    } else {
      console.warn("Realm instance is undefined.");
    }
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
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={[styles.add, { backgroundColor: "rgba(0, 119, 255, 1)" }]}>
              <View style={styles.balanceView}>
                <Text style={styles.balance}>{t(StringConstants.Howmuch)}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.amount}>{currencies[currency]}</Text>
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
                      limit={30}
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
                      limit={30}
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
                </View>
                {toError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: -10,
                      marginBottom: 5,
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
                  limit={200}
                />
                {descriptionError !== "" && (
                  <Text
                    style={{
                      color: "rgb(255, 0, 17)",
                      marginTop: -10,
                      marginBottom: 10,
                      marginLeft: 8,
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
                {localPath.type === "image" && image && (
                  <View style={{ width: "100%", marginLeft: 30, marginBottom: 10 }}>
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
                      height: "12%",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity onPress={() => openDocument()}>
                      <Text style={{ color: "rgba(0, 119, 255, 1)" }}>{document.split("/").pop()}</Text>
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
                            <Image style={{ width: 15, height: 15 }} source={require("../../../../assets/close.png")} />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                )}
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
                      setAttach={setshowAttach}
                      image={image}
                      setImage={setImage}
                      setclose={setclose}
                      setDocument={setDocument}
                      modalItems={modal}
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
