import React, { useState } from "react";
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
} from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../Components/CustomTextInput";
import SelectImageWithDocumentPicker from "./Attachment";
import { addTransaction } from "../../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
import { uploadImage, StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { AddTransaction } from "../../FirestoreHandler";
import { auth } from "../../FirebaseConfig";
import { updateDocument } from "../../FirestoreHandler";
import { updateTransaction } from "../../../Slice/IncomeSlice";

type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}
const modal = [
  require("../../../assets/CameraBlue.png"),
  require("../../../assets/ImageBlue.png"),
  require("../../../assets/DocumentBlue.png"),
];
export default function Income({ navigation, route }: Props) {
  const { from, to, amount, id, edit, title } = route.params;

  const [Expense, setExpense] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Transfer, setTransfer] = useState<string>(`$${amount}`);
  const [From, setFrom] = useState(`${from}`);
  const [To, setTo] = useState(`${to}`);
  const [Description, setDescription] = useState(`${title}`);

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
    const numericValue = text.replace(/[^0-9.]/g, "");
    setTransfer(`$${numericValue}`);
  };
  const handleFocus = () => {
    if (Transfer === "" || Transfer === "$0" || Transfer === "$") {
      setTransfer("$");
    }
  };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = auth.currentUser;
  async function add() {
    const numericIncome = parseFloat(Transfer.replace("$", "") || "0");
    let supabaseImageUrl = null;
    if (numericIncome === 0) {
      alert("Add amount");
      return;
    }
    if (From === "") {
      alert("Add From");
      return;
    }
    if (To === "") {
      alert("Add To");
      return;
    }
    if (Description === "") {
      alert("Add description");
      return;
    }

    if (image) {
      supabaseImageUrl = await uploadImage(image);
    }
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
    AddTransaction({
      amount: numericIncome,
      description: Description,
      category: From + " -> " + To,
      moneyCategory: "Transfer",
      Date: new Date().toISOString(),
      userId: user.uid,
      attachment: {
        type: "image",
        uri: supabaseImageUrl,
      },
    });
    navigation.goBack();
  }
  function editTransfer() {
    const numericExpense = parseFloat(Transfer.replace("$", "") || "0");
    dispatch(
      updateTransaction({
        amount: numericExpense,
        description: Description,
        category: From + " -> " + To,
        id: id,
        moneyCategory: "Expense",
      })
    );
    updateDocument("Transactions", id, {
      amount: numericExpense,
      description: Description,
      category: From + " -> " + To,
      moneyCategory: "Transfer",
    });
    navigation.goBack();
    navigation.goBack();
  }

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
                <TouchableOpacity activeOpacity={1}>
                  <TextInput
                    value={Transfer}
                    keyboardType="numeric"
                    onChangeText={handleTransferChange}
                    style={styles.amount}
                    onFocus={handleFocus}
                  ></TextInput>
                </TouchableOpacity>
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
                    />
                  </View>
                  <Image
                    style={{ width: 40, height: 40, position: "absolute", top: "25%", left: "45%" }}
                    source={require("../../../assets/Transfer.png")}
                  />
                </View>
                <Input
                  title={t(StringConstants.Description)}
                  color="rgb(56, 88, 85)"
                  css={styles.textinput}
                  isPass={false}
                  name={Description}
                  onchange={setDescription}
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
                      backgroundColor: "rgba(141, 163, 205, 0.21)",
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
                  bg="rgba(115, 116, 119, 0.14)"
                  color="rgba(0, 119, 255, 1)"
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
