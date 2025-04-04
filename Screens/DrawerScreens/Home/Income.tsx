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
  ScrollView,
  TextInput,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import DropDown from "../../../Components/DropDown";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import Entypo from "@expo/vector-icons/Entypo";
import Input from "../../../Components/CustomTextInput";
import CustomD from "../../../Components/Practice";
import { useSelector, useDispatch } from "react-redux";
import SelectImageWithDocumentPicker from "./Attachment";
import { addValue, total } from "../../../Slice/IncomeSlice";

type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}

const category = ["Shopping", "Food", "Entertainment", "Savings", "Transportation", "Bills", "Miscellaneous"];
const wallet = ["PayPal", "Google Pay", "Paytm", "PhonePe", "Apple Pay", "Razorpay", "Mobikwik"];
export default function Income({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [Income, setIncome] = useState<string>("$0");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [Description, setDescription] = useState("");
  const modal = [
    require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Camera.png"),
    require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Image.png"),
    require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Document.png"),
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
    const numericValue = text.replace(/[^0-9.]/g, "");
    setIncome(`$${numericValue}`);
  };
  const dispatch = useDispatch();
  function add() {
    const numericIncome = parseFloat(Income.replace("$", "") || "0");
    dispatch(
      addValue({
        amount: numericIncome,
        description: Description,
        category: selectedCategory,
        wallet: selectedWallet,
        moneyCategory: "Income",
      })
    );
    dispatch(total());
    navigation.goBack();
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Income" press={() => navigation.goBack()} bgcolor="rgba(0, 168, 107, 1)" color="white" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              scrollEnabled={Platform.OS === "ios" ? false : true}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[styles.add, { backgroundColor: "rgba(0, 168, 107, 1))" }]}>
                <View style={styles.balanceView}>
                  <Text style={styles.balance}>How much ?</Text>
                  <TouchableOpacity activeOpacity={1}>
                    <TextInput
                      value={Income}
                      keyboardType="numeric"
                      onChangeText={handleIncomeChange}
                      style={styles.amount}
                      onFocus={handleFocus}
                    ></TextInput>
                  </TouchableOpacity>
                </View>
                <View style={[styles.selection]}>
                  <CustomD
                    name="Category"
                    data={category}
                    styleButton={styles.textinput}
                    styleItem={styles.dropdownItems}
                    styleArrow={styles.arrowDown}
                    onSelectItem={(item) => setSelectedCategory(item)}
                  />
                  <Input
                    title="Description"
                    color="black"
                    css={styles.textinput}
                    isPass={false}
                    name={Description}
                    onchange={setDescription}
                  />
                  <CustomD
                    name="Wallet"
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
                      <Text>Add attachment</Text>
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
                      <Text style={styles.notiTitle}>Repeat</Text>
                      <Text style={styles.notiDes}>Repeat Transaction</Text>
                    </View>
                    <View style={styles.switch}>
                      <Switch
                        trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
                        value={Expense}
                        thumbColor={"white"}
                        onValueChange={setExpense}
                      />
                    </View>
                  </View>
                  <CustomButton title="Continue" bg="rgba(173, 210, 189, 0.6)" color="rgb(42, 124, 118)" press={add} />
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
                      <Image
                        style={{ width: 15, height: 15 }}
                        source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/close.png")}
                      />
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
                      <Image
                        style={{ width: 15, height: 15 }}
                        source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/close.png")}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
