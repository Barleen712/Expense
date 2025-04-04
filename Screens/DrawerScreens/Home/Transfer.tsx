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
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
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
  require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/CameraBlue.png"),
  require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/ImageBlue.png"),
  require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/DocumentBlue.png"),
];
export default function Income({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
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
        <Header title="Transfer" press={() => navigation.goBack()} bgcolor="rgba(0, 119, 255, 1)" color="white" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              scrollEnabled={Platform.OS === "ios" ? false : true}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[styles.add, { backgroundColor: "rgba(0, 119, 255, 1)" }]}>
                <View style={styles.balanceView}>
                  <Text style={styles.balance}>How much ?</Text>
                  <Text style={styles.amount}>$0</Text>
                </View>
                <View style={[styles.selection]}>
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View style={{ width: "50%" }}>
                      <Input title="From" color="rgb(56, 88, 85)" css={styles.textinput} isPass={false} />
                    </View>
                    <View style={{ width: "50%" }}>
                      <Input title="To" color="rgb(56, 88, 85)" css={styles.textinput} isPass={false} />
                    </View>
                    <Image
                      style={{ width: 40, height: 40, position: "absolute", top: "25%", left: "45%" }}
                      source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Transfer.png")}
                    />
                  </View>
                  <Input title="Description" color="rgb(56, 88, 85)" css={styles.textinput} isPass={false} />

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
                        backgroundColor: "rgba(141, 163, 205, 0.21)",
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
                    bg="rgba(115, 116, 119, 0.14)"
                    color="rgba(0, 119, 255, 1)"
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
