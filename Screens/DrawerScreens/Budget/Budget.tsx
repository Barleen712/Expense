import React, { useState } from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../../Navigation/StackList";
const Months = [
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
const date = new Date();
const MonthIndex = date.getMonth();
type Budgetprop = StackNavigationProp<StackParamList, 'MainScreen'>;

interface Props {
  navigation: Budgetprop;
}

export default function Budget({navigation}:Props) {
  function handleprev() {
    setmonth(month - 1);
    if (month == 0) {
      setmonth(11);
    }
  }
  function handlenext() {
    setmonth(month + 1);
    if (month == 11) {
      setmonth(0);
    }
  }
  const [month, setmonth] = useState(MonthIndex);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      
        <View style={styles.add}>
          <View style={styles.budgetMonth}>
            <TouchableOpacity onPress={handleprev}>
              <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowLeftWhite.png")} />
            </TouchableOpacity>
            <Text style={styles.budgetMonthtext}>{Months[month]}</Text>
            <TouchableOpacity onPress={handlenext}>
              <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowRightWhite.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.budgetView}>
            <Text style={styles.budgetText}>You don’t have a budget.</Text>
            <Text style={styles.budgetText}> Let’s make one so you in control.</Text>
            <View style={styles.budgetButton}>
              <CustomButton title="Create a budget" bg="rgb(42, 124, 118)" color="white" press={()=>navigation.navigate("CreateBudget")}/>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
