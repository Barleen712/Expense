import React, { useState } from "react";
import { View, Text, Button, Image, TouchableOpacity, Switch, ImageBackground } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import DropDown from "../../../Components/DropDown";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import Input from "../../../Components/CustomTextInput";
import Entypo from "@expo/vector-icons/Entypo";
import CustomD from "../../../Components/Practice";
type ExpenseProp = StackNavigationProp<StackParamList, "Expense">;

interface Props {
  navigation: ExpenseProp;
}
const category = ["Shopping", "Food", "Entertainment", "Savings", "Transportation", "Bills", "Miscellaneous"];
const wallet = ["PayPal", "Google Pay", "Paytm", "PhonePe", "Apple Pay", "Razorpay", "Mobikwik"];
export default function Transfer({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [showAlert, setAlert] = useState(true);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Transfer" press={() => navigation.goBack()} bgcolor="rgba(0, 119, 255, 1)" color="white" />
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
            </View>
            <Input title="Description" color="rgb(56, 88, 85)" css={styles.textinput} isPass={false} />
            <View
              style={[
                styles.textinput,
                { borderStyle: "dashed", alignItems: "center", flexDirection: "row", justifyContent: "center" },
              ]}
            >
              <Entypo name="attachment" size={24} color="black" />
              <Text>Add attachment</Text>
            </View>

            <CustomButton
              title="Continue"
              bg="rgba(115, 116, 119, 0.14)"
              color="rgba(0, 119, 255, 1)"
              press={() => navigation.goBack()}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
