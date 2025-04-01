import React, { useState } from "react";
import { View, Text, Button, Image, TouchableOpacity, Switch, ImageBackground, Modal } from "react-native";
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
export default function Income({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [showAttach, setAttach] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [close, setclose] = useState(false);
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Income" press={() => navigation.goBack()} bgcolor="rgba(0, 168, 107, 1)" color="white" />
        <View style={[styles.add, { backgroundColor: "rgba(0, 168, 107, 1))" }]}>
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
              <View>
                <Image source={{ uri: image }} style={{ width: 90, height: 80, borderRadius: 10 }} />
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
              bg="rgba(173, 210, 189, 0.6)"
              color="rgb(42, 124, 118)"
              press={() => navigation.goBack()}
            />
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalContainer}>
              <SelectImageWithDocumentPicker
                toggle={toggleModal}
                setAttach={() => setAttach(!showAttach)}
                image={image}
                setImage={setImage}
                setclose={() => setclose(!close)}
              />
            </TouchableOpacity>
          </View>
        </Modal>
        {close && (
          <TouchableOpacity
            style={{ position: "absolute", bottom: "30%", right: "37%" }}
            onPress={() => {
              setImage(null);
              setAttach(!showAttach);
              setclose(false);
            }}
          >
            <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/close.png")} />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
