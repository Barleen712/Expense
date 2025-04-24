import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { useSelector, useDispatch } from "react-redux";
import { updateEmail } from "firebase/auth";
import { updateExceed, updateExpenseAlert } from "../../../Slice/IncomeSlice";
type NotificationProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: NotificationProp;
}
export default function Notification({ navigation }: Props) {
  const dispatch = useDispatch();
  const exceed = useSelector((state) => state.Money.exceedNotification);
  const expenseAlert = useSelector((state) => state.Money.expenseAlert);
  const [Tips, setTips] = useState(false);
  const [Budget, setBudget] = useState(exceed);
  const [Expense, setExpense] = useState(expenseAlert);
  console.log;
  function exceedFunc() {
    setBudget(!Budget);
    dispatch(updateExceed(!Budget));
  }
  function expenseAlertFunc() {
    setExpense(!Expense);
    dispatch(updateExpenseAlert(!Expense));
  }
  return (
    <View style={styles.container}>
      <Header title="Notification" press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <View style={styles.notiView}>
        <View style={styles.noti}>
          <Text style={styles.notiTitle}>Expense Alert</Text>
          <Text style={styles.notiDes}>Get Notification about your expense</Text>
        </View>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
            value={Expense}
            thumbColor={"white"}
            onValueChange={expenseAlertFunc}
          />
        </View>
      </View>
      <View style={styles.Line}></View>
      <View style={styles.notiView}>
        <View style={styles.noti}>
          <Text style={styles.notiTitle}>Budget</Text>
          <Text style={styles.notiDes}>Get Notification when your budget exceeds limit</Text>
        </View>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
            value={Budget}
            thumbColor={"white"}
            onValueChange={exceedFunc}
          />
        </View>
      </View>
      <View style={styles.Line}></View>
      <View style={styles.notiView}>
        <View style={styles.noti}>
          <Text style={styles.notiTitle}>Tips & Articles</Text>
          <Text style={styles.notiDes}>Small & useful pieces of practical financial advice</Text>
        </View>
        <View>
          <Switch
            style={styles.switch}
            trackColor={{ false: "rgba(220, 234, 233, 0.6)", true: "rgb(42, 124, 118)" }}
            value={Tips}
            thumbColor={"white"}
            onValueChange={setTips}
          />
        </View>
      </View>
      <View style={styles.Line}></View>
    </View>
  );
}
