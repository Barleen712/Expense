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
  SafeAreaView,
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
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    // Reject comma
    if (text.includes(",")) {
      setTransferError("Commas are not allowed");
      return;
    }

    // Only allow digits with at most one dot
    const validNumberRegex = /^\d*\.?\d*$/;
    if (!validNumberRegex.test(text)) {
      setTransferError("Please enter a valid amount");
      return;
    }

    // Allow empty input while typing
    if (text === "") {
      setTransferError("");
      setTransfer("");
      return;
    }

    const parts = text.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";

    if (decimalPart.length > 2) {
      setTransferError("Maximum two decimal places allowed");
      return;
    }

    if ((integerPart + decimalPart).length > 7) {
      setTransferError("Maximum transfer amount is $99,999.99");
      return;
    }

    const numericValue = parseFloat(text);
    if (numericValue > 99999.99) {
      setTransferError("Maximum transfer amount is $99,999.99");
      return;
    }

    setTransferError("");
    setTransfer(text);
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
    const trimmedFrom = From.trim();
    const trimmedTo = To.trim();
    const trimmedDescription = Description.trim();
    console.log(trimmedTo);
    const numericIncome = parseFloat(Transfer.replace("$", "") || "0") / convertRate;

    if (numericIncome === 0 && trimmedFrom === "" && trimmedDescription === "") {
      setTransferError("Add amount");
      setToError("Fill both details");
      setDescriptionError("Add description");
      return;
    }
    if (trimmedFrom === "") {
      setToError("Add From");
      return;
    }
    if (trimmedTo === "") {
      setToError("Add To");
      return;
    }
    if (trimmedDescription === "") {
      setDescriptionError("Add description");
      return;
    }

    // Use trimmed values for saving
    const transaction = {
      _id: new Date().toISOString(),
      amount: numericIncome,
      description: trimmedDescription,
      category: trimmedFrom + " -> " + trimmedTo,
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
      const realm = await getRealm();
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
      syncUnsyncedTransactions();
    }
    setLoading(false);
    navigation.goBack();
  }

  async function editTransfer() {
    const trimmedFrom = From.trim();
    const trimmedTo = To.trim();
    const trimmedDescription = Description.trim();

    if (trimmedFrom === "") {
      setToError("Add From");
      return;
    }
    if (trimmedTo === "") {
      setToError("Add To");
      return;
    }
    if (trimmedDescription === "") {
      setDescriptionError("Add description");
      return;
    }

    const numericExpense = parseFloat(Transfer.replace("$", "") || "0") / convertRate;
    const realm = await getRealm();
    const updateData = {
      amount: numericExpense,
      description: trimmedDescription,
      category: trimmedFrom + " -> " + trimmedTo,
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
  const insets = useSafeAreaInsets();
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
    <SafeAreaView style={[styles.container, { backgroundColor: "rgba(0, 119, 255, 1)" }]}>
      <Header
        title={t(StringConstants.Transfer)}
        press={() => navigation.goBack()}
        bgcolor="rgba(0, 119, 255, 1)"
        color="white"
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
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
                      numberOfLines={1}
                    ></TextInput>
                  </TouchableOpacity>
                </View>
                {TransferError !== "" && <Text style={styles.error}>{TransferError}</Text>}
              </View>
              <View style={[styles.selection]}>
                <View style={{ width: "100%", marginBottom: 2 }}>
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View style={{ width: "50%" }}>
                      <Input
                        title={t("From")}
                        color="rgba(145, 145, 159, 1)"
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
                        color="rgba(145, 145, 159, 1)"
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
                  {toError !== "" && <Text style={styles.error}>{toError}</Text>}
                </View>
                <View style={{ width: "105%" }}>
                  <Input
                    title={t(StringConstants.Description)}
                    color="rgba(145, 145, 159, 1)"
                    css={styles.textinput}
                    isPass={false}
                    name={Description}
                    onchange={setDescription}
                    handleFocus={handleDescriptionChange}
                    limit={200}
                  />
                  {descriptionError !== "" && (
                    <Text style={[styles.error, { bottom: -7, marginLeft: 20 }]}>{descriptionError}</Text>
                  )}
                </View>
                {showAttach && (
                  <TouchableOpacity onPress={toggleModal} style={styles.attachment}>
                    <Entypo name="attachment" size={24} color={"rgb(74, 74, 77)"} />
                    <Text style={{ color: "rgba(145, 145, 159, 1)", fontWeight: 400, fontSize: RFValue(14) }}>
                      {t(StringConstants.Addattachment)}
                    </Text>
                  </TouchableOpacity>
                )}
                {localPath.type === "image" && image && (
                  <View style={{ width: "100%", marginLeft: 30, marginBottom: 10, marginTop: 10 }}>
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
                      marginTop: 10,
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
      <View
        style={{
          height: insets.bottom,
          backgroundColor: colors.backgroundColor,
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      ></View>
    </SafeAreaView>
  );
}
