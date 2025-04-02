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
import SelectImageWithDocumentPicker from "./Attachment";

type IncomeProp = StackNavigationProp<StackParamList, "Income">;

interface Props {
  navigation: IncomeProp;
}
const category = ["Shopping", "Food", "Entertainment", "Savings", "Transportation", "Bills", "Miscellaneous"];
const wallet = ["PayPal", "Google Pay", "Paytm", "PhonePe", "Apple Pay", "Razorpay", "Mobikwik"];
const modal = [
  require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/CameraRed.png"),
  require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/ImageRed.png"),
  require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/DocumentRed.png"),
];
export default function Income({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Expense" press={() => navigation.goBack()} bgcolor="rgba(253, 60, 74, 1)" color="white" />
        <View style={[styles.add, { backgroundColor: "rgba(253, 60, 74, 1)" }]}>
          <View style={styles.balanceView}>
            <Text style={styles.balance}>How much ?</Text>
            <Text style={styles.amount}>$0</Text>
          </View>
          <View style={[styles.selection]}>
            <CustomD
              name="Category"
              data={category}
              styleButton={styles.textinput}
              styleItem={styles.dropdownItems}
              styleArrow={styles.arrowDown}
            />
            <Input title="Description" color="rgb(56, 88, 85)" css={styles.textinput} isPass={false} />
            <CustomD
              name="Wallet"
              data={wallet}
              styleButton={styles.textinput}
              styleItem={styles.dropdownItems}
              styleArrow={styles.arrowDown}
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
            <CustomButton
              title="Continue"
              bg="rgba(205, 153, 141, 0.13)"
              color="rgba(253, 60, 74, 1)"
              press={() => navigation.goBack()}
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
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {close && (
          <>
            {image && (
              <TouchableOpacity
                style={{ position: "absolute", bottom: Platform.OS === "ios" ? "31%" : "28%", left: "28%" }}
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

            {document && (
              <TouchableOpacity
                style={{ position: "absolute", bottom: Platform.OS === "ios" ? "27%" : "25%", right: "3%" }}
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
