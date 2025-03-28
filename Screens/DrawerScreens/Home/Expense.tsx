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
export default function Expense({ navigation }: Props) {
  const [Expense, setExpense] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [showAlert, setAlert] = useState(true);
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
            <View
              style={[
                styles.textinput,
                { borderStyle: "dashed", alignItems: "center", flexDirection: "row", justifyContent: "center" },
              ]}
            >
              <Entypo name="attachment" size={24} color="black" />
              <Text>Add attachment</Text>
            </View>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
