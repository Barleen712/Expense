import React from "react";
import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import CustomD from "../../../Components/Practice";
import styles from "../../Stylesheet";
const Month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";

type Transactionprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Transactionprop;
}
export default function Transaction({ navigation }: Props) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.transactionHead}>
          <CustomD
            name="Month"
            data={Month}
            styleButton={styles.homeMonth}
            styleItem={styles.dropdownItems}
            styleArrow={styles.homeArrow}
          />
          <TouchableOpacity>
            <Image
              source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/sort.png")}
              style={styles.sortImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.reportView}>
          <TouchableOpacity
            style={styles.financialReport}
            onPress={() => navigation.navigate("FinancialReportExpense")}
          >
            <Text style={styles.reportText}>See your financial report</Text>
            <Image
              style={styles.arrows}
              source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrow.png")}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
