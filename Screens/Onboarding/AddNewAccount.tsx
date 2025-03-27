import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../Components/CustomTextInput";
import { CustomButton } from "../../Components/CustomButton";
import styles from "../Stylesheet";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../Navigation/StackList";
import Header from "../../Components/Header";
import DropDown from "../../Components/DropDown";
type AddnewAccountProp = StackNavigationProp<StackParamList, 'AddNewAccount'>;

interface Props {
  navigation: AddnewAccountProp;
}
const account_type=["Bank","Credit Card","Wallet"]
export default function AddNewAccount({ navigation }:Props) {
    const [isOpen,setOpen]=useState(false)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <Header title="Add new account" press={()=>navigation.goBack()} bgcolor="rgb(56, 88, 85)" color="white"/>
        <View style={styles.add}>
          <View style={styles.balanceView}>
            <Text style={styles.balance}>Balance</Text>
            <Text style={styles.amount}>$00.0</Text>
          </View>

          <View style={styles.selection}>
            <View style={styles.selectinput}>
            <Input title="Name" color="rgb(56, 88, 85)" css={styles.textinput1} />
            </View>
           <DropDown name="Account-Type" data={account_type} open={isOpen} setopen={()=>setOpen(!isOpen)}></DropDown>
            <CustomButton
              title="Continue"
              bg="rgb(42, 124, 118)"
              color="white"
              press={() => navigation.navigate("AllSet")}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
